/**
 * Basic usage of the HookFreight SDK.
 *
 * Run: npx tsx examples/basic-usage.ts
 */
import HookFreight from "hookfreight";

const hf = new HookFreight({
  apiKey: process.env.HOOKFREIGHT_API_KEY,
  // baseUrl: "http://localhost:3030/api/v1", // for self-hosted
});

async function main() {
  // List all apps
  const { apps } = await hf.apps.list();
  console.log("Apps:", apps);

  // Create a new app
  const app = await hf.apps.create({
    name: "My App",
    description: "Created via SDK",
  });
  console.log("Created app:", app.id);

  // Create an endpoint under the app
  const endpoint = await hf.endpoints.create({
    name: "Stripe Webhooks",
    app_id: app.id,
    forward_url: "https://example.com/webhooks/stripe",
  });
  console.log("Created endpoint:", endpoint.id);
  console.log("Webhook URL:", `https://api.hookfreight.com/${endpoint.hook_token}`);

  // List recent events
  const { events } = await hf.events.list({ limit: 10 });
  console.log(`Found ${events.length} events`);

  // List recent deliveries
  const { deliveries } = await hf.deliveries.list({ limit: 10 });
  console.log(`Found ${deliveries.length} deliveries`);

  // Clean up
  await hf.endpoints.delete(endpoint.id);
  await hf.apps.delete(app.id);
  console.log("Cleaned up.");
}

main().catch(console.error);
