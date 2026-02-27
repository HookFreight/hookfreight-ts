/**
 * Find and retry all failed deliveries from the last 24 hours.
 *
 * Run: npx tsx examples/retry-failed-deliveries.ts
 */
import Hookfreight from "hookfreight";

const hf = new Hookfreight({
  apiKey: process.env.HOOKFREIGHT_API_KEY,
});

async function main() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { deliveries } = await hf.deliveries.list({
    status: "failed",
    start_date: since,
    limit: 100,
  });

  console.log(`Found ${deliveries.length} failed deliveries since ${since}`);

  for (const delivery of deliveries) {
    console.log(`Retrying ${delivery.id} (event: ${delivery.event_id})...`);
    await hf.deliveries.retry(delivery.id);
  }

  console.log("Done.");
}

main().catch(console.error);
