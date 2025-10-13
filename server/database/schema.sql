-- CREATE DATABASE "rmap-dev";
-- CREATE SCHEMA "public";

CREATE TABLE "map"
(
    "id"       INTEGER NOT NULL,
    "title"    VARCHAR(255),
    "fk_room"  INTEGER NOT NULL,
    "max_zoom" INTEGER,
    "min_zoom" INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE "users"
(
    "id"       INTEGER      NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email"    VARCHAR(255) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE "room_users"
(
    "fk_room"   INTEGER NOT NULL,
    "fk_player" INTEGER NOT NULL,
    PRIMARY KEY (fk_room, fk_player)
);

CREATE TABLE "layer"
(
    "id"       INTEGER NOT NULL,
    "name"     VARCHAR(255),
    "z_index"  INTEGER,
    "is_shown" BOOLEAN NOT NULL,
    "fk_map"   INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE "marker"
(
    "id"          INTEGER NOT NULL,
    "name"        VARCHAR(255),
    "description" TEXT,
    "x"           INTEGER NOT NULL,
    "y"           INTEGER NOT NULL,
    "is_shown"    BOOLEAN NOT NULL,
    "fk_map"      INTEGER NOT NULL ,
    PRIMARY KEY (id)
);

CREATE TABLE "image"
(
    "id"    INTEGER        NOT NULL,
    "path"  VARCHAR(1000) NOT NULL,
    "title" VARCHAR(255),
    PRIMARY KEY ("id")
);

CREATE TABLE "marker_images"
(
    "fk_marker" INTEGER NOT NULL,
    "fk_image"  INTEGER NOT NULL,
    PRIMARY KEY ("fk_marker", "fk_image")
);

CREATE TABLE "room"
(
    "id"       INTEGER       NOT NULL,
    "name"     VARCHAR(255) NULL,
    "url"      VARCHAR(255) NULL,
    "fk_owner" INTEGER       NOT NULL,
    PRIMARY KEY ("id")
);
ALTER TABLE "room_users"
    ADD CONSTRAINT "ru_fk_room"
        FOREIGN KEY ("fk_room")
            REFERENCES "room" ("id");
ALTER TABLE "room_users"
    ADD CONSTRAINT "ru_fk_player"
        FOREIGN KEY ("fk_player")
            REFERENCES "users" ("id");
ALTER TABLE "marker_images"
    ADD CONSTRAINT "mi_fk_image"
        FOREIGN KEY ("fk_image")
            REFERENCES "image" ("id");
ALTER TABLE "marker_images"
    ADD CONSTRAINT "mi_fk_marker"
        FOREIGN KEY ("fk_marker")
            REFERENCES "image" ("id");
ALTER TABLE "layer"
    ADD CONSTRAINT "l_fk_map"
        FOREIGN KEY ("fk_map")
            REFERENCES "map" ("id");
ALTER TABLE "map"
    ADD CONSTRAINT "m_fk_room"
        FOREIGN KEY ("fk_room")
            REFERENCES "room" ("id");
ALTER TABLE "marker"
    ADD CONSTRAINT "m_fk_map"
        FOREIGN KEY ("fk_map")
            REFERENCES "map" ("id");
ALTER TABLE "room"
    ADD CONSTRAINT "r_fk_owner"
        FOREIGN KEY ("fk_owner")
            REFERENCES "users" ("id");
