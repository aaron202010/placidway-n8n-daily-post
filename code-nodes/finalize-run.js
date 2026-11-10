// n8n Code node: "Finalize run" (exact copy of the code inside workflow.json)
// One exit for every outcome: build the log row, the "remember this URL" row, and the Discord line.
const s = $input.first().json;
const c = s.cfg || {};
const p = s.page || {};
let kind = s.kind || (s.guardrail && !s.guardrail.pass ? 'blocked' : 'failure');
const status = kind === 'success' ? s.fb_status : kind;   // simulated | published | scheduled | blocked | rejected | expired | failure
const execUrl = `${c.n8n_base_url || ''}/workflow/${$workflow.id}/executions/${s.run_id || $execution.id}`;
const issues = (s.guardrail && s.guardrail.issues) || [];
const row = {
  run_id: String(s.run_id || $execution.id), started_at: s.started_at || '', trigger: s.trigger || '',
  review_mode: c.review_mode || '', publish_mode: c.publish_mode || '', content_type: c.content_type || '',
  url: p.canonical_url || '', title: (p.title || '').slice(0, 300), image_url: p.image_url || '',
  fetch_source: p.fetch_source ? `${p.fetch_source}${p.snapshot ? ' ' + p.snapshot : ''}` : '',
  post_text: s.post_text || '',
  rule_check: s.rule_check ? JSON.stringify(s.rule_check) : '', llm_check: s.llm_check ? JSON.stringify(s.llm_check) : '',
  attempts: s.attempt || 0, fb_request: s.fb_request ? JSON.stringify(s.fb_request) : '',
  fb_post_id: s.fb_post_id || '', status,
  error: s.failure ? `${s.failure.stage}: ${s.failure.cause}: ${s.failure.message}` : (kind === 'blocked' ? issues.map((i) => `[${i.by}/${i.type}] ${i.quote || ''}`).join('; ').slice(0, 900) : ''),
  finished_at: new Date().toISOString(),
};
// Never offer the same URL twice: remember it once it was posted, simulated, blocked twice, or rejected by a human.
// A block caused only by a formatting slip (bad JSON) does not burn the URL; a block for content reasons does.
const contentBlock = status === 'blocked' && issues.some((i) => !['format', 'checker_error'].includes(i.type));
const remember = (['simulated', 'published', 'scheduled', 'rejected'].includes(status) || contentBlock) && row.url;
const posted = remember ? { url: row.url, content_type: row.content_type, title: row.title, status, run_id: row.run_id } : null;
const quote = (t) => (t || '').split('\n').map((l) => '> ' + l).join('\n');
let discord;
if (kind === 'success') discord = `**PlacidWay daily post: ${status.toUpperCase()}** (run ${row.run_id}, ${c.content_type}, ${c.review_mode} mode)\nSource: <${row.url}>\nFacebook post id: ${row.fb_post_id}\n\n${quote(row.post_text)}`;
else if (kind === 'blocked') discord = `**ALERT: PlacidWay post BLOCKED by guardrails** after ${s.attempt} attempts (run ${row.run_id}). Nothing was posted.\nSource: <${row.url}>\nIssues:\n${issues.slice(0, 8).map((i) => `- [${i.by}/${i.type}] "${i.quote || ''}" ${i.reason}`).join('\n')}\nExecution: <${execUrl}>`;
else if (kind === 'rejected' || kind === 'expired') discord = `PlacidWay post ${kind === 'rejected' ? 'REJECTED by the reviewer' : 'EXPIRED (no decision in time)'} (run ${row.run_id}). Nothing was posted.\nSource: <${row.url}>`;
else discord = `**ALERT: PlacidWay workflow FAILED** (run ${row.run_id}, ${row.trigger || 'unknown'} trigger)\nStage: ${s.failure.stage}\nCause: ${s.failure.cause}\nError: ${s.failure.message.slice(0, 300)}\nWhat happens / what to do: ${s.failure.hint}\nExecution: <${execUrl}>`;
if (discord.length > 1990) discord = discord.slice(0, 1985) + '...';
return [{ json: { row, posted, remember: !!posted, discord } }];
