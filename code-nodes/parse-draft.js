// n8n Code node: "Parse draft" (exact copy of the code inside workflow.json)
// Step 5: turn the model's JSON into the final post. The link and the layout are added by code, never by the model,
// so the URL can't be hallucinated and the structure is always hook / value lines / CTA / link / hashtags.
const s = $('Build draft request').item.json;
const resp = $input.first().json;
let raw = (resp.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
let used_test_draft = false;
let d = null;
if (s.attempt === 1 && s.test && s.test.test_draft) { d = s.test.test_draft; used_test_draft = true; raw = JSON.stringify(d); }
else {
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  try { d = JSON.parse(raw.slice(a, b + 1)); } catch (e) { d = null; }
}
const clean = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const draft = d ? {
  hook: clean(d.hook),
  lines: Array.isArray(d.lines) ? d.lines.map(clean).filter(Boolean) : [],
  cta: clean(d.cta),
  hashtags: Array.isArray(d.hashtags) ? d.hashtags.map((h) => '#' + clean(h).replace(/^#+/, '').replace(/\s+/g, '')) : [],
} : { hook: '', lines: [], cta: '', hashtags: [], parse_error: raw.slice(0, 300) };
// Length is enforced by code, not trusted to the model: drop trailing value lines (never add text) until it fits.
let body = [draft.hook, '', ...draft.lines, '', draft.cta].join('\n').trim();
while (body.length >= 500 && draft.lines.length > 2) {
  draft.trimmed = (draft.trimmed || 0) + 1;
  draft.lines.pop();
  body = [draft.hook, '', ...draft.lines, '', draft.cta].join('\n').trim();
}
const post_text = `${body}\n\n${s.page.canonical_url}\n\n${draft.hashtags.join(' ')}`;
const { anthropic_body, ...rest } = s;
return [{ json: { ...rest, draft, post_text, pre_link_chars: body.length, used_test_draft,
  draft_usage: resp.usage || null } }];
