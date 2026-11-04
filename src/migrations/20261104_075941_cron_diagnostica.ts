import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`ai_assistant\` ADD \`last_daily_at\` text;`)
  await db.run(sql`ALTER TABLE \`ai_assistant\` ADD \`last_daily_outcome\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`ai_assistant\` DROP COLUMN \`last_daily_at\`;`)
  await db.run(sql`ALTER TABLE \`ai_assistant\` DROP COLUMN \`last_daily_outcome\`;`)
}
