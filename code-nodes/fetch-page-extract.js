// n8n Code node: "Fetch page + extract" (exact copy of the code inside workflow.json)
// ---- polite fetch helpers (same block in each fetching node) ----
const helpers = this.helpers;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lastHit = {}; // host -> time of our last request; seeded from the previous node so the gap holds across nodes
const reqLog = []; // every request with its UTC time, carried to the end of the run as proof of the gap
async function politeGet(url, cfg, delayMs, opts = {}) {
  // One request at a time, at least delayMs apart per host. Retries only what is worth retrying:
  // network errors, timeouts, 429 and 5xx, with growing backoff. 403/404 are answers, not glitches: no retry.
  const host = (url.match(/^https?:\/\/([^/?#]+)/i) || [, url])[1];
  const attempts = opts.attempts || 3;
  let last = null;
  for (let i = 1; i <= attempts; i++) {
    const wait = (lastHit[host] || 0) + delayMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastHit[host] = Date.now();
    reqLog.push({ at: new Date(lastHit[host]).toISOString(), host, path: url.replace(/^https?:\/\/[^/]+/, '').slice(0, 60) });
    try {
      const res = await helpers.httpRequest({
        url, method: 'GET', returnFullResponse: true, ignoreHttpStatusErrors: true, timeout: 30000, json: false,
        headers: { 'User-Agent': cfg.user_agent, Accept: opts.accept || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
      });
      const status = res.statusCode;
      const b = res.body;
      const body = typeof b === 'string' ? b : (b && typeof b.readUInt8 === 'function') ? b.toString('utf8') : JSON.stringify(b ?? '');
      last = { url, status, body, attempts: i };
      if (status === 429 || status >= 500) { await sleep(delayMs * i * 2); continue; }
      return last;
    } catch (e) {
      last = { url, status: 0, body: '', error: e.message, attempts: i };
      await sleep(delayMs * i * 2);
    }
  }
  return last;
}
function waybackStamp() { return new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14); }
const seedClock = (st) => { Object.assign(lastHit, st.fetch_clock || {}); reqLog.push(...(st.req_log || [])); };
const carryClock = () => ({ fetch_clock: lastHit, req_log: reqLog });
// ---- end helpers ----
// Step 3: fetch the chosen page (newest unused first) and pull out title, summary, body text and featured image.
const s = $input.first().json;
const cfg = s.cfg;
seedClock(s); // continue the clock from the sitemap fetch
// Pure extraction function, shared logic for the n8n "Extract article" Code node.
// Pure extraction function, shared logic for the n8n "Extract article" Code node.
function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&ndash;|&mdash;/g, '-').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}
function meta(html, key) {
  const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? decode(m[1]).trim() : '';
}
function extractPage(html, url) {
  const out = { url };
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || [])[1];
  out.canonical_url = canon || url;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  out.title = (h1 ? decode(h1[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim() : '') || meta(html, 'og:title') ||
    decode((html.match(/<title>([^<]*)<\/title>/i) || [, ''])[1]).trim();
  // Package pages show the package's own starting price in the first .actual-price block.
  const price = html.match(/class=["']actual-price["'][^>]*>\s*(?:<span[^>]*>)?\s*([$€£₹₺][\s\d,.]+|\d[\d,.]*\s?(?:USD|EUR|GBP))\s*(?:<\/span>)?\s*(?:<span[^>]*>)?\s*([^<]{0,40})/i);
  out.listed_price = price ? decode(`${price[1].trim()} ${price[2].trim()}`).replace(/\s+/g, ' ').trim() : null;
  out.summary = meta(html, 'description') || meta(html, 'og:description');
  out.image_url = meta(html, 'og:image') || meta(html, 'twitter:image') || null;
  // Body: from the H1 to the first "related / reviews / footer" marker, tags stripped.
  let body = html.replace(/<(script|style|noscript|svg|iframe|form|nav|header)[\s\S]*?<\/\1>/gi, ' ');
  // Main content container used by PlacidWay article, package and Q&A templates; fall back to the H1.
  let start = -1;
  for (const marker of ['article-dt-desc', 'pack-inner-content']) { start = body.indexOf(marker); if (start >= 0) break; }
  if (start < 0) start = h1 ? Math.max(0, body.indexOf(h1[0].slice(0, 40))) : 0;
  body = body.slice(start);
  const stops = ['related-packages-sec', 'pw-stat', '<footer', 'related-articles', 'Related Articles'];
  let end = body.length;
  for (const s of stops) { const i = body.indexOf(s, 200); if (i > 0 && i < end) end = i; }
  body = body.slice(body.indexOf('>') + 1, end).replace(/<\/(p|div|li|h[1-6]|br|tr)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ');
  body = decode(body).replace(/[ \t ]+/g, ' ').replace(/\s*\n\s*/g, '\n').replace(/\n{2,}/g, '\n').trim();
  out.body_text = body.slice(0, 7000);
  out.body_chars = body.length;
  out.ok = !!(out.title && out.body_text.length > 300 && !/page not found|404 error|Attention Required/i.test(out.title));
  return out;
}
let mode = s.site_access.sitemap_source === 'archive' ? 'archive' : 'live';
const tried = [];
let page = null;
// Live: newest first, up to 5 pages. Archive: the newest pages are rarely archived yet, so walk down the
// ranking in growing steps (ranks 0-4, 6, 9, 13 ... 900) and take the newest one the archive holds.
const RANKS = [0, 1, 2, 3, 4, 6, 9, 13, 18, 24, 31, 39, 48, 58, 70, 85, 100, 120, 145, 175, 210, 250, 300, 360, 430, 520, 620, 750, 900];
let liveTries = 0;
for (let r = 0; r < s.shortlist.length; r++) {
  if (mode === 'live' && ++liveTries > 5) break;
  if (mode === 'archive' && !RANKS.includes(r)) continue;
  const c = s.shortlist[r];
  let res = null, snapshot = null, source = mode;
  if (mode === 'live') {
    res = await politeGet(c.url, cfg, s.robots.delay_ms);
    tried.push({ url: c.url, via: 'live', status: res.status });
    if ((res.status === 403 || res.status === 0) && cfg.archive_fallback) { mode = 'archive'; source = 'archive'; res = null; }
    else if (res.status !== 200) continue;
  }
  if (mode === 'archive') {
    const av = await politeGet(`https://archive.org/wayback/available?url=${encodeURIComponent(c.url.replace(/^https?:\/\//, ''))}&timestamp=${waybackStamp()}`, cfg, 1100, { accept: 'application/json' });
    let closest = null;
    try { closest = JSON.parse(av.body).archived_snapshots.closest; } catch (e) {}
    if (!closest || !closest.available) { tried.push({ url: c.url, via: 'archive', status: 'no snapshot' }); continue; }
    snapshot = closest.timestamp;
    res = await politeGet(`https://web.archive.org/web/${snapshot}id_/${c.url}`, cfg, 1100);
    tried.push({ url: c.url, via: 'archive', status: res.status, snapshot });
    if (res.status !== 200) continue;
  }
  const p = extractPage(res.body, c.url);
  if (!p.ok) { tried[tried.length - 1].status = 'extract failed'; continue; }
  // Prefer the original S3 image (no Cloudflare in front) so Facebook can always fetch it.
  let img = p.image_url || c.sitemap_image || null;
  if (img && img.includes('https://placidwaycdn.s3')) img = img.slice(img.indexOf('https://placidwaycdn.s3'));
  page = { ...p, url: c.url, canonical_url: c.url, image_url: img, content_id: c.id, fetch_source: source, snapshot };
  break;
}
if (!page) {
  const summary = tried.reduce((m, t) => ((m[`${t.via} ${t.status}`] = (m[`${t.via} ${t.status}`] || 0) + 1), m), {});
  throw new Error(`[site] could not read any of ${tried.length} candidate pages (${Object.entries(summary).map(([k, v]) => v + 'x ' + k).join(', ')})`);
}
const { shortlist, ...rest } = s;
return [{ json: { ...rest, ...carryClock(), page, fetch_log: tried } }];
