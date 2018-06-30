// Initialize Firebase
var config = {
    apiKey: "AIzaSyBNZEuVLMqW1ShLVcaqAl56qekPAMEorgg",
    authDomain: "bandana-30ebf.firebaseapp.com",
    databaseURL: "https://bandana-30ebf.firebaseio.com",
    projectId: "bandana-30ebf",
    storageBucket: "",
    messagingSenderId: "216379677416"
  };
  firebase.initializeApp(config);
  var dataRef = firebase.database();
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
  // var eventsDate = [];
  // var eventsVenue = [];
  // var eventsURL = [];
  // var eventsLat = [];
  // var eventsLng = [];
  // AJAX calls to the Bands in Town API
  // var count to return results from firebase
  var count = 0;
  function searchBandana() {
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
          dataRef.ref().push({
            artistName: artistName,
            artistImage: artistImage,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        
        // Else let the user know the artist name couldn't be found
        } else {
          alert("Sorry, not artist found")
        };
        // Only when both promises came back, generate the cards
        if (promiseArtistStatus === true && promiseEventsStatus === true) {
          // console.log("artist");
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
          // console.log(events);
        };
        // Only when both promises came back, generate the cards
        if (promiseArtistStatus === true && promiseEventsStatus === true) {
          console.log("events");
          generateCards();
        };
      });
    }
  function generateCards() {
    console.log("Running");
    // *** ARTIST INFORMATION ***
    // Dynamically creating the card
    $("#artist-holder").empty();
    var cardDiv = $('<div class="card" style="width: 18rem;">');
    var cardImg = $("<img class='card-img-top'>").attr("src", artistImage);
    var cardBody = $('<div class="card-body">');
    var cardName = $("<h5 class='card-title'>").text(artistName);
    var cardResultList = $('<ul class="list-group list-group-flush">');
    // Append the new artist content
    cardBody.append(cardName)
    cardDiv.append(cardImg, cardBody, cardResultList);
    $("#artist-holder").append(cardDiv);
    // *** EVENTS INFORMATION ***
    // Dynamically creating the cards
    $("#events-holder").empty();
    
    for (let i = 0; i < events[0].length; i++) {
      console.log(events[0][i].venue.name);
    }
    
    promiseEventsStatus = false;
    promiseArtistStatus = false;
  }
  $("#search-btn").on("click", function(event) {
      event.preventDefault();
      
      artistInput = $("#artist-input").val().trim();
      // for (let i = 0; i < artistInput.length; i++) {
      //   if (artistInput[i] === "/") {
      //     artistInput[i].splice(i, 1, "%252F");
      //     console.log("found it");
      //   } else {
      //     console.log("not here");
          
      //   }
      // }
      console.log(artistInput);
      
      
      locationInput = $("#location-input").val().trim();
      startDateInput = $("#start-date-input").val().trim();
      endDateInput = $("#end-date-input").val().trim();
      
      // added "Input" to the end of variable names
      if (artistInput === "") {
        alert("Please enter artist name");
      } else {
        queryURLArtist = queryURLTemplate + artistInput + "?app_id=codingbootcamp";
        queryURLEvents = queryURLTemplate + artistInput + "/events?app_id=codingbootcamp"
        searchBandana();
      }
      
      $("#artist-input").val("");
      $("#location-input").val("");
      $("#start-date-input").val("");
      $("#end-date-input").val("");
    });
    // var artist;
    // // picture variable from bandsintown
    // var picture;
    dataRef.ref().limitToLast(5).on("child_added", function(generateRecentSearchCards) {  
      var sv = generateRecentSearchCards.val();
      artistName = sv.artistName;
      artistImage = sv.artistImage;
      function doTheThing(){
      // add recent seach div with "recent-search"
        var newRecentSearchCard = $('<div class="card" style="width: 18rem;">');
        var newRecentSearchCB = $('<div class="card-body">');
        var artistImageCD = $("<img class='card-img-top'>").attr("src", artistImage);
        var artistNameCD = $("<h5 class='card-title'>").text(artistName);
        newRecentSearchCB.append(artistNameCD, artistImageCD);
        newRecentSearchCard.append(newRecentSearchCB);
        $("#recent-search").append(newRecentSearchCard);
        count ++;
      };
  // console.log(num.children) 
  doTheThing();
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }); 