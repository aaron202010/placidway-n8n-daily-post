// n8n Code node: "Config" (exact copy of the code inside workflow.json)
// CONFIG: the one place to change behaviour. Webhook test runs may override a few keys (whitelisted below).
const DEFAULTS = {
  review_mode: 'auto',            // 'auto' = publish straight away | 'approval' = send draft to a reviewer first
  publish_mode: 'simulation',     // 'simulation' = log the exact Graph API request, post nothing | 'live' = post to the TEST page
  fb_page_id: 'REPLACE_WITH_TEST_PAGE_ID', // a Facebook Page you own (never a PlacidWay page)
  fb_graph_version: 'v27.0',          // version used in Meta's Pages API docs, checked 2026-11-10
  schedule_minutes_ahead: 0,      // 0 = publish now; 15 to 43200 (30 days, Meta's limit) = schedule on Facebook
  site: 'https://www.placidway.com',
  user_agent: 'PlacidWayAssessmentBot/1.0 (take-home demo; one post per day; respects robots.txt)',
  min_delay_ms: 1000,             // brief: max 1 request per second. robots.txt Crawl-delay wins if larger (3 s today).
  archive_fallback: true,         // if PlacidWay refuses us (e.g. Cloudflare 403), read the Internet Archive copy instead
  sitemaps: {                     // child sitemaps listed in https://www.placidway.com/sitemap.xml
    article: '/1/sitemap_articles.xml',
    package: '/1/sitemap_packages.xml',
    answer: '/sitemap/1/sitemap_answers.xml',
    news: '/1/sitemap_news.xml',
  },
  // Variety rule (stretch goal): a different content type each weekday, Asia/Manila time.
  rotation: { Mon: 'article', Tue: 'package', Wed: 'answer', Thu: 'article', Fri: 'news', Sat: 'package', Sun: 'answer' },
  draft_model: 'claude-haiku-5-5',
  checker_model: 'claude-sonnet-5-5',
  max_attempts: 2,                // first draft + one rewrite with the checker's feedback
  approval_timeout_hours: 24,
  n8n_base_url: 'https://YOUR-N8N-HOST',
};

const item = $input.first().json;
let trigger = 'manual';
let overrides = {};
if (item.body !== undefined && item.headers !== undefined) { trigger = 'webhook'; overrides = item.body || {}; }
else if (item.timestamp || item['Readable date']) trigger = 'schedule';

const cfg = { ...DEFAULTS };
const allowed = {
  review_mode: ['auto', 'approval'],
  publish_mode: ['simulation', 'live'],
  content_type: Object.keys(DEFAULTS.sitemaps),
  archive_fallback: [true, false],
};
for (const [k, vals] of Object.entries(allowed)) {
  if (overrides[k] !== undefined) {
    if (!vals.includes(overrides[k])) throw new Error(`Config override ${k}=${overrides[k]} is not one of ${vals.join(', ')}`);
    cfg[k] = overrides[k];
  }
}
// Test hooks (webhook only): force a specific page, or inject a bad first draft to demonstrate the guardrails.
const test = {
  override_url: typeof overrides.override_url === 'string' ? overrides.override_url : null,
  test_draft: overrides.test_draft && typeof overrides.test_draft === 'object' ? overrides.test_draft : null,
};
if (test.override_url && !test.override_url.startsWith(cfg.site + '/')) throw new Error('override_url must be a PlacidWay URL');

const weekday = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', weekday: 'short' });
cfg.content_type = cfg.content_type || cfg.rotation[weekday] || 'article';

return [{ json: { run_id: String($execution.id), started_at: new Date().toISOString(), trigger, weekday, cfg, test } }];
