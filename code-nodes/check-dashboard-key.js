// n8n Code node: "Check dashboard key" (exact copy of the code inside workflow.json)
// Shared-secret check for the dashboard URL (?k=...). The key is a static value in this node; the exported workflow.json carries a placeholder instead.
const KEY = 'REPLACE_WITH_YOUR_DASHBOARD_KEY';
const given = String(($input.first().json.query || {}).k || '');
let diff = given.length ^ KEY.length;
for (let i = 0; i < KEY.length; i++) diff |= (given.charCodeAt(i) || 0) ^ KEY.charCodeAt(i);
return [{ json: { key_ok: diff === 0 } }];
