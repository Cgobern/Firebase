$(document).ready(function(){ 
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBvxIXAMPH9qWxIJEcnLWO6OxfljyyoYsY",
    authDomain: "trainschedule-79140.firebaseapp.com",
    databaseURL: "https://trainschedule-79140.firebaseio.com",
    storageBucket: "trainschedule-79140.appspot.com",
  };
  firebase.initializeApp(config);

	// Referencing the firebase
	var database= firebase.database();

	//Initial values
	var train = {
		Name: "",
		Dest: "",
		Time: "",
		Freq: 0,
	};
		//Button for adding trains
	$("#submitTrain").on("click", function(){

		//Getting new train input
		train.Name = $('#addName').val().trim();
		train.Dest = $('#addDestination').val().trim();
		train.Time = $('#addTime').val();
		train.Freq = $('#addFreq').val().trim();

		//Creating temporary object for holding train new

		var newTrain = {
			name: train.Name,
			destination: train.Dest,
			time: train.Time,
			frequency: train.Freq
		}

		//Uploads train data to the database
		database.ref().push({
			newTrain,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	
		
		// Clears all of the text-boxes
		$("#addName").val("");
		$("#addDestination").val("");
		$("#addTime").val("");
		$("#addFreq").val("");

		//Prevents moving to new page
		return false;

	});

	//Make all of this update every 60 seconds

	//Create Firebase event for adding trains to the database and a row in the html with entries
		database.ref().on("child_added", function(childSnapshot){
			//console.log(childSnapshot.val());

		//Add stored trains to the schedule
			//assigning stored train names to a variable
			train.Name = childSnapshot.val().newTrain.name;
				$('#name').append('<div class="row" id="nameRow">');
				$('#nameRow').append(train.Name);
				//Add a new line for the next train
				$('#nameRow').append("<br/>");

			//Destination
			train.Dest = childSnapshot.val().newTrain.destination;
				$('#destination').append('<div class="row" id="destRow">');
				$('#destRow').append(train.Dest);
				//Add a new line for the next train
				$('#destRow').append("<br/>");

			//Frequency
			train.Freq = childSnapshot.val().newTrain.frequency;
				$('#frequency').append('<div class="row" id="freqRow">');
				$('#freqRow').append(train.Freq);
				//Add a new line for the next train
				$('#freqRow').append("<br/>");

			//Calculate arrival times and minutes away on page load.
			//Get the first train time stored in the database.
			train.Time = childSnapshot.val().newTrain.time;

			//Push first time back a year to make sure it comes before current time
				var firstTimeConverted = moment(train.Time, "hh:mm")
					.subtract(1, "years");
					//console.log(firstTimeConverted);

				//function calculateTime () {
				//Current Time
				var currentTime = moment();
				//console.log("CURRENT TIME: " + moment(currentTime)
					//.format("hh:mm"));

				//Difference between the times
				var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
				//console.log("Difference in time: " + diffTime);

				//Time apart (remainder)
				var tRemainder = diffTime % train.Freq;
				//console.log(tRemainder);

				//Minutes until train
				var tMinutesForTrain = train.Freq - tRemainder;
				//console.log("Minutes for train: " + tMinutesForTrain);

				//Next Train
				var nextTrain = moment().add(tMinutesForTrain, "minutes");
				//console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

			 	var arrivalTime = (moment(nextTrain).format("HH:mm A"));
			 	//console.log(arrivalTime);

				//Next train arrival
				$('#next').append('<div class="row" id="nextRow">');
				$('#nextRow').append(arrivalTime);
				//Add a new line for the next train
				$('#nextRow').append("<br/>");

				//Next train minutes away
				$('#away').append('<div class="row" id="awayRow">');
				$('#awayRow').append(tMinutesForTrain);
				//Add a new line for the next train
				$('#awayRow').append("<br/>");
				// If any errors are experienced, log them to console.
			}, function (errorObject) {

			  	console.log("The read failed: " + errorObject.code);
	});
});	