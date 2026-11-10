// n8n Code node: "Pick today's item" (exact copy of the code inside workflow.json)
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
function robotsAllows(rules, path) {
  // Longest matching rule wins; Allow wins a tie (Google / RFC 9309 behaviour). Supports * and $.
  let best = null;
  for (const r of rules) {
    let p = r.path; const anchored = p.endsWith('$'); if (anchored) p = p.slice(0, -1);
    const re = new RegExp('^' + p.split('*').map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + (anchored ? '$' : ''));
    if (re.test(path) && (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.type === 'allow'))) best = r;
  }
  return !best || best.type === 'allow';
}
// Step 2: read today's sitemap, drop anything robots.txt disallows or we already used, rank newest first.
const bare = (u) => u.replace(/^https?:\/\//, ''); // n8n cuts an error message at its first colon, so no scheme in messages
const pathOf = (u) => (u.match(/^https?:\/\/[^/?#]+([^?#]*)/i) || [, '/'])[1] || '/';
const s = $('Read robots.txt').first().json;
const cfg = s.cfg;
seedClock(s); // continue the 3 s clock started by the robots.txt fetch
const used = new Set($input.all().map((i) => i.json.url).filter(Boolean));
const delay = s.robots.delay_ms;
let source = 'live', live_status = null, xml = null, candidates = [];

if (s.test.override_url) {
  const u = s.test.override_url;
  if (!robotsAllows(s.robots.rules, pathOf(u))) throw new Error(`[robots] ${bare(u)} is disallowed by robots.txt. Not fetching it.`);
  if (used.has(u)) throw new Error(`[select] ${bare(u)} was already used on an earlier run. Never posting the same URL twice.`);
  candidates = [{ url: u, id: 0, lastmod: null, sitemap_image: null }];
} else {
  const path = cfg.sitemaps[cfg.content_type];
  if (!robotsAllows(s.robots.rules, path)) throw new Error(`[robots] sitemap ${path} is disallowed by robots.txt`);
  const live = await politeGet(cfg.site + path, cfg, delay, { accept: 'application/xml,text/xml' });
  live_status = live.status;
  if (live.status === 200 && live.body.includes('<urlset')) xml = live.body;
  else if (cfg.archive_fallback) {
    source = 'archive';
    const arc = await politeGet(`https://web.archive.org/web/${waybackStamp()}id_/${cfg.site}${path}`, cfg, 1100, { accept: 'application/xml,text/xml' });
    if (arc.status === 200 && arc.body.includes('<urlset')) xml = arc.body;
    else throw new Error(`[site] sitemap unavailable (live HTTP ${live.status}${live.error ? ' ' + live.error.replace(/:/g, ' ') : ''}, archive HTTP ${arc.status})`);
  } else throw new Error(`[site] sitemap unavailable (live HTTP ${live.status}${live.error ? ' ' + live.error.replace(/:/g, ' ') : ''}, archive fallback off)`);

  for (const block of xml.split('<url>').slice(1)) {
    const loc = (block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1];
    if (!loc) continue;
    const pathname = pathOf(loc);
    if (used.has(loc) || !robotsAllows(s.robots.rules, pathname)) continue;
    const id = parseInt((pathname.match(/^\/[a-z-]+\/(\d+)/) || [])[1] || '0', 10);
    candidates.push({
      url: loc, id,
      lastmod: (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || null,
      sitemap_image: (block.match(/<image:loc>([^<]+)<\/image:loc>/) || [])[1] || null,
    });
  }
  // "Newest first": news has real lastmod dates; for the rest PlacidWay regenerates lastmod daily,
  // so the numeric content id (auto-increment) is the honest recency signal.
  candidates.sort((a, b) => (cfg.content_type === 'news' ? String(b.lastmod).localeCompare(String(a.lastmod)) : 0) || b.id - a.id);
}
if (!candidates.length) throw new Error(`[select] no unused ${cfg.content_type} URL left in the sitemap`);
return [{ json: { ...s, ...carryClock(), used_count: used.size, site_access: { sitemap_source: source, live_status }, shortlist: candidates.slice(0, 1000), candidate_total: candidates.length } }];
