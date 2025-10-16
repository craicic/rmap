-- Insert 5 users (mix of game masters and players)
INSERT INTO "users" ("id", "username", "password", "email") VALUES
                                                                (1, 'dungeon_master_alex', '$2a$10$hashed_password_1', 'alex.dm@rpgmail.com'),
                                                                (2, 'warrior_sarah', '$2a$10$hashed_password_2', 'sarah.warrior@rpgmail.com'),
                                                                (3, 'mage_michael', '$2a$10$hashed_password_3', 'michael.mage@rpgmail.com'),
                                                                (4, 'rogue_emma', '$2a$10$hashed_password_4', 'emma.rogue@rpgmail.com'),
                                                                (5, 'cleric_david', '$2a$10$hashed_password_5', 'david.cleric@rpgmail.com');

-- Insert 2 rooms (waiting rooms for parties to start)
INSERT INTO "room" ("id", "name", "description", "url", "fk_owner") VALUES
                                                                        (1, 'Dragon''s Lair Campaign - Lobby', 'Waiting room for the Dragon''s Lair adventure. Please wait for all party members to join before we begin!', 'dragons-lair-lobby', 1),
                                                                        (2, 'Midnight Heist Planning Room', 'Pre-game lobby for the Midnight Heist campaign. Get ready for an urban adventure!', 'midnight-heist-lobby', 1);

-- Insert room_users (Room 1: 4 players + owner is separate, Room 2: 4 players + owner is separate)
-- Room 1 participants (owner + 3 players)
INSERT INTO "room_users" ("fk_room", "fk_player", "character_name") VALUES
                                                                        (1, 2, 'Thora the Brave'),
                                                                        (1, 3, 'Eldrin Starweaver'),
                                                                        (1, 4, 'Shadow Whisper');

-- Room 2 participants (owner + 3 players)
INSERT INTO "room_users" ("fk_room", "fk_player", "character_name") VALUES
                                                                        (2, 3, 'Arcane Lockpick'),
                                                                        (2, 4, 'Silent Steps'),
                                                                        (2, 5, 'Brother Lightbringer');