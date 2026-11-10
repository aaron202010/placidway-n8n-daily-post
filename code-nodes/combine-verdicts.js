// n8n Code node: "Combine verdicts" (exact copy of the code inside workflow.json)
// Both guardrails must pass. The LLM checker fails closed: an unreadable answer counts as a fail.
const s = $('Build check request').item.json;
const resp = $input.first().json;
const raw = (resp.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
let llm = null;
try { llm = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch (e) {}
const llm_check = llm && (llm.verdict === 'pass' || llm.verdict === 'fail')
  ? { pass: llm.verdict === 'pass', issues: (llm.issues || []).map((i) => ({ ...i, by: 'llm' })), notes: llm.notes || '' }
  : { pass: false, issues: [{ type: 'checker_error', quote: '', reason: 'checker reply was not valid JSON', by: 'llm' }], notes: raw.slice(0, 200) };
const pass = s.rule_check.pass && llm_check.pass;
const guardrail = { pass, issues: [...s.rule_check.issues, ...llm_check.issues] };
const history = [...(s.guardrail_history || []), { attempt: s.attempt, post_text: s.post_text, used_test_draft: s.used_test_draft, rule_check: s.rule_check, llm_check }];
const { check_body, ...rest } = s;
return [{ json: { ...rest, llm_check, guardrail, guardrail_history: history, can_retry: !pass && s.attempt < s.cfg.max_attempts } }];
