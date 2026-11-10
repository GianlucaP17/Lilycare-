import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`booking_requests\` ADD \`notifica\` text;`)
  await db.run(sql`ALTER TABLE \`job_applications\` ADD \`notifica\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`booking_requests\` DROP COLUMN \`notifica\`;`)
  await db.run(sql`ALTER TABLE \`job_applications\` DROP COLUMN \`notifica\`;`)
}
