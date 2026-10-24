import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_trips_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__trips_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('travelogue', 'guide', 'route', 'reflection');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('travelogue', 'guide', 'route', 'reflection');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "trips_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "trips" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"country" varchar,
  	"year" numeric,
  	"days" numeric,
  	"route" varchar,
  	"summary" varchar,
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_trips_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_trips_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_country" varchar,
  	"version_year" numeric,
  	"version_days" numeric,
  	"version_route" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__trips_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "articles_practical_packing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "articles_practical_good_to_know" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"hero_caption" varchar,
  	"content" jsonb,
  	"practical_quick_best_season" varchar,
  	"practical_quick_time_needed" varchar,
  	"practical_quick_budget_per_day" varchar,
  	"practical_quick_language" varchar,
  	"practical_quick_currency" varchar,
  	"practical_before_when_to_go" varchar,
  	"practical_before_visa" varchar,
  	"practical_before_health" varchar,
  	"practical_before_money" varchar,
  	"practical_before_connectivity" varchar,
  	"practical_around_getting_there" varchar,
  	"practical_around_local_transport" varchar,
  	"practical_around_car_or_bike" varchar,
  	"practical_around_on_foot" varchar,
  	"practical_stay_best_base" varchar,
  	"practical_stay_where_i_stayed" varchar,
  	"practical_stay_where_to_eat" varchar,
  	"practical_stay_try_this" varchar,
  	"practical_budget_budget" varchar,
  	"practical_budget_mid_range" varchar,
  	"practical_budget_comfortable" varchar,
  	"practical_budget_biggest_costs" varchar,
  	"slug" varchar,
  	"category" "enum_articles_category" DEFAULT 'travelogue',
  	"trip_id" integer,
  	"author" varchar DEFAULT 'Rafal Sionkowski',
  	"place" varchar,
  	"published_at" timestamp(3) with time zone,
  	"reading_minutes" numeric,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v_version_practical_packing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_practical_good_to_know" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_caption" varchar,
  	"version_content" jsonb,
  	"version_practical_quick_best_season" varchar,
  	"version_practical_quick_time_needed" varchar,
  	"version_practical_quick_budget_per_day" varchar,
  	"version_practical_quick_language" varchar,
  	"version_practical_quick_currency" varchar,
  	"version_practical_before_when_to_go" varchar,
  	"version_practical_before_visa" varchar,
  	"version_practical_before_health" varchar,
  	"version_practical_before_money" varchar,
  	"version_practical_before_connectivity" varchar,
  	"version_practical_around_getting_there" varchar,
  	"version_practical_around_local_transport" varchar,
  	"version_practical_around_car_or_bike" varchar,
  	"version_practical_around_on_foot" varchar,
  	"version_practical_stay_best_base" varchar,
  	"version_practical_stay_where_i_stayed" varchar,
  	"version_practical_stay_where_to_eat" varchar,
  	"version_practical_stay_try_this" varchar,
  	"version_practical_budget_budget" varchar,
  	"version_practical_budget_mid_range" varchar,
  	"version_practical_budget_comfortable" varchar,
  	"version_practical_budget_biggest_costs" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__articles_v_version_category" DEFAULT 'travelogue',
  	"version_trip_id" integer,
  	"version_author" varchar DEFAULT 'Rafal Sionkowski',
  	"version_place" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_minutes" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"trips_id" integer,
  	"articles_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'The world, one frame and one story at a time.',
  	"hero_text" varchar DEFAULT 'Photos from every journey, arranged into albums, with the stories behind them: the routes, the people, and what is worth knowing before you go.',
  	"about" varchar,
  	"email" varchar,
  	"instagram" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "trips_gallery" ADD CONSTRAINT "trips_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips_gallery" ADD CONSTRAINT "trips_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips" ADD CONSTRAINT "trips_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v_version_gallery" ADD CONSTRAINT "_trips_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v_version_gallery" ADD CONSTRAINT "_trips_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_parent_id_trips_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trips"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_practical_packing" ADD CONSTRAINT "articles_practical_packing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_practical_good_to_know" ADD CONSTRAINT "articles_practical_good_to_know_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_version_practical_packing" ADD CONSTRAINT "_articles_v_version_practical_packing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_practical_good_to_know" ADD CONSTRAINT "_articles_v_version_practical_good_to_know_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_trip_id_trips_id_fk" FOREIGN KEY ("version_trip_id") REFERENCES "public"."trips"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trips_fk" FOREIGN KEY ("trips_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "trips_gallery_order_idx" ON "trips_gallery" USING btree ("_order");
  CREATE INDEX "trips_gallery_parent_id_idx" ON "trips_gallery" USING btree ("_parent_id");
  CREATE INDEX "trips_gallery_image_idx" ON "trips_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "trips_slug_idx" ON "trips" USING btree ("slug");
  CREATE INDEX "trips_cover_idx" ON "trips" USING btree ("cover_id");
  CREATE INDEX "trips_updated_at_idx" ON "trips" USING btree ("updated_at");
  CREATE INDEX "trips_created_at_idx" ON "trips" USING btree ("created_at");
  CREATE INDEX "trips__status_idx" ON "trips" USING btree ("_status");
  CREATE INDEX "_trips_v_version_gallery_order_idx" ON "_trips_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_trips_v_version_gallery_parent_id_idx" ON "_trips_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_gallery_image_idx" ON "_trips_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_trips_v_parent_idx" ON "_trips_v" USING btree ("parent_id");
  CREATE INDEX "_trips_v_version_version_slug_idx" ON "_trips_v" USING btree ("version_slug");
  CREATE INDEX "_trips_v_version_version_cover_idx" ON "_trips_v" USING btree ("version_cover_id");
  CREATE INDEX "_trips_v_version_version_updated_at_idx" ON "_trips_v" USING btree ("version_updated_at");
  CREATE INDEX "_trips_v_version_version_created_at_idx" ON "_trips_v" USING btree ("version_created_at");
  CREATE INDEX "_trips_v_version_version__status_idx" ON "_trips_v" USING btree ("version__status");
  CREATE INDEX "_trips_v_created_at_idx" ON "_trips_v" USING btree ("created_at");
  CREATE INDEX "_trips_v_updated_at_idx" ON "_trips_v" USING btree ("updated_at");
  CREATE INDEX "_trips_v_latest_idx" ON "_trips_v" USING btree ("latest");
  CREATE INDEX "articles_practical_packing_order_idx" ON "articles_practical_packing" USING btree ("_order");
  CREATE INDEX "articles_practical_packing_parent_id_idx" ON "articles_practical_packing" USING btree ("_parent_id");
  CREATE INDEX "articles_practical_good_to_know_order_idx" ON "articles_practical_good_to_know" USING btree ("_order");
  CREATE INDEX "articles_practical_good_to_know_parent_id_idx" ON "articles_practical_good_to_know" USING btree ("_parent_id");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_trip_idx" ON "articles" USING btree ("trip_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_version_practical_packing_order_idx" ON "_articles_v_version_practical_packing" USING btree ("_order");
  CREATE INDEX "_articles_v_version_practical_packing_parent_id_idx" ON "_articles_v_version_practical_packing" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_practical_good_to_know_order_idx" ON "_articles_v_version_practical_good_to_know" USING btree ("_order");
  CREATE INDEX "_articles_v_version_practical_good_to_know_parent_id_idx" ON "_articles_v_version_practical_good_to_know" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_trip_idx" ON "_articles_v" USING btree ("version_trip_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_trips_id_idx" ON "payload_locked_documents_rels" USING btree ("trips_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "trips_gallery" CASCADE;
  DROP TABLE "trips" CASCADE;
  DROP TABLE "_trips_v_version_gallery" CASCADE;
  DROP TABLE "_trips_v" CASCADE;
  DROP TABLE "articles_practical_packing" CASCADE;
  DROP TABLE "articles_practical_good_to_know" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v_version_practical_packing" CASCADE;
  DROP TABLE "_articles_v_version_practical_good_to_know" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_trips_status";
  DROP TYPE "public"."enum__trips_v_version_status";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_status";`)
}
