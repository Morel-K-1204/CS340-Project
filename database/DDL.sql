-- Team 119
-- Members: Toby Parrish, Morel Kopcho

-- Disable commits and foreign checks for table setup
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Table creation
-- Cards represents different types of cards that can be included within a deck
CREATE OR REPLACE TABLE Cards(
    CardID int AUTO_INCREMENT,
    Name varchar(50) NOT NULL,
    Description varchar(200),
    Power int NOT NULL,
    Health int NOT NULL,
    SpawnCost int NOT NULL,
    PRIMARY KEY (CardID)
);

-- Players represents the various players using the game site
CREATE OR REPLACE TABLE Players(
    PlayerID int AUTO_INCREMENT,
    Username varchar(50) NOT NULL,
    PRIMARY KEY (PlayerID)
);

-- Decks represents the individual decks a player owns and can add/remove cards
CREATE OR REPLACE TABLE Decks(
	DeckID int AUTO_INCREMENT,
    PlayerID int,
    PRIMARY KEY (DeckID),
	FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID)
	ON DELETE CASCADE
);

-- Matches represents a history of games between players and keeps track of decks used and the winner
CREATE OR REPLACE TABLE Matches(
	MatchID int AUTO_INCREMENT,
    Player1Win BOOLEAN,
	Deck1ID int,
	Deck2ID int,
    PRIMARY KEY (MatchID),
	FOREIGN KEY (Deck1ID) REFERENCES Decks(DeckID)
	ON DELETE SET NULL,
	FOREIGN KEY (Deck2ID) REFERENCES Decks(DeckID)
	ON DELETE SET NULL
);

-- Deck_Cards is an intersection table between Decks and Cards
-- It keeps track of which cards are in which deck, as well as the number of
-- copies of the card used in the deck
CREATE OR REPLACE TABLE Deck_Cards(
	DeckID int,
	CardID int,
	Qty int NOT NULL,
    PRIMARY KEY (DeckID, CardID),
	FOREIGN KEY (DeckID) REFERENCES Decks(DeckID)
	ON DELETE CASCADE,
	FOREIGN KEY (CardID) REFERENCES Cards(CardID)
	ON DELETE CASCADE
);

-- Data initialization
INSERT INTO Cards(Name, Description, Power, Health, SpawnCost)
VALUES ('Spiky Boy','When this card is attacked, deal 1 damage to the attacker',1,2,1),
('Bat','When this card is attacked, damage is instead dealt to the player',2,2,3),
('Sear Sword',NULL,2,2,2),
('Skeleton','When this card is defeated, flip a coin. If the coin lands heads, return the card to your hand',1,3,2);

INSERT INTO Players(Username)
VALUES ('Larvene37'), ('DistanceShock'), ('Voidance'), ('Reqaz1a');

INSERT INTO Decks(PlayerID)
VALUES ((SELECT PlayerID FROM Players WHERE Username = 'Larvene37')),
((SELECT PlayerID FROM Players WHERE Username = 'DistanceShock')),
((SELECT PlayerID FROM Players WHERE Username = 'DistanceShock')),
((SELECT PlayerID FROM Players WHERE Username = 'Reqaz1a'));

-- Note: The deck ids must be hardcoded here since a player can have multiple decks
INSERT INTO Matches(Player1Win, Deck1ID, Deck2ID)
VALUES (TRUE,3,1),
(TRUE,2,1),
(FALSE,4,2);

INSERT INTO Deck_Cards(DeckID, CardID, Qty)
VALUES (1,(SELECT CardID FROM Cards WHERE Name = 'Spiky Boy'),3),
(1,(SELECT CardID FROM Cards WHERE Name = 'Bat'),1),
(2,(SELECT CardID FROM Cards WHERE Name = 'Skeleton'),2),
(2,(SELECT CardID FROM Cards WHERE Name = 'Sear Sword'),1),
(3,(SELECT CardID FROM Cards WHERE Name = 'Bat'),4);

-- Reenable commit and foreign key checks
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
