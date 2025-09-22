-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "marker" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" varchar(2048),
	"x" bigint NOT NULL,
	"y" bigint NOT NULL,
	"is_shown" boolean,
	"id_map" bigint
);
--> statement-breakpoint
CREATE TABLE "map" (
	"id" bigint PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"id_room" bigint NOT NULL,
	"max_zoom" bigint NOT NULL,
	"min_zoom" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" bigint PRIMARY KEY NOT NULL,
	"path" varchar(255) NOT NULL,
	"title" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"url" varchar(255),
	"id_owner" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "layer" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"z_index" bigint,
	"is_shown" boolean NOT NULL,
	"id_map" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "room_users" (
	"id_room" bigint NOT NULL,
	"id_player" bigint NOT NULL,
	CONSTRAINT "room_users_pkey" PRIMARY KEY("id_room","id_player")
);
--> statement-breakpoint
CREATE TABLE "marker_images" (
	"id_marker" bigint NOT NULL,
	"id_image" bigint NOT NULL,
	CONSTRAINT "marker_images_pkey" PRIMARY KEY("id_marker","id_image")
);
--> statement-breakpoint
ALTER TABLE "marker" ADD CONSTRAINT "marker_id_map_foreign" FOREIGN KEY ("id_map") REFERENCES "public"."map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map" ADD CONSTRAINT "map_id_room_foreign" FOREIGN KEY ("id_room") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_id_owner_foreign" FOREIGN KEY ("id_owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layer" ADD CONSTRAINT "layer_id_map_foreign" FOREIGN KEY ("id_map") REFERENCES "public"."map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_users" ADD CONSTRAINT "room_users_id_room_foreign" FOREIGN KEY ("id_room") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_users" ADD CONSTRAINT "room_users_id_player_foreign" FOREIGN KEY ("id_player") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marker_images" ADD CONSTRAINT "image_id_foreign" FOREIGN KEY ("id_image") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marker_images" ADD CONSTRAINT "marker_id_foreign" FOREIGN KEY ("id_marker") REFERENCES "public"."image"("id") ON DELETE no action ON UPDATE no action;
*/