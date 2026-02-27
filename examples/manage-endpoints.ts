/**
 * Programmatically manage endpoints — useful in CI/CD pipelines.
 *
 * Run: npx tsx examples/manage-endpoints.ts
 */
import Hookfreight from "hookfreight";

const hf = new Hookfreight({
  apiKey: process.env.HOOKFREIGHT_API_KEY,
});

async function main() {
  const appId = process.argv[2];
  if (!appId) {
    console.error("Usage: npx tsx examples/manage-endpoints.ts <app_id>");
    process.exit(1);
  }

  // List current endpoints
  const { endpoints } = await hf.endpoints.list(appId);
  console.log(`App ${appId} has ${endpoints.length} endpoint(s):`);

  for (const ep of endpoints) {
    console.log(`  ${ep.id} — ${ep.name} (active: ${ep.is_active})`);
  }

  // Pause all endpoints (e.g. during maintenance)
  for (const ep of endpoints) {
    await hf.endpoints.update(ep.id, { is_active: false });
    console.log(`Paused ${ep.id}`);
  }

  // ... do maintenance work ...

  // Resume all endpoints
  for (const ep of endpoints) {
    await hf.endpoints.update(ep.id, { is_active: true });
    console.log(`Resumed ${ep.id}`);
  }
}

main().catch(console.error);
