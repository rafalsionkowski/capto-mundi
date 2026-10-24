import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_hero_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings_hero_photos" ADD CONSTRAINT "site_settings_hero_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_hero_photos" ADD CONSTRAINT "site_settings_hero_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_hero_photos_order_idx" ON "site_settings_hero_photos" USING btree ("_order");
  CREATE INDEX "site_settings_hero_photos_parent_id_idx" ON "site_settings_hero_photos" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_photos_image_idx" ON "site_settings_hero_photos" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_hero_photos" CASCADE;`)
}
