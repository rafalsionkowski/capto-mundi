import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"trips_id" integer,
  	"articles_id" integer
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "featured_article_id" integer;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_trips_fk" FOREIGN KEY ("trips_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_trips_id_idx" ON "site_settings_rels" USING btree ("trips_id");
  CREATE INDEX "site_settings_rels_articles_id_idx" ON "site_settings_rels" USING btree ("articles_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_featured_article_id_articles_id_fk" FOREIGN KEY ("featured_article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_featured_article_idx" ON "site_settings" USING btree ("featured_article_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_rels" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_featured_article_id_articles_id_fk";
  
  DROP INDEX "site_settings_featured_article_idx";
  ALTER TABLE "site_settings" DROP COLUMN "featured_article_id";`)
}
