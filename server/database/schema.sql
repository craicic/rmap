CREATE SEQUENCE map_id_seq;
CREATE SEQUENCE users_id_seq;
CREATE SEQUENCE layer_id_seq;
CREATE SEQUENCE marker_id_seq;
CREATE SEQUENCE image_id_seq;
CREATE SEQUENCE room_id_seq;


CREATE TABLE "map"
(
    "id"                 INTEGER      NOT NULL DEFAULT nextval('map_id_seq'),
    "title"              VARCHAR(255) NOT NULL,
    "min_zoom"           INTEGER,
    "max_zoom"           INTEGER,
    "width_at_max_zoom"  INTEGER,
    "height_at_max_zoom" INTEGER,
    "extension"          VARCHAR(10),
    "fk_room"            INTEGER      NOT NULL,
    "fk_file"            INTEGER      NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE "users"
(
    "id"       INTEGER      NOT NULL DEFAULT nextval('users_id_seq'),
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email"    VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE "room_users"
(
    "fk_room"        INTEGER NOT NULL,
    "fk_player"      INTEGER NOT NULL,
    "character_name" VARCHAR(255),
    PRIMARY KEY (fk_room, fk_player)
);

CREATE TABLE "layer"
(
    "id"       INTEGER NOT NULL DEFAULT nextval('layer_id_seq'),
    "name"     VARCHAR(255),
    "z_index"  INTEGER,
    "is_shown" BOOLEAN NOT NULL,
    "fk_map"   INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE "marker"
(
    "id"          INTEGER NOT NULL DEFAULT nextval('marker_id_seq'),
    "name"        VARCHAR(255),
    "description" TEXT,
    "x"           INTEGER NOT NULL,
    "y"           INTEGER NOT NULL,
    "is_shown"    BOOLEAN NOT NULL,
    "fk_map"      INTEGER NOT NULL,
    "fk_image"    INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE "image"
(
    "id"        INTEGER NOT NULL DEFAULT nextval('image_id_seq'),
    "path"      TEXT,
    "title"     VARCHAR(255),
    "width"     INTEGER,
    "height"    INTEGER,
    "extension" VARCHAR(255),
    PRIMARY KEY ("id")
);

CREATE TABLE "room"
(
    "id"          INTEGER      NOT NULL DEFAULT nextval('room_id_seq'),
    "name"        VARCHAR(255) NOT NULL,
    "description" TEXT,
    "url"         VARCHAR(1000),
    "fk_owner"    INTEGER      NOT NULL,
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
ALTER TABLE "layer"
    ADD CONSTRAINT "l_fk_map"
        FOREIGN KEY ("fk_map")
            REFERENCES "map" ("id");
ALTER TABLE "map"
    ADD CONSTRAINT "m_fk_room"
        FOREIGN KEY ("fk_room")
            REFERENCES "room" ("id");
ALTER TABLE "map"
    ADD CONSTRAINT "m_fk_file"
        FOREIGN KEY ("fk_file")
            REFERENCES "image" ("id");
ALTER TABLE "marker"
    ADD CONSTRAINT "m_fk_map"
        FOREIGN KEY ("fk_map")
            REFERENCES "map" ("id");
ALTER TABLE "marker"
    ADD CONSTRAINT "m_fk_image"
        FOREIGN KEY ("fk_image")
            REFERENCES "image" ("id");
ALTER TABLE "room"
    ADD CONSTRAINT "r_fk_owner"
        FOREIGN KEY ("fk_owner")
            REFERENCES "users" ("id");

ALTER SEQUENCE map_id_seq OWNED BY "map"."id";
ALTER SEQUENCE users_id_seq OWNED BY "users"."id";
ALTER SEQUENCE layer_id_seq OWNED BY "layer"."id";
ALTER SEQUENCE marker_id_seq OWNED BY "marker"."id";
ALTER SEQUENCE image_id_seq OWNED BY "image"."id";
ALTER SEQUENCE room_id_seq OWNED BY "room"."id";