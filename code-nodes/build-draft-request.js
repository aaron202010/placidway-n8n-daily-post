// n8n Code node: "Build draft request" (exact copy of the code inside workflow.json)
// Step 4: build the drafting request. On a retry, the previous draft and every issue found go back in as feedback.
const s = $input.first().json;
const retry = !!s.guardrail;               // set by "Combine verdicts" when a draft failed
const attempt = retry ? s.attempt + 1 : 1;
const p = s.page;
const angle = {
  article: 'Say what this guide explains and who it is for.',
  package: 'Say what the package is, where it is offered and what the page lists. Use a price only if LISTED PRICE gives one, word for word.',
  answer: 'Open with the patient question, then give the short answer exactly as the source states it.',
  news: 'Share the announcement in plain words: who, what, where.',
}[s.cfg.content_type] || 'Say what the page covers.';

const system = `You write one Facebook post for PlacidWay, a medical tourism marketplace, from ONE source page.
Return JSON only, no prose: {"hook": string, "lines": [2 to 4 strings], "cta": string, "hashtags": [3 to 5 strings]}

Format
- hook: one short line, max 12 words. A question or a plain statement. No clickbait.
- lines: 2 or 3 short lines, max 16 words each. Each is one concrete, useful point taken from the source.
- cta: one line (max 14 words) that invites people to read the full guide, see the package details or ask PlacidWay. Do NOT write the URL; it is added automatically.
- hashtags: 3 to 5, CamelCase words, no spaces, no '#', about the treatment, destination or medical travel.
- hook + lines + cta together: under 400 characters. Plain, warm, professional. No emojis. No ALL CAPS.
- Write as PlacidWay. Never write "the source" or "the page says"; "this guide explains" or "the package lists" is fine.

Hard rules (a second reviewer rejects the post if any is broken)
1. Use only facts stated in the SOURCE. No outside knowledge: no names, numbers, dates, credentials, rankings or comparisons that are not in it.
2. No medical claims: never say or imply a treatment cures, heals, fixes, reverses or is proven to work. No medical advice.
3. No outcome promises: never tell the reader what result they will get (no "get your life back", "pain-free", "permanent", "guaranteed", "life-changing"). Describe what the page covers or what a package includes, not what it will do for the reader. Do not repeat outcome claims even if the source makes them.
4. No success rates, survival rates or percentages.
5. Prices: only a figure printed in the source, copied exactly (same currency, same number, "starting from" if the source says so). Otherwise no prices, savings or discounts.
Angle for this content type: ${angle}`;

let user = `CONTENT TYPE: ${s.cfg.content_type}
TITLE: ${p.title}
META DESCRIPTION: ${p.summary || '(none)'}
LISTED PRICE: ${p.listed_price || '(none)'}
SOURCE TEXT:
<<<
${p.body_text}
>>>`;
if (retry) {
  user += `\n\nYour previous draft was REJECTED.\nPrevious draft:\n${s.post_text}\n\nIssues to fix (fix every one, and do not add new claims):\n` +
    s.guardrail.issues.map((i, n) => `${n + 1}. [${i.type}] "${i.quote || ''}" - ${i.reason}`).join('\n');
}
const anthropic_body = { model: s.cfg.draft_model, max_tokens: 1000, thinking: { type: 'disabled' }, system, messages: [{ role: 'user', content: user }] };
const { guardrail, rule_check, llm_check, ...rest } = s;
return [{ json: { ...rest, attempt, previous_issues: retry ? s.guardrail.issues : [], anthropic_body } }];
