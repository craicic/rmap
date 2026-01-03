-- Insert 5 users (mix of game masters and players)
-- Let the database assign auto-increment IDs
INSERT INTO "users" ("username", "password", "email") VALUES
  ('dungeon_master_alex', '$2a$10$hashed_password_1', 'alex.dm@rpgmail.com'),
  ('warrior_sarah', '$2a$10$hashed_password_2', 'sarah.warrior@rpgmail.com'),
  ('mage_michael', '$2a$10$hashed_password_3', 'michael.mage@rpgmail.com'),
  ('rogue_emma', '$2a$10$hashed_password_4', 'emma.rogue@rpgmail.com'),
  ('cleric_david', '$2a$10$hashed_password_5', 'david.cleric@rpgmail.com');

-- Insert 2 rooms (waiting rooms for parties to start)
-- Resolve fk_owner by selecting the owner's user id by username
INSERT INTO "room" ("name", "description", "url", "fk_owner")
SELECT 'Dragon''s Lair Campaign - Lobby',
       'Waiting room for the Dragon''s Lair adventure. Please wait for all party members to join before we begin!',
       'dragons-lair-lobby',
       u_owner.id
FROM "users" u_owner
WHERE u_owner.username = 'dungeon_master_alex';

INSERT INTO "room" ("name", "description", "url", "fk_owner")
SELECT 'Midnight Heist Planning Room',
       'Pre-game lobby for the Midnight Heist campaign. Get ready for an urban adventure!',
       'midnight-heist-lobby',
       u_owner.id
FROM "users" u_owner
WHERE u_owner.username = 'dungeon_master_alex';

-- Insert room_users (use stable string keys to resolve foreign keys instead of hardcoded ids)
-- Room 1 participants (owner + 3 players)
INSERT INTO "room_users" ("fk_room", "fk_player", "character_name")
SELECT r.id, u.id, v.character_name
FROM (
  VALUES
    ('dragons-lair-lobby', 'warrior_sarah', 'Thora the Brave'),
    ('dragons-lair-lobby', 'mage_michael', 'Eldrin Starweaver'),
    ('dragons-lair-lobby', 'rogue_emma', 'Shadow Whisper')
) AS v(room_url, username, character_name)
JOIN "room" r ON r.url = v.room_url
JOIN "users" u ON u.username = v.username;

-- Room 2 participants (owner + 3 players)
INSERT INTO "room_users" ("fk_room", "fk_player", "character_name")
SELECT r.id, u.id, v.character_name
FROM (
  VALUES
    ('midnight-heist-lobby', 'mage_michael', 'Arcane Lockpick'),
    ('midnight-heist-lobby', 'rogue_emma', 'Silent Steps'),
    ('midnight-heist-lobby', 'cleric_david', 'Brother Lightbringer')
) AS v(room_url, username, character_name)
JOIN "room" r ON r.url = v.room_url
JOIN "users" u ON u.username = v.username;