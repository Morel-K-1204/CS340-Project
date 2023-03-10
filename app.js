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
        let query1 = "SELECT Decks.DeckID, Players.Username AS Player_Username FROM Decks INNER JOIN Players ON Decks.PlayerID = Players.PlayerID ORDER BY Decks.DeckID;"
        
        db.pool.query(query1, function(error, rows, fields)
        {
            res.render('decks', {data: rows});
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
        let query1 = "SELECT Deck_Cards.DeckID, Cards.Name AS Card_Name, Deck_Cards.Qty FROM Deck_Cards INNER JOIN Cards ON Deck_Cards.CardID = Cards.CardID ORDER BY Deck_Cards.DeckID, Deck_Cards.CardID;"
		
		db.pool.query(query1, function(error, rows, fields)
        {
			res.render('deck_cards', {data: rows});
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
            res.redirect('/deck_cards');
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
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
