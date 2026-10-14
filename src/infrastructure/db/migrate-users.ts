import { db } from "./client";

async function migrate() {
  console.log("Migrating users table...");
  const info = await db.execute("PRAGMA table_info(users)");
  const cols = new Set(info.rows.map((r) => String(r.name)));

  if (!cols.has("department")) {
    console.log("Adding department column...");
    await db.execute("ALTER TABLE users ADD COLUMN department TEXT");
  }
  if (!cols.has("branch_id")) {
    console.log("Adding branch_id column...");
    await db.execute("ALTER TABLE users ADD COLUMN branch_id TEXT");
  }
  if (!cols.has("is_active")) {
    console.log("Adding is_active column...");
    await db.execute("ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1");
  }

  // Update existing admin account to have department
  await db.execute({
    sql: "UPDATE users SET department = 'Executive Management', is_active = 1 WHERE email = 'admin@yellowribbontravels.com'",
    args: [],
  });

  const updatedInfo = await db.execute("PRAGMA table_info(users)");
  console.log("Users table columns:", updatedInfo.rows.map((r) => r.name));
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
