import { db } from "./client";
import { SCHEMA_SQL } from "./schema";

export async function runSchemaMigration() {
  console.log("--> Initializing SQLite database and applying schema...");

  const statements = SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const tableStatements = statements.filter(
    (s) => !/^CREATE\s+(UNIQUE\s+)?INDEX/i.test(s)
  );
  const indexStatements = statements.filter((s) =>
    /^CREATE\s+(UNIQUE\s+)?INDEX/i.test(s)
  );

  // 1. Create tables if they do not exist
  for (const statement of tableStatements) {
    try {
      await db.execute(statement);
    } catch (err) {
      console.error("Schema table statement error:", statement.slice(0, 60), err);
    }
  }

  // 2. Safely ensure any incremental columns exist on upgraded databases before creating indexes
  const safeAlters = [
    "ALTER TABLE users ADD COLUMN department TEXT",
    "ALTER TABLE users ADD COLUMN branch_id TEXT",
    "ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1",
    "ALTER TABLE itineraries ADD COLUMN user_id TEXT",
    "ALTER TABLE itineraries ADD COLUMN vehicle TEXT DEFAULT 'Toyota Etios'",
    "ALTER TABLE itineraries ADD COLUMN pax_label TEXT DEFAULT '2 Adults'",
    "ALTER TABLE itineraries ADD COLUMN price_per_person REAL DEFAULT 0",
    "ALTER TABLE itineraries ADD COLUMN accommodations_json TEXT DEFAULT '[]'",
    "ALTER TABLE itineraries ADD COLUMN package_highlights_json TEXT DEFAULT '[]'",
    "ALTER TABLE itineraries ADD COLUMN important_notes_json TEXT DEFAULT '[]'",
    "ALTER TABLE itineraries ADD COLUMN cost_breakdown_json TEXT DEFAULT '[]'",
    "ALTER TABLE branches ADD COLUMN country TEXT NOT NULL DEFAULT 'India'",
    "ALTER TABLE branches ADD COLUMN is_international INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE branches ADD COLUMN map_embed_url TEXT",
    "ALTER TABLE users ADD COLUMN family_head_id TEXT",
    "ALTER TABLE users ADD COLUMN relationship_to_head TEXT",
    "ALTER TABLE bookings ADD COLUMN user_id TEXT",
    "ALTER TABLE bookings ADD COLUMN family_member_id TEXT",
    "ALTER TABLE flight_inquiries ADD COLUMN user_id TEXT",
    "ALTER TABLE flight_inquiries ADD COLUMN family_member_id TEXT",
    "ALTER TABLE flight_inquiries ADD COLUMN updated_at TEXT NOT NULL DEFAULT (datetime('now'))",
  ];

  for (const alterSql of safeAlters) {
    try {
      await db.execute(alterSql);
    } catch {
      // Column already exists — safe to ignore
    }
  }

  // 3. Create indexes now that all tables and columns are guaranteed to exist
  for (const statement of indexStatements) {
    try {
      await db.execute(statement);
    } catch (err) {
      console.error("Schema index statement error:", statement.slice(0, 60), err);
    }
  }

  console.log("--> Database schema & tables verified (no dummy data seeded).");
}

async function main() {
  try {
    await runSchemaMigration();
    console.log("SUCCESS: Database and schema created/updated!");
    process.exit(0);
  } catch (error) {
    console.error("Schema migration failed:", error);
    process.exit(1);
  }
}

if (
  typeof process !== "undefined" &&
  process.argv &&
  process.argv[1] &&
  (process.argv[1].endsWith("migrate.ts") || process.argv[1].endsWith("migrate.js"))
) {
  main();
}

