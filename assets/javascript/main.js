// VIDEO VIDEO VIDEO
var video = document.getElementById("fullscreen-bg__video");

var btn = $('#btn-video');

// Pause and play the video, and change the button text
function videoController() {
    if (video.paused) {
        video.play();
        $('#btn-video').removeClass("fa-play-circle");
        $('#btn-video').addClass("fa-pause-circle");
        console.log(this);
        
    } else {
        video.pause();
        $('#btn-video').addClass("fa-play-circle");
        $('#btn-video').removeClass("fa-pause-circle");
    }
}

$("nav a, a[href='#home']").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();
        // Store hash
        var hash = this.hash;
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 500, function() {
            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;                          
        });
    }
});

// Initialize Firebase
var config = {
  apiKey: localStorage.getItem("keyFirebase"),
  authDomain: "bandana-30ebf.firebaseapp.com",
  databaseURL: "https://bandana-30ebf.firebaseio.com",
  projectId: "bandana-30ebf",
  storageBucket: "",
  messagingSenderId: "216379677416"
};
firebase.initializeApp(config);
var database = firebase.database();

// Value of input fields
var artistInput;
var locationInput;
var startDateInput;
var endDateInput;

// URLs for AJAX calls to the Bands in Town API
var queryURLTemplate = "https://rest.bandsintown.com/artists/";
var queryURLArtist;
var queryURLEvents;

// Status checkers for the AJAX calls (making sure we get both promises before the html elements are dynamically created)
var promiseArtistStatus = false;
var promiseEventsStatus = false;
// Information from the promises we'll use to populate html elements (search results)
// ARTIST AJAX REQUEST
var artistName;
var artistFB;
var artistImage;
// EVENTS AJAX REQUEST
var events = [];
var eventsByLocation = [];
var eventIndex = 0;
var count = 0;

vex.defaultOptions.className = 'vex-theme-flat-attack';



// AJAX calls to the Bands in Town API
function searchBandana() {
  eventIndex = 0;
  events.length = 0;
  eventsByLocation.length = 0;
  $("#five-more").remove();

    $.ajax({
      url: queryURLArtist,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      // If the band exists and we get a promise back, save the values in global variables
      if (response) {
        promiseArtistStatus = true;
        artistName = response.name;
        artistFB = response.facebook_page_url;
        artistImage = response.image_url;

        // If artistName does not exist in Firebase, save it in the database
        firebase.database().ref().orderByChild("artistName").equalTo(artistName).on("value", function(snapshot){
          if(snapshot.val() === null){
          database.ref().push({
            artistName: artistName,
            artistImage: artistImage,
            dateAdded: firebase.database.ServerValue.TIMESTAMP}
          )};
        });
      
      // Else let the user know the artist name couldn't be found
    } else {
        vex.dialog.alert("Sorry, artist not found");
      };

      // Only when both promises came back, generate the cards
      if (promiseArtistStatus === true && promiseEventsStatus === true) {
        generateCards();
      }
    });

    $.ajax({
      url: queryURLEvents,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      // If the band exists and we get a promise back, save the values in global variables
      if (response) {
        promiseEventsStatus = true;
        events.push(response);
      };
      // Only when both promises came back, generate the cards
      if (promiseArtistStatus === true && promiseEventsStatus === true) {
        generateCards();
      };
    });
  }

   function generateCards() {

    // *** ARTIST INFORMATION ***
      // Dynamically creating the card
      $("#artist-holder").empty();
      var cardDiv = $("<div class='card' style='width: 15rem; position: relative; margin-bottom: 1rem;'>");
      var cardImg = $("<img class='card-img-top'>").attr("src", artistImage);
      var cardBody = $("<div class='card-body d-flex justify-content-between' style='padding: 0.5rem; width: 100%; position: absolute; bottom: 0;'>");
      if (artistFB !== "") {
        var cardFB = $("<a href='"+ artistFB +"' target='_blank'><img src='assets/images/fb_logo.png' style='width: 30px'></a>");
      } else {
        var cardFB = $("<div>");
      };
      var cardName = $("<h4 class='card-title' style='margin: 0; font-weight: bold; background-color: rgba(255, 208, 0, 0.5); color: black; padding: 0.5rem 1rem; border-radius: 10px;'>").text(artistName);
      // Append the new artist content
      cardBody.append(cardName, cardFB);
      cardDiv.append(cardImg, cardBody);
      $("#artist-holder").append(cardDiv);
  
    if (locationInput === "") {
      // *** EVENTS INFORMATION ***
      // Dynamically creating the cards
      $("#events-holder").empty();
      
      for (let i = 0; i < 10; i++) {
        
        var eventDiv = $("<div class='card d-flex flex-row flex-nowrap search-results event-div'>");
        var eventColumn1 = $("<div class='col-lg-6 position-relative'>");
        var eventColumn2 = $("<div class='col-lg-6 d-flex justify-content-center align-middle'>");
        eventColumn1.append("<p class='position-absolute event-index'>" + (eventIndex+1) + "</p>")
        var eventDate = $("<p class='event-date'>" + moment(events[0][i].datetime).format("MMMM D YYYY, h:mm A") + "</p>");
        var eventLocation = $("<p class='event-location'>" + events[0][i].venue.city + " " + events[0][i].venue.region + " " + events[0][i].venue.country + "</p>");
        var eventVenue = $("<p class='event-venue'>" + events[0][i].venue.name + "</p>");
        var eventURL = $("<a class='event-tickets' href='" + events[0][i].url + "' target='_blank'><i class='fas fa-ticket-alt'></i> Get tickets</a>");
        var eventMap = $("<a href='https://www.google.com/maps/place/" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "' target='_blank'><img style='border-radius: 5px;' src='https://maps.googleapis.com/maps/api/staticmap?center=" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "&zoom=14&size=350x200&maptype=roadmap&markers=color:red%7Clabel:C%7C" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "&key=" + localStorage.getItem("keyMaps") +"'></a>");
        eventColumn1.append(eventDate, eventLocation, eventVenue, eventURL);
        eventColumn2.append(eventMap);
        eventDiv.append(eventColumn1, eventColumn2);
        $("#events-holder").append(eventDiv);

        eventIndex++;
      };
        
        $("#events-holder").prepend("<button id='five-more' class='btn btn-danger' onclick='generateFiveMore()'>+5</button>");
        promiseEventsStatus = false;
        promiseArtistStatus = false;
  
    } else {
      
      for (let i = 0; i < events[0].length; i++) {
        if (locationInput === (events[0][i].venue.country).toUpperCase() || locationInput === (events[0][i].venue.city).toUpperCase() || locationInput === (events[0][i].venue.region).toUpperCase() || locationInput === (events[0][i].venue.name).toUpperCase()) {
          eventsByLocation.push(events[0][i]);
        };
      };
  
      if (eventsByLocation.length !== 0) {
        // *** EVENTS INFORMATION ***
        // Dynamically creating the cards
        $("#events-holder").empty();
        
        for (let i = 0; i < 10; i++) {
          var eventDiv = $("<div class='card d-flex flex-row flex-nowrap search-results event-div'>");
          var eventColumn1 = $("<div class='col-lg-6 position-relative'>");
          var eventColumn2 = $("<div class='col-lg-6 d-flex justify-content-center align-middle'>");
          eventColumn1.append("<p class='position-absolute event-index'>" + (eventIndex+1) + "</p>")
          var eventDate = $("<p class='event-date'>" + moment(eventsByLocation[i].datetime).format("MMMM D YYYY, h:mm A") + "</p>");
          var eventLocation = $("<p class='event-location'>" + eventsByLocation[i].venue.city + " " + eventsByLocation[i].venue.region + " " + eventsByLocation[i].venue.country + "</p>");
          var eventVenue = $("<p class='event-venue'>" + eventsByLocation[i].venue.name + "</p>");
          var eventURL = $("<a class='event-tickets' href='" + eventsByLocation[i].url + "' target='_blank'><i class='fas fa-ticket-alt'></i> Get tickets</a>");
          var eventMap = $("<a href='https://www.google.com/maps/place/" + eventsByLocation[i].venue.latitude + "," + eventsByLocation[i].venue.longitude + "' target='_blank'><img style='border-radius: 5px;' src='https://maps.googleapis.com/maps/api/staticmap?center=" + eventsByLocation[i].venue.latitude + "," + eventsByLocation[i].venue.longitude + "&zoom=14&size=350x200&maptype=roadmap&markers=color:red%7Clabel:C%7C" + eventsByLocation[i].venue.latitude + "," + eventsByLocation[i].venue.longitude + "&key=" + localStorage.getItem("keyMaps") +"'></a>");
          eventColumn1.append(eventDate, eventLocation, eventVenue, eventURL);
          eventColumn2.append(eventMap);
          eventDiv.append(eventColumn1, eventColumn2);
          $("#events-holder").append(eventDiv);
          
          eventIndex++;
        };
        $("#events-holder").prepend("<button id='five-more' class='btn btn-danger' onclick='generateFiveMore()'>+5</button>");
  
      } else {
        $("#events-holder").empty();
        vex.dialog.alert("No events in the selected location");
      };
    };
  };

function generateFiveMore() {
  for (let i = eventIndex; i < (eventIndex + 5); i++) {
    
    var eventDiv = $("<div class='card d-flex flex-row flex-nowrap search-results event-div'>");
    var eventColumn1 = $("<div class='col-lg-6 position-relative'>");
    var eventColumn2 = $("<div class='col-lg-6 d-flex justify-content-center align-middle'>");
    eventColumn1.append("<p class='position-absolute event-index'>" + (i+1) + "</p>")
    var eventDate = $("<p class='event-date'>" + moment(events[0][i].datetime).format("MMMM D YYYY, h:mm A") + "</p>");
    var eventLocation = $("<p class='event-location'>" + events[0][i].venue.city + " " + events[0][i].venue.region + " " + events[0][i].venue.country + "</p>");
    var eventVenue = $("<p class='event-venue'>" + events[0][i].venue.name + "</p>");
    var eventURL = $("<a class='event-tickets' href='" + events[0][i].url + "' target='_blank'><i class='fas fa-ticket-alt'></i> Get tickets</a>");
    var eventMap = $("<a href='https://www.google.com/maps/place/" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "' target='_blank'><img style='border-radius: 5px;' src='https://maps.googleapis.com/maps/api/staticmap?center=" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "&zoom=14&size=350x200&maptype=roadmap&markers=color:red%7Clabel:C%7C" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "&key=" + localStorage.getItem("keyMaps") +"'></a>");
    eventColumn1.append(eventDate, eventLocation, eventVenue, eventURL);
    eventColumn2.append(eventMap);
    eventDiv.append(eventColumn1, eventColumn2);
    $("#events-holder").append(eventDiv);
    console.log(eventIndex);
  };
  eventIndex += 5;
}

function validation() {
  event.preventDefault();
    
    artistInput = $("#artist-input").val().trim();
    artistLetterArray = artistInput.split("");

    for (let i = 0; i < artistLetterArray.length; i++) {

      if (artistLetterArray[i] === "/") {
        artistLetterArray.splice(i, 1, "%252F");
        artistInput = artistLetterArray.join("");
      }

      if (artistLetterArray[i] === "?") {
        artistLetterArray.splice(i, 1, "%253F");
        artistInput = artistLetterArray.join("");
      }


      if (artistLetterArray[i] === "*") {
        artistLetterArray.splice(i, 1, "%252A");
        artistInput = artistLetterArray.join("");
      }

      if (artistLetterArray[i] === '"') {
        artistLetterArray.splice(i, 1, "%27C");
        artistInput = artistLetterArray.join("");
      }
    };
      
      
    locationInput = ($("#location-input").val().trim()).toUpperCase();
    startDateInput = $("#start-date-input").val().trim();
    endDateInput = $("#end-date-input").val().trim();
    
    // added "Input" to the end of variable names

    if (artistInput === "") {
      vex.dialog.alert("Please enter artist name");
    } else if (startDateInput === "" && endDateInput !== "" || startDateInput !== "" && endDateInput === "") {
      vex.dialog.alert("Please enter either both start and end dates or leave both blank");
    } else {
      queryURLArtist = queryURLTemplate + artistInput + "?app_id=" + localStorage.getItem("keyBands");
      if (startDateInput === "" && endDateInput === "") {
        queryURLEvents = queryURLTemplate + artistInput + "/events?app_id=" + localStorage.getItem("keyBands");
      } else if (startDateInput !== "" && endDateInput !== "") {
        queryURLEvents = queryURLTemplate + artistInput + "/events?date=" + moment(startDateInput).format("YYYY-MM-DD") + "," + moment(endDateInput).format("YYYY-MM-DD") + "&app_id=" + localStorage.getItem("keyBands");
      }

      eventIndex = 0;
      $("events-holder").empty();
      searchBandana();
      // $("#artist-input").val("");
      // $("#location-input").val("");
      // $("#start-date-input").val("");
      // $("#end-date-input").val("");
    };
}

$("#search-btn").on("click", function() {
    validation();
  });

  // Enter key triggers a key when using the search form
  $("form").on("keyup", function(key){
    if (key.keyCode === 13) {
      validation();
    };
  });

  database.ref().limitToLast(5).on("child_added", function(generateRecentSearchCards) {  
    var sv = generateRecentSearchCards.val();
      artistName = sv.artistName;
      artistImage = sv.artistImage;
      function doTheThing(){
      // add recent seach div with "recent-search"
      var cardDiv = $("<div class='card' style='width: 10rem; float:left;'>");
      var cardImg = $("<img class='card-img-top'>").attr("src", artistImage);
      var cardBody = $("<div class='card-body d-flex justify-content-between' style='padding: 0.5rem; width: 100%; position: absolute; bottom: 0;'>");
      var cardName = $("<h6 class='card-title' style='margin: 0; font-weight: bold; background-color: rgba(255, 208, 0, 0.5); color: black; padding: 0.5rem 1rem; border-radius: 10px;'>").text(artistName);
      // Append the new artist content
      cardBody.append(cardName);
      cardDiv.append(cardImg, cardBody);
        $("#recent-search").append(cardDiv);
      };

  doTheThing();
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
}); 

// Arrow appears to scroll back to search
function scrollToSearch() {
  if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
      $("#go-up").css("display", "flex");
      $("#five-more").css("display", "flex");
  } else {
      $("#go-up").css("display", "none");
      $("#five-more").css("display", "none");
  };
};

window.onscroll = function() {
  scrollToSearch();
};

// When 'Settings' option in the nav bar is clicked, it'll prompt for the user's API keys and save them in local storage
function enterAPIKeys() {
  debugger;
  // Need to save to local storage
  vex.dialog.prompt({
    message: 'Google Maps API key (map and directions)',
    placeholder: 'Enter your key here',
    callback: function (value) {
      localStorage.setItem("keyMaps", value);
  }
  });

  vex.dialog.prompt({
    message: 'Bands in Town API key (artist and events information)',
    placeholder: 'Enter your key here',
    callback: function (value) {
      localStorage.setItem("keyBands", value);
  }
  });

  vex.dialog.prompt({
    message: 'Firebase API key (recent searches)',
    placeholder: 'Enter your key here',
    callback: function (value) {
      localStorage.setItem("keyFirebase", value);
  }
  });
  
};