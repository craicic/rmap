-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "room" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"url" varchar(1000),
	"fk_owner" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "map" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"min_zoom" integer,
	"max_zoom" integer,
	"width_at_max_zoom" integer,
	"height_at_max_zoom" integer,
	"extension" varchar(10),
	"fk_room" integer NOT NULL,
	"fk_file" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "layer" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"z_index" integer,
	"is_shown" boolean NOT NULL,
	"fk_map" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" integer PRIMARY KEY NOT NULL,
	"path" text,
	"title" varchar(255),
	"width" integer,
	"height" integer,
	"extension" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "marker" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"is_shown" boolean NOT NULL,
	"fk_map" integer NOT NULL,
	"fk_image" integer
);
--> statement-breakpoint
CREATE TABLE "room_users" (
	"fk_room" integer NOT NULL,
	"fk_player" integer NOT NULL,
	"character_name" varchar(255),
	CONSTRAINT "room_users_pkey" PRIMARY KEY("fk_room","fk_player")
);
--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "r_fk_owner" FOREIGN KEY ("fk_owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map" ADD CONSTRAINT "m_fk_room" FOREIGN KEY ("fk_room") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map" ADD CONSTRAINT "m_fk_file" FOREIGN KEY ("fk_file") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layer" ADD CONSTRAINT "l_fk_map" FOREIGN KEY ("fk_map") REFERENCES "public"."map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marker" ADD CONSTRAINT "m_fk_map" FOREIGN KEY ("fk_map") REFERENCES "public"."map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marker" ADD CONSTRAINT "m_fk_image" FOREIGN KEY ("fk_image") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_users" ADD CONSTRAINT "ru_fk_room" FOREIGN KEY ("fk_room") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_users" ADD CONSTRAINT "ru_fk_player" FOREIGN KEY ("fk_player") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
*/