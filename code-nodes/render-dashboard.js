// n8n Code node: "Render dashboard" (exact copy of the code inside workflow.json)
// Stretch goal: a read-only dashboard of every run, straight from the run log table.
const rows = $input.all().map((i) => i.json).filter((r) => r.run_id).sort((a, b) => String(b.started_at).localeCompare(String(a.started_at)));
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const counts = rows.reduce((m, r) => ((m[r.status] = (m[r.status] || 0) + 1), m), {});
const tr = rows.map((r) => `<tr><td>${esc((r.started_at || '').replace('T', ' ').slice(0, 16))}</td><td>${esc(r.trigger)}</td><td>${esc(r.content_type)}</td>
<td><a href="${esc(r.url)}">${esc(r.title || r.url)}</a></td><td><span class="s ${esc(r.status)}">${esc(r.status)}</span></td><td>${esc(r.fb_post_id)}</td>
<td>${esc(r.review_mode)}/${esc(r.publish_mode)}</td><td>${esc(r.attempts)}</td><td><details><summary>post</summary><pre>${esc(r.post_text)}</pre>${r.error ? `<p class="err">${esc(r.error)}</p>` : ''}</details></td></tr>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PlacidWay post runs</title>
<style>:root{--bg:#fff;--fg:#14202b;--mut:#5b6b78;--line:#e3e8ec}@media (prefers-color-scheme:dark){:root{--bg:#0f1720;--fg:#e6edf3;--mut:#9fb0bf;--line:#253240}}
body{background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif;margin:0;padding:16px}h1{font-size:20px;margin:0 0 4px}p.m{color:var(--mut);margin:0 0 12px}
.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;min-width:860px}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{font-size:12px;color:var(--mut);text-transform:uppercase}a{color:#0a7bbf}pre{white-space:pre-wrap;max-width:420px;font:12px/1.4 ui-monospace,monospace}
.s{padding:1px 8px;border-radius:10px;font-size:12px;background:#e8eef3;color:#14202b}.simulated,.published,.scheduled{background:#d7f5df}.blocked,.failure{background:#fbdada}.rejected,.expired{background:#fdf0c8}.err{color:#c0392b}</style></head>
<body><h1>PlacidWay daily post: run log</h1><p class="m">${rows.length} runs. ${Object.entries(counts).map(([k, v]) => `${esc(k)}: ${v}`).join(' | ')}. Source: n8n data table pw_run_log.</p>
<div class="wrap"><table><thead><tr><th>Started (UTC)</th><th>Trigger</th><th>Type</th><th>Source page</th><th>Status</th><th>FB post id</th><th>Mode</th><th>Tries</th><th>Post</th></tr></thead><tbody>${tr}</tbody></table></div></body></html>`;
return [{ json: { html } }];
