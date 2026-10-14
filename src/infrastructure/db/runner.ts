import { runMigrationsAndSeed } from "./seed";

async function main() {
  try {
    await runMigrationsAndSeed();
    console.log("SUCCESS: Database migrated and seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
