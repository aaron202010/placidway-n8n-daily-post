// n8n Code node: "Simulate publish (log request only)" (exact copy of the code inside workflow.json)
// Simulation: nothing leaves the building. Record exactly what would have been sent.
const s = $input.first().json;
return [{ json: { ...s, kind: 'success', fb_status: 'simulated', fb_post_id: `SIMULATED-${s.run_id}`, fb_response: { simulated: true, would_send: s.fb_request } } }];
