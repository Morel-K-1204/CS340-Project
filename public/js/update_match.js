
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-match-form');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("match-id-update");
    let inputWinner = document.getElementById("player-win-update");
	let inputDeck1 = document.getElementById("deck-1-id-update");
	let inputDeck2 = document.getElementById("deck-2-id-update");

    // Get the values from the form fields
	let idValue = inputID.value;
    let winnerValue = inputWinner.value;
	let deck1Value = inputDeck1.value;
	let deck2Value = inputDeck2.value;

    // Put our data we want to send in a javascript object
    let data = {
        id: idValue,
        winner: winnerValue,
		deck1: deck1Value,
		deck2: deck2Value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-match", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, matchID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("match-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == matchID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Reassign all the values to what we updated to
            updateRowIndex.getElementsByTagName("td")[1].innerHTML = parsedData[0].Player1Win;
			updateRowIndex.getElementsByTagName("td")[2].innerHTML = parsedData[0].Deck1ID;
			updateRowIndex.getElementsByTagName("td")[3].innerHTML = parsedData[0].Player_1_Username;
			updateRowIndex.getElementsByTagName("td")[4].innerHTML = parsedData[0].Deck2ID;
			updateRowIndex.getElementsByTagName("td")[5].innerHTML = parsedData[0].Player_2_Username;
       }
    }
}
