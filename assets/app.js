// Steps to complete:
/*
1. Initialize Firebase
2. Create button for adding new employees - then update the html + update the database
3. Create a way to retrieve employees from the employee database.
4. Create a way to calculate the months worked. Using difference between start and current time. Then use moment.js formatting to set difference in months.
5. Calculate Total billed

*/
// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCrqC8zTcmvXFRm71wyX7fbm3Hscfosdks",
  authDomain: "train-schedule-f1f70.firebaseapp.com",
  databaseURL: "https://train-schedule-f1f70.firebaseio.com",
  projectId: "train-schedule-f1f70",
  storageBucket: "train-schedule-f1f70.appspot.com",
  messagingSenderId: "275453440621"
};
firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding Employees
$("#addTrainBtn").on("click", function(){

    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var dest = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").format("X");
    var freq = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name:  trainName,
        dest: dest,
        start: firstTrain,
        frequency: freq
    }

    // Uploads employee data to the database
    database.ref().push(newTrain);
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    // Alert
    alert("Employee successfully added");

    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

    // Prevents moving to new page
    return false;
});


// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainStart = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(trainDest);
    console.log(trainStart);
    console.log(trainFreq);

    var trainStartConverted = moment(trainStart, "hh:mm").subtract(1, "years");
    var currentTime = moment().format("hh:mm");
    var diffTime = moment().diff(moment(trainStartConverted), "minutes");
    var remainder = diffTime % trainFreq;
    var minutesUntilTrain = trainFreq - remainder;
    var nextTrainArrival = moment().add(minutesUntilTrain, "minutes").format("hh:mm");


    // Add each train's data into the table
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrainArrival  + "</td><td>" + minutesUntilTrain + "</td></tr>");

});
