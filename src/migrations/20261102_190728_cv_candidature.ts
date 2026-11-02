import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`application_files\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`candidate_name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`application_files_updated_at_idx\` ON \`application_files\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`application_files_created_at_idx\` ON \`application_files\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`application_files_filename_idx\` ON \`application_files\` (\`filename\`);`)
  await db.run(sql`ALTER TABLE \`job_applications\` ADD \`cv_id\` integer REFERENCES application_files(id);`)
  await db.run(sql`CREATE INDEX \`job_applications_cv_idx\` ON \`job_applications\` (\`cv_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`application_files_id\` integer REFERENCES application_files(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_application_files_id_idx\` ON \`payload_locked_documents_rels\` (\`application_files_id\`);`)
  // Aggiunge "Lavora con noi" al menu dei siti già installati, una sola volta e
  // in fondo alle voci esistenti. Se qualcuno l'ha già inserita a mano, non fa nulla.
  await db.run(sql`
    INSERT INTO \`navigation_header\` (\`_order\`, \`_parent_id\`, \`id\`, \`label\`, \`url\`, \`services_menu\`)
    SELECT
      (SELECT COALESCE(MAX(\`_order\`), 0) + 1 FROM \`navigation_header\` WHERE \`_parent_id\` = n.\`id\`),
      n.\`id\`, 'lavora-con-noi', 'Lavora con noi', '/lavora-con-noi', 0
    FROM \`navigation\` n
    WHERE NOT EXISTS (
      SELECT 1 FROM \`navigation_header\` h
      WHERE h.\`_parent_id\` = n.\`id\` AND h.\`url\` = '/lavora-con-noi'
    );
  `)

}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`application_files\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_job_applications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'nuova' NOT NULL,
  	\`internal_notes\` text,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`role\` text,
  	\`role_label\` text,
  	\`collaboration\` text,
  	\`availability\` text,
  	\`message\` text,
  	\`consent\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_job_applications\`("id", "status", "internal_notes", "name", "email", "phone", "role", "role_label", "collaboration", "availability", "message", "consent", "updated_at", "created_at") SELECT "id", "status", "internal_notes", "name", "email", "phone", "role", "role_label", "collaboration", "availability", "message", "consent", "updated_at", "created_at" FROM \`job_applications\`;`)
  await db.run(sql`DROP TABLE \`job_applications\`;`)
  await db.run(sql`ALTER TABLE \`__new_job_applications\` RENAME TO \`job_applications\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`job_applications_updated_at_idx\` ON \`job_applications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`job_applications_created_at_idx\` ON \`job_applications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`services_id\` integer,
  	\`service_categories_id\` integer,
  	\`team_id\` integer,
  	\`articles_id\` integer,
  	\`article_categories_id\` integer,
  	\`booking_requests_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	\`job_applications_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`service_categories_id\`) REFERENCES \`service_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`article_categories_id\`) REFERENCES \`article_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`booking_requests_id\`) REFERENCES \`booking_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`job_applications_id\`) REFERENCES \`job_applications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "services_id", "service_categories_id", "team_id", "articles_id", "article_categories_id", "booking_requests_id", "media_id", "users_id", "job_applications_id") SELECT "id", "order", "parent_id", "path", "pages_id", "services_id", "service_categories_id", "team_id", "articles_id", "article_categories_id", "booking_requests_id", "media_id", "users_id", "job_applications_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_service_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`service_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_id_idx\` ON \`payload_locked_documents_rels\` (\`team_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_article_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`article_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_booking_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`booking_requests_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_job_applications_id_idx\` ON \`payload_locked_documents_rels\` (\`job_applications_id\`);`)
}
