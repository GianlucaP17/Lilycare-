import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`settings\` ADD \`uid\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`legal_address_street\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`legal_address_postal_code\` text;`)
  await db.run(sql`ALTER TABLE \`settings\` ADD \`legal_address_city\` text;`)

  // Dati societari dal registro di commercio del Cantone Ticino (estratto CHE-469.263.971).
  // Si compilano solo se i campi sono ancora vuoti: un valore già inserito dal pannello non
  // viene mai sovrascritto.
  await db.run(
    sql`UPDATE \`settings\` SET \`legal_name\` = 'Lilycare Sagl' WHERE \`legal_name\` IS NULL OR \`legal_name\` = '';`,
  )
  await db.run(
    sql`UPDATE \`settings\` SET \`uid\` = 'CHE-469.263.971' WHERE \`uid\` IS NULL OR \`uid\` = '';`,
  )
  await db.run(
    sql`UPDATE \`settings\` SET \`legal_address_street\` = 'Via al Chioso 3', \`legal_address_postal_code\` = '6828', \`legal_address_city\` = 'Balerna' WHERE \`legal_address_street\` IS NULL OR \`legal_address_street\` = '';`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`uid\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`legal_address_street\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`legal_address_postal_code\`;`)
  await db.run(sql`ALTER TABLE \`settings\` DROP COLUMN \`legal_address_city\`;`)
}
