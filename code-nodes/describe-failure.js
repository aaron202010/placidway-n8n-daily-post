// n8n Code node: "Describe failure" (exact copy of the code inside workflow.json)
// Every failure lands here: from a node's error output, or from the Error Trigger (anything unexpected).
const j = $input.first().json;
const fromErrorTrigger = !!(j.execution && j.workflow);
const stage = fromErrorTrigger ? (j.execution.lastNodeExecuted || 'unknown') : $prevNode.name;
const e = fromErrorTrigger ? j.execution.error : j.error;
const msg = typeof e === 'string' ? e : (e && [e.message, e.description].filter(Boolean).join(' / ')) || JSON.stringify(e || j).slice(0, 300);
const detail = JSON.stringify(e || {}).slice(0, 600);
const hay = (msg + ' ' + detail).toLowerCase();
let cause = 'unexpected error', hint = 'Open the execution in n8n and check the failed node.';
if (/facebook/i.test(stage) && /(190|oauth|access token|session has expired|invalid token|authorization failed)/.test(hay)) {
  cause = 'Facebook token expired or invalid'; hint = 'Create a new Page access token for the TEST page and paste it into the credential "PlacidWay assessment - FB TEST page token". Nothing was posted.';
} else if (/facebook/i.test(stage)) {
  cause = 'Facebook Graph API error'; hint = 'Not retried on 4xx; one retry only after a network error or 5xx. Check the page id, token permissions (pages_manage_posts) and the error text.';
} else if (/llm|anthropic/i.test(stage) || /anthropic/.test(hay)) {
  cause = /401|invalid x-api-key|authentication_error/.test(hay) ? 'LLM API key rejected' : /invalid_request_error|\b400\b/.test(hay) ? 'LLM request rejected (bad request)' : 'LLM API error (rate limit, overload or timeout)';
  hint = 'Retried 3 times, 5 s apart. Tomorrow\'s run will try again; check the Anthropic key/credits if it repeats.';
} else if (/\[robots\]/.test(hay)) {
  cause = 'blocked by robots.txt'; hint = 'The workflow refused to fetch a disallowed URL. Nothing to fix unless the URL is wrong.';
} else if (/\[site\]/.test(hay)) {
  cause = 'PlacidWay site unreachable'; hint = 'Retried with backoff (429/5xx/network only) and tried the archive copy. Tomorrow\'s run will try again.';
} else if (/\[select\]/.test(hay)) {
  cause = 'nothing new to post'; hint = 'The URL was used before, or every URL of today\'s content type is used. Dedupe held; rotation moves on tomorrow.';
} else if (/discord/i.test(stage)) {
  cause = 'could not reach the reviewer channel'; hint = 'Check the Discord webhook credential.';
}
// Recover whatever run state exists so the log row still says which item and which draft were involved.
let state = {};
for (const n of ['Combine verdicts', 'Rule check', 'Parse draft', 'Fetch page + extract', 'Pick today\'s item', 'Read robots.txt', 'Config']) {
  try { const j = $(n).last().json; if (j && j.cfg) { state = j; break; } } catch (err) {}
}
if (fromErrorTrigger) { state.run_id = String(j.execution.id || ''); state.trigger = state.trigger || j.execution.mode || 'error trigger'; }
return [{ json: { ...state, kind: 'failure', failure: { stage, cause, hint, message: msg.slice(0, 500), via: fromErrorTrigger ? 'error trigger' : 'error output' } } }];
