// n8n Code node: "Build FB request" (exact copy of the code inside workflow.json)
// Build the exact Graph API call. In simulation mode this is logged instead of sent.
// After the approval wait, the item is the reviewer's click, so the run state comes from "Build approval message".
const s = $json.post_text ? $json : $('Build approval message').first().json;
const decision = $json.query ? { action: $json.query.action, at: new Date().toISOString() } : null;
const c = s.cfg;
const endpoint = `https://graph.facebook.com/${c.fb_graph_version}/${c.fb_page_id}/${s.page.image_url ? 'photos' : 'feed'}`;
const params = s.page.image_url
  ? { url: s.page.image_url, caption: s.post_text }           // photo post: image + caption (caption carries the link)
  : { message: s.post_text, link: s.page.canonical_url };     // link post: Facebook builds the preview card
if (c.schedule_minutes_ahead >= 15) {
  params.published = false;
  params.scheduled_publish_time = Math.floor(Date.now() / 1000) + c.schedule_minutes_ahead * 60;
}
const fb_request = { method: 'POST', endpoint, params, auth: 'access_token=<TEST page token from the n8n credential, never logged>' };
const { discord_content, ...rest } = s;
return [{ json: { ...rest, reviewer_decision: decision, fb_request } }];
