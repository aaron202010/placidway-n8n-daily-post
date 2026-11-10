// n8n Code node: "Read robots.txt" (exact copy of the code inside workflow.json)
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
// Step 1: read robots.txt before anything else and keep its rules for every later request.
const s = $input.first().json;
const cfg = s.cfg;
const res = await politeGet(cfg.site + '/robots.txt', cfg, cfg.min_delay_ms, { accept: 'text/plain' });
if (!res || res.status !== 200 || !/user-agent/i.test(res.body)) {
  throw new Error(`[site] robots.txt not readable (HTTP ${res && res.status}${res && res.error ? ', ' + res.error.replace(/:/g, ' ') : ''}). Not crawling without it.`);
}
function parseRobots(txt, agent) {
  const groups = []; let cur = null; let lastWasUA = false;
  for (const raw of txt.split(/\r?\n/)) {
    const l = raw.replace(/#.*/, '').trim();
    const m = l.match(/^([A-Za-z-]+)\s*:\s*(.*)$/); if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2].trim();
    if (k === 'user-agent') { if (!cur || !lastWasUA) { cur = { agents: [], rules: [], delay: null }; groups.push(cur); } cur.agents.push(v.toLowerCase()); lastWasUA = true; continue; }
    lastWasUA = false; if (!cur) continue;
    if ((k === 'allow' || k === 'disallow') && v) cur.rules.push({ type: k, path: v });
    else if (k === 'crawl-delay') cur.delay = parseFloat(v);
  }
  const token = agent.toLowerCase();
  const g = groups.find((g) => g.agents.some((a) => a !== '*' && token.includes(a))) || groups.find((g) => g.agents.includes('*'));
  return g ? { rules: g.rules, crawl_delay_s: g.delay } : { rules: [], crawl_delay_s: null };
}
const parsed = parseRobots(res.body, 'PlacidWayAssessmentBot');
const delay_ms = Math.max(cfg.min_delay_ms, (parsed.crawl_delay_s || 0) * 1000);
return [{ json: { ...s, ...carryClock(), robots: { rules: parsed.rules, crawl_delay_s: parsed.crawl_delay_s, delay_ms, rule_count: parsed.rules.length } } }];
