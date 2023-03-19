-- Team 119
-- Members: Toby Parrish, Morel Kopcho
-- $ indicates the variable will be passed in by the back-end code

--Select queries
SELECT * FROM Cards
ORDER BY CardID;

SELECT * FROM Players
ORDER BY PlayerID;

SELECT Decks.DeckID, Players.Username AS Player_Username FROM Decks
INNER JOIN Players ON Decks.PlayerID = Players.PlayerID
ORDER BY Decks.DeckID;

-- NOTE: learned to alias tables from https://www.w3schools.com/sql/sql_alias.asp
SELECT Matches.MatchID, Matches.Player1Win,
Matches.Deck1ID, Player1.Username AS Player_1_Username,
Matches.Deck2ID, Player2.Username AS Player_2_Username FROM Matches
LEFT JOIN Decks AS Deck1 ON Matches.Deck1ID = Deck1.DeckID
LEFT JOIN Decks AS Deck2 ON Matches.Deck2ID = Deck2.DeckID
LEFT JOIN Players AS Player1 ON Deck1.PlayerID, = Player1.PlayerID
LEFT JOIN Players AS Player2 ON Deck2.PlayerID, = Player2.PlayerID
ORDER BY Matches.MatchID;

SELECT Deck_Cards.DeckID, Cards.Name AS Card_Name, Deck_Cards.Qty FROM Deck_Cards
INNER JOIN Cards ON Deck_Cards.CardID = Cards.CardID
ORDER BY Deck_Cards.DeckID, Deck_Cards.CardID;

SELECT Deck_Cards.DeckID, Cards.Name AS Card_Name, Deck_Cards.Qty FROM Deck_Cards
INNER JOIN Cards ON Deck_Cards.CardID = Cards.CardID
WHERE DeckID = $DeckIDInput
ORDER BY Deck_Cards.CardID;

-- Insert queries
INSERT INTO Cards(Name, Description, Power, Health, SpawnCost)
VALUES($NameInput, $DescriptionInput, $PowerInput, $HealthInput, $CostInput);

INSERT INTO Players(Username)
VALUES($UsernameInput);

INSERT INTO Decks(PlayerID)
VALUES($PlayerIDDropdownInput);

INSERT INTO Matches(Player1Win, Deck1ID, Deck2ID)
VALUES($Player1WinInput, $Deck1IDDropdownInput, $Deck2IDDropdownInput);

INSERT INTO Deck_Cards(DeckID, CardID, Qty)
VALUES($DeckIDDropdownInput, $CardIDDropdownInput, $QtyInput);

-- Update Queries
UPDATE Matches
SET Deck1ID = $Deck1IDDropdownInput, Deck2ID = $Deck2IDDropdownInput
WHERE MatchID = $MatchIDDropdownInput;

-- Delete Queries
DELETE FROM Decks
WHERE DeckID = $DeckIDDropdownInput;