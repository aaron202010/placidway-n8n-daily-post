// n8n Code node: "Build approval message" (exact copy of the code inside workflow.json)
// Approval mode: post the draft to the reviewer channel with Approve / Reject links that resume this exact run.
const s = $input.first().json;
const base = $execution.resumeUrl;
const sep = base.includes('?') ? '&' : '?';
const approve_url = `${base}${sep}action=approve`;
const reject_url = `${base}${sep}action=reject`;
// <...> stops Discord from unfurling the links (an unfurl bot must never "click" Approve). The Wait node also ignores bots.
const quoted = s.post_text.split('\n').map((l) => '> ' + l).join('\n');
let content = `**PlacidWay post waiting for review** (run ${s.run_id}, ${s.cfg.content_type}, publish mode: ${s.cfg.publish_mode})
Source: <${s.page.canonical_url}>
Image: ${s.page.image_url ? '<' + s.page.image_url + '>' : 'none'}
Guardrails: rules ${s.rule_check.pass ? 'pass' : 'fail'}, LLM check ${s.llm_check.pass ? 'pass' : 'fail'} (attempt ${s.attempt})

${quoted}

Approve: <${approve_url}>
Reject: <${reject_url}>
Expires in ${s.cfg.approval_timeout_hours} h; no answer = not posted.`;
if (content.length > 1990) content = content.slice(0, 1985) + '...';
return [{ json: { ...s, approval: { approve_url, reject_url, sent_at: new Date().toISOString() }, discord_content: content } }];
