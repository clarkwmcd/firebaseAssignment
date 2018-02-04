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

$("#addTrainBtn").on("click", function() {

  var trainName = $("#trainNameInput").val().trim();
  var dest = $("#destinationInput").val().trim();
  var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").format("X");
  var freq = $("#frequencyInput").val().trim();

  var newTrain = {
    name: trainName,
    dest: dest,
    start: firstTrain,
    frequency: freq
  }

  database.ref().push(newTrain);

  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#firstTrainInput").val("");
  $("#frequencyInput").val("");

  return false;
});



database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().frequency;

  var trainStartConverted = moment(trainStart, "hh:mm").subtract(1, "years");
  var currentTime = moment().format("hh:mm");
  var diffTime = moment().diff(moment(trainStartConverted), "minutes");
  var remainder = diffTime % trainFreq;
  var minutesUntilTrain = trainFreq - remainder;
  var nextTrainArrival = moment().add(minutesUntilTrain, "minutes").format("hh:mm");

  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td class='update-nextTrainArrival'>" + nextTrainArrival + "</td><td class='update-minutesUntilTrain'>" + minutesUntilTrain + "</td></tr>");

});

database.ref().on("value", function(snapshot) {

  $("#click-value").text(snapshot.val().clickCount);

  clickCounter = snapshot.val().clickCount;

}, function(errorObject) {


  console.log("The read failed: " + errorObject.code);
});
