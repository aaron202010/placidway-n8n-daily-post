// n8n Code node: "Rule check" (exact copy of the code inside workflow.json)
// Guardrail 1 of 2: deterministic rules. Cheap, explainable, never "creative". Catches the obvious every time.
const s = $input.first().json;
const d = s.draft;
const p = s.page;
const issues = [];
const add = (type, quote, reason) => issues.push({ type, quote, reason, by: 'rules' });
const textNoLink = [d.hook, ...d.lines, d.cta].join('\n');
const source = [p.title, p.summary, p.listed_price, p.body_text].join('\n');
const norm = (t) => t.toLowerCase().replace(/[’']/g, "'");
const srcN = norm(source);

// 1. Structure and length (brief: hook, 2-4 lines, CTA, link, 3-5 hashtags, < 500 chars before the link)
if (d.parse_error) add('format', '', 'model did not return valid JSON');
if (!d.hook) add('format', '', 'missing hook');
if (d.lines.length < 2 || d.lines.length > 4) add('format', '', `needs 2-4 value lines, got ${d.lines.length}`);
if (!d.cta) add('format', '', 'missing call to action');
if (d.hashtags.length < 3 || d.hashtags.length > 5) add('format', d.hashtags.join(' '), `needs 3-5 hashtags, got ${d.hashtags.length}`);
for (const h of d.hashtags) if (!/^#[A-Za-z][A-Za-z0-9]{1,40}$/.test(h)) add('format', h, 'hashtag must be letters/digits only');
if (s.pre_link_chars >= 500) add('format', '', `text before the link is ${s.pre_link_chars} chars (limit 500)`);
if (/https?:\/\//i.test(textNoLink)) add('format', '', 'the model wrote a URL itself; only the code adds the link');
if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(textNoLink)) add('format', '', 'emoji found (house style: none)');

// 2. Medical claims and outcome promises (a word list a compliance person can read and extend)
const CLAIMS = [
  [/\bguarantee[sd]?\b|\bguaranteed\b/i, 'outcome_promise'],
  [/\b100\s?%/i, 'outcome_promise'],
  [/\brisk[- ]free\b|\bno risks?\b|\bzero risk\b|\bsafe and effective\b|\bno side[- ]effects\b/i, 'outcome_promise'],
  [/\bpain[- ]free\b|\bpainless\b/i, 'outcome_promise'],
  [/\bpermanent(ly)?\b/i, 'outcome_promise'],
  [/\bmiracle\b|\blife[- ]changing\b|\btransform(s|ed|ative)? your\b|\bget your (life|confidence|body) back\b/i, 'outcome_promise'],
  [/\binstant results?\b|\bperfect results?\b|\bbest results?\b/i, 'outcome_promise'],
  [/\bcure[sd]?\b|\bcuring\b/i, 'medical_claim'],
  [/\b(will|can|to)\s+(heal|fix|reverse|eliminate|restore|regenerate)\b/i, 'medical_claim'],
  [/\b(clinically )?proven\b/i, 'medical_claim'],
  [/\b(success|survival|cure) rates?\b/i, 'medical_claim'],
];
const claimText = textNoLink + '\n' + d.hashtags.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2'); // #MiracleCure -> Miracle Cure
for (const [re, type] of CLAIMS) { const m = claimText.match(re); if (m) add(type, m[0], 'banned phrase for health ads (claim or promise)'); }

// 3. Numbers and prices must appear in the source, character for character (commas ignored)
const nums = textNoLink.match(/(?:[$€£₹₺]|USD|EUR|GBP)\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s?(?:%|percent)?/gi) || [];
const srcDigits = source.replace(/,/g, '');
for (const n of nums) {
  const digits = (n.match(/\d[\d,]*(?:\.\d+)?/) || [''])[0].replace(/,/g, '');
  if (!digits) continue;
  const isMoney = /[$€£₹₺]|USD|EUR|GBP/i.test(n);
  if (!new RegExp('(^|[^\\d])' + digits.replace('.', '\\.') + '([^\\d]|$)').test(srcDigits)) {
    add(isMoney ? 'invented_price' : 'unsupported_fact', n.trim().replace(/[,.]$/, ''), 'number not found in the source page');
  } else if (/%|percent/i.test(n)) add('medical_claim', n.trim(), 'percentages are not allowed in posts (rates and odds read as promises)');
}
if (/\b(cheap(est)?|lowest price|save up to|discount|\d+% off)\b/i.test(textNoLink) && !/\b(cheap|lowest|save|discount)/i.test(source)) add('invented_price', '', 'savings or discount wording not in the source');

// 4. Superlatives and rankings only when the source says them
for (const w of ['best', 'top', 'leading', 'number one', '#1', 'world-class', 'world class', 'renowned', 'award-winning', 'most trusted']) {
  const re = new RegExp('(^|[^a-z])' + w.replace(/[#-]/g, (c) => '\\' + c) + '([^a-z]|$)', 'i');
  if (re.test(textNoLink) && !re.test(srcN)) add('unsupported_fact', w, 'superlative not used by the source page');
}
const rule_check = { pass: issues.length === 0, issues };
return [{ json: { ...s, rule_check } }];
