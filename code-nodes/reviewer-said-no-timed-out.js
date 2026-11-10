// n8n Code node: "Reviewer said no / timed out" (exact copy of the code inside workflow.json)
const s = $('Build approval message').first().json;
const action = $json.query && $json.query.action;
return [{ json: { ...s, kind: action === 'reject' ? 'rejected' : 'expired', reviewer_decision: { action: action || 'timeout', at: new Date().toISOString() } } }];
