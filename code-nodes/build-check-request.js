// n8n Code node: "Build check request" (exact copy of the code inside workflow.json)
// Guardrail 2 of 2: a second, stronger model reads the draft against the source like a compliance reviewer.
// It catches what a word list can't: implied promises, paraphrased facts that aren't in the page, wrong context.
const s = $input.first().json;
const system = `You are a strict compliance reviewer for health and medical-travel social media posts.
Compare the DRAFT with the SOURCE page. FAIL the draft if ANY of these is true:
1 medical_claim: it states or implies a treatment cures, heals, fixes, reverses, or works; or it gives medical advice.
2 outcome_promise: it promises or implies a result for the reader (e.g. "walk without pain", "look younger", "get your confidence back"), including softened forms ("can help you finally...", "on the path to recovery").
3 invented_price: it mentions a price, cost, saving or discount that is not stated exactly in the source.
4 unsupported_fact: it states any fact, number, name, credential, place, date, ranking or comparison that the source does not support.
Allowed: saying what the page explains or covers, what a package includes, neutral facts quoted from the source, a question as a hook, an invitation to read more.
The link and hashtags are added by the system; judge hashtags only for claims.
Return JSON only: {"verdict":"pass"|"fail","issues":[{"type":"medical_claim|outcome_promise|invented_price|unsupported_fact","quote":"exact words from the draft","reason":"short"}],"notes":"one sentence"}`;
const p = s.page;
const user = `SOURCE (title, description, listed price, page text):
TITLE: ${p.title}
DESCRIPTION: ${p.summary || '(none)'}
LISTED PRICE: ${p.listed_price || '(none)'}
<<<
${p.body_text}
>>>

DRAFT POST:
<<<
${s.post_text}
>>>`;
return [{ json: { ...s, check_body: { model: s.cfg.checker_model, max_tokens: 4000, system, messages: [{ role: 'user', content: user }] } } }];
