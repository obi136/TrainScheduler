$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDPuhs26NYfH96c3F1qxfhhBkwsryx5Mrg",
        authDomain: "trainscheduler-abc3d.firebaseapp.com",
        databaseURL: "https://trainscheduler-abc3d.firebaseio.com",
        projectId: "trainscheduler-abc3d",
        storageBucket: "trainscheduler-abc3d.appspot.com",
        messagingSenderId: "826028321432"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var currentTime = moment().format("HH:mm.ss");


    // var currentTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    // console.log("Current Time: " + currentTime);

    //   var tFrequency = 3;

    //   var firstTime = "03:30";

    //   var firstTimeConverted

    $("#displayTime").html(currentTime);

    $("#submitTrain").on("click", function () {
        var trainName = $("#trainNameInput").val().trim();
        var trainDest = $("#destinationInput").val().trim();
        var trainTime = $("#timeInput").val().trim();
        var trainFreq = $("#freqInput").val().trim();

        database.ref().push({
            trainName: trainName,
            trainDest: trainDest,
            trainTime: trainTime,
            trainFreq: trainFreq,
            trainAdded: firebase.database.ServerValue.TIMESTAMP
        });

        console.log("Train Name: " + trainName);
        console.log("Train Destination: " + trainDest);
        console.log("Train Time: " + trainTime);
        console.log("Frequency: " + trainFreq);


    });

    database.ref().on("child_added", function (snapshot) {
        var trainName = snapshot.val().trainName;
        var trainDest = snapshot.val().trainDest;
        var trainTime = snapshot.val().trainTime;
        var trainFreq = snapshot.val().trainFreq;

        console.log("Train Name: " + trainName);
        console.log("Train Destination: " + trainDest);
        console.log("Train Time: " + trainTime);
        console.log("Frequency: " + trainFreq);

        var trainFreq = parseInt(trainFreq);
        var currentTime = moment();
        console.log("Current Time: " + moment().format("HH:mm.ss"));

        var dateConvert = moment(snapshot.val().trainTime, "HH:mm.ss").subtract(1, "years");
        console.log("CONVERTED DATE: " + dateConvert);

        var timeTrain = moment(dateConvert).format("HH:mm.ss");
        console.log("Train Time: " + timeTrain);

        var trainConvert = moment(timeTrain, "HH:mm.ss").subtract(1, "years");
        var timeDifference = moment().diff(moment(trainConvert), "minutes");
        console.log("Time Difference: " + timeDifference);

        var timeRemainder = timeDifference % trainFreq;
        console.log("Time Remaining: " + timeRemainder);

        var minsAway = trainFreq - timeRemainder;
        console.log("Minutes until next train arrives: " + minsAway);

        var nextTrain = moment().add(minsAway, "minutes");
        console.log("Next Train Arrival Time: " + nextTrain);

        // $("#displayTime").html(currentTime);
        $("#trainTable").append(
            "<tr><td>" + snapshot.val().trainName +
            "</td><td>" + snapshot.val().trainDest +
            "</td><td>" + snapshot.val().trainFreq +
            "</td><td>" + moment(nextTrain).format("HH:mm") +
            "</td><td>" + minsAway + ' minutes until arrival' + "</td></tr>");
    
    });
});

