// n8n Code node: "Read FB response" (exact copy of the code inside workflow.json)
const s = $('Build FB request').first().json;
const r = $input.first().json;
const scheduled = s.fb_request.params.published === false;
return [{ json: { ...s, kind: 'success', fb_status: scheduled ? 'scheduled' : 'published', fb_post_id: r.post_id || r.id || null, fb_response: r } }];
