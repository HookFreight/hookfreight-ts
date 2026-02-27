/**
 * Monitor delivery queue health — useful for alerting integrations.
 *
 * Run: npx tsx examples/monitor-queue.ts
 */
import Hookfreight from "hookfreight";

const hf = new Hookfreight({
  apiKey: process.env.HOOKFREIGHT_API_KEY,
});

async function main() {
  const stats = await hf.deliveries.queueStats();

  console.log("Queue Stats:");
  console.log(`  Waiting:   ${stats.waiting}`);
  console.log(`  Active:    ${stats.active}`);
  console.log(`  Completed: ${stats.completed}`);
  console.log(`  Failed:    ${stats.failed}`);
  console.log(`  Delayed:   ${stats.delayed}`);

  // Alert if there are too many waiting or failed jobs
  if (stats.waiting > 100) {
    console.warn("WARNING: High queue backlog!");
  }

  if (stats.failed > 10) {
    console.warn("WARNING: Multiple failed deliveries in queue!");
  }
}

main().catch(console.error);
