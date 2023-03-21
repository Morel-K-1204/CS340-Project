/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 50123;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
/*
    Read operations
*/
app.get('/', function(req, res)
    {
        res.render('index');
    });
app.get('/cards', function(req, res)
    {
        let query1 = "SELECT * FROM Cards ORDER BY CardID;"
		
		db.pool.query(query1, function(error, rows, fields)
        {
			res.render('cards', {data: rows});
        });
    });
app.get('/players', function(req, res)
    {
        let query1 = "SELECT * FROM Players ORDER BY PlayerID;"
		
		db.pool.query(query1, function(error, rows, fields)
        {
			res.render('players', {data: rows});
        });
    });
app.get('/decks', function(req, res)
    {
        // Query for populating decks table
        let query1 = "SELECT Decks.DeckID, Players.Username AS Player_Username FROM Decks INNER JOIN Players ON Decks.PlayerID = Players.PlayerID ORDER BY Decks.DeckID;"

        // Query for populating dropdown menus
        let query2 = "SELECT * FROM Players ORDER BY PlayerID;"
        
        // Run query1
        db.pool.query(query1, function(error, rows, fields)
        {
            // Save the decks from query1
            let decks = rows;

            // Run query2
            db.pool.query(query2, (error, rows, fields) => {
                // save the players from query2
                let players = rows;

                return res.render('decks', {data: decks, players:players});
            })

        });
    });
app.get('/matches', function(req, res)
    {
        // Query for populating matches table
        let query1 = "SELECT Matches.MatchID, Matches.Player1Win, Matches.Deck1ID, Player1.Username AS Player_1_Username, Matches.Deck2ID, Player2.Username AS Player_2_Username FROM Matches LEFT JOIN Decks AS Deck1 ON Matches.Deck1ID = Deck1.DeckID LEFT JOIN Decks AS Deck2 ON Matches.Deck2ID = Deck2.DeckID LEFT JOIN Players AS Player1 ON Deck1.PlayerID = Player1.PlayerID LEFT JOIN Players AS Player2 ON Deck2.PlayerID = Player2.PlayerID ORDER BY Matches.MatchID;"

        // Query for populating dropdown menus
        let query2 = "SELECT Decks.DeckID, Players.Username AS Player_Username FROM Decks INNER JOIN Players ON Decks.PlayerID = Players.PlayerID ORDER BY Decks.DeckID;"
		
		// Run query1
        db.pool.query(query1, function(error, rows, fields)
        {
            // Save the matches from query1
            let matches = rows;

            // Run query2
            db.pool.query(query2, (error, rows, fields) => {
                // Save the decks from query2
                let decks = rows;

                return res.render('matches', {data: matches, decks: decks});
            });
        });
    });
app.get('/deck_cards', function(req, res)
    {
        // Query for populating the deck_cards table
        let query1;
        
        // Case where the user hasn't selected a deck to filter by
        if(req.query.FilterByDeckID == "" || req.query.FilterByDeckID === undefined) 
        {
            query1 = "SELECT Deck_Cards.DeckID, Cards.Name AS Card_Name, Deck_Cards.Qty FROM Deck_Cards INNER JOIN Cards ON Deck_Cards.CardID = Cards.CardID ORDER BY Deck_Cards.DeckID, Deck_Cards.CardID;"
        }
        else
        {
            query1 = `SELECT Deck_Cards.DeckID, Cards.Name AS Card_Name, Deck_Cards.Qty FROM Deck_Cards INNER JOIN Cards ON Deck_Cards.CardID = Cards.CardID WHERE DeckID = ${req.query.FilterByDeckID} ORDER BY Deck_Cards.CardID;`
        }

        // Query for populating the decks dropdown menu
        let query2 = "SELECT Decks.DeckID, Players.Username AS Player_Username FROM Decks INNER JOIN Players ON Decks.PlayerID = Players.PlayerID ORDER BY Decks.DeckID;"

        // Query for populating the cards dropdown menu
        let query3 = "SELECT * FROM Cards ORDER BY CardID;"
		
		// Run query1
        db.pool.query(query1, function(error, rows, fields)
        {
			// Save the deck_cards from query1
            let deck_cards = rows;

            // Run query2
            db.pool.query(query2, function(error, rows, fields)
            {
                // Save the decks from query2
                let decks = rows;

                // Run query 3
                db.pool.query(query3, (error, rows, fields) => {
                    // Save the cards from query3
                    let cards = rows;

                    res.render('deck_cards', {data: deck_cards, decks: decks, cards: cards});
                })
            })
        });
    });
/*
    Insert operations
*/
app.post('/add-card', function(req, res){
    let data = req.body;
	
    query1 = `INSERT INTO Cards(Name, Description, Power, Health, SpawnCost) VALUES('${data['name-input']}', '${data['description-input']}', ${data['power-input']}, ${data['health-input']}, ${data['cost-input']});`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
			console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/cards');
        }
    })
})

app.post('/add-player', function(req, res){
    let data = req.body;
	
    query1 = `INSERT INTO Players(Username) VALUES('${data['username-input']}');`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
			console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/players');
        }
    })
})

app.post('/add-deck', function(req, res){
    let data = req.body;
	
    query1 = `INSERT INTO Decks(PlayerID) VALUES (${data['player-input']});`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
			console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/decks');
        }
    })
})

app.post('/add-deck-card', function(req, res){
    let data = req.body;
	
    query1 = `INSERT INTO Deck_Cards(DeckID, CardID, Qty) VALUES(${data['deck-id-input']}, ${data['card-id-input']}, ${data['quantity-input']});`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
			console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/deck_cards');
        }
    })
})

app.post('/add-match', function(req, res){
    let data = req.body;
	
    query1 = `INSERT INTO Matches(Player1Win, Deck1ID, Deck2ID) VALUES(${data['player-1-win-input']}, ${data['deck-1-id-input']}, ${data['deck-2-id-input']});`
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
			console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/matches');
        }
    })
})
/*
    Delete operations
*/
app.delete('/delete-deck-ajax/', function(req,res,next){
  let data = req.body;
  let deckID = parseInt(data.id);
  let deleteDeck = `DELETE FROM Decks WHERE DeckID = ?;`;

	db.pool.query(deleteDeck, [deckID], function(error, rows, fields) {
		if (error) {
			console.log(error);
			res.sendStatus(400);
		} else {
			res.sendStatus(204);
		}
	})
});
/*
    Update operations
*/
app.put('/put-match', function(req,res,next){
  let data = req.body;

  let id = parseInt(data.id);
  let winner = parseInt(data.winner);
  let deck1 = parseInt(data.deck1);
  let deck2 = parseInt(data.deck2);

  let queryUpdateMatch = `UPDATE Matches SET Player1Win = ?, Deck1ID = ?, Deck2ID = ? WHERE MatchID = ?;`;
  let selectMatch = `SELECT Matches.MatchID, Matches.Player1Win, Matches.Deck1ID, Player1.Username AS Player_1_Username, Matches.Deck2ID, Player2.Username AS Player_2_Username FROM Matches INNER JOIN Decks AS Deck1 ON Matches.Deck1ID = Deck1.DeckID INNER JOIN Decks AS Deck2 ON Matches.Deck2ID = Deck2.DeckID INNER JOIN Players AS Player1 ON Deck1.PlayerID = Player1.PlayerID INNER JOIN Players AS Player2 ON Deck2.PlayerID = Player2.PlayerID ORDER BY Matches.MatchID WHERE id = ?`

        // Run the 1st query
        db.pool.query(queryUpdateMatch, [winner, deck1, deck2, id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectMatch, [id], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
