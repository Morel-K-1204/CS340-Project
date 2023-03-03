/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
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
app.get('/', function(req, res)
    {
        res.render('index');
    });
app.get('/players', function(req, res)
    {
        res.render('players');
    });
app.get('/decks', function(req, res)
    {
        let query1 = "SELECT Decks.DeckID, Players.Username AS Player_Username FROM Decks INNER JOIN Players ON Decks.PlayerID = Players.PlayerID ORDER BY Decks.DeckID;"
        
        db.pool.query(query1, function(error, rows, fields)
        {
            res.render('decks', {data: rows});
        });
    });
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
