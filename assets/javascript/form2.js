// Get the modal
function modal(){
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("search-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
}

// VIDEO VIDEO VIDEO
var video = document.getElementById("fullscreen-bg__video");

// Get the button
var btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
    if (video.paused) {
        video.play();
        btn.innerHTML = "Pause";
    } else {
        video.pause();
        btn.innerHTML = "Play";
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


// AJAX calls to the Bands in Town API
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
      
      // Else let the user know the artist name couldn't be found
      } else {
        alert("Sorry, not artist found")
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
        // console.log(events);
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
  var cardDiv = $("<div class='card' style='width: 18rem; position: relative'>");
  var cardImg = $("<img class='card-img-top'>").attr("src", artistImage);
  var cardBody = $("<div class='card-body d-flex justify-content-between' style='padding: 0.5rem; width: 100%; position: absolute; bottom: 0;'>");
  if (artistFB !== "") {
    var cardFB = $("<a href='"+ artistFB +"' target='_blank'><img src='fb_logo.png' style='width: 30px'></a>");
  } else {
    var cardFB = $("<div>");
  };
  var cardName = $("<h4 class='card-title' style='margin: 0; font-weight: bold; background-color: rgba(255, 208, 0, 0.5); color: black; padding: 0.5rem 1rem; border-radius: 10px;'>").text(artistName);
  // Append the new artist content
  cardBody.append(cardName, cardFB);
  cardDiv.append(cardImg, cardBody);
  $("#artist-holder").append(cardDiv);

  // *** EVENTS INFORMATION ***
  // Dynamically creating the cards
  $("#events-holder").empty();
  
  for (let i = 0; i < events[0].length; i++) {
    
    
    var eventDiv = $("<div class='card d-flex flex-nowrap'>");
    var eventColumn1 = $("<div class='col-lg-3'>");
    var eventColumn2 = $("<div class='col-lg-3'>");
    var eventDate = $("<p>" + moment(events[0][i].datetime).format("MMMM D YYYY, h:mm A") + "</p>");
    var eventLocation = $("<p>" + events[0][i].venue.city + " " + events[0][i].venue.region + " " + events[0][i].venue.country + "</p>");
    var eventVenue = $("<p>" + events[0][i].venue.name + "</p>");
    var eventURL = $("<a href='" + events[0][i].url + "' target='_blank'><p> Get tickets</p></a>");

    var eventMap = $("<img src='https://maps.googleapis.com/maps/api/staticmap?center=" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "&zoom=14&size=400x150&maptype=roadmap&markers=color:red%7Clabel:C%7C" + events[0][i].venue.latitude + "," + events[0][i].venue.longitude + "&key=AIzaSyDqItaMC7jRXipvTmfaH3bzfBiCxHNflr0'>");
    
    // Appending the maps to each venue
    


    eventColumn1.append(eventDate, eventLocation, eventVenue, eventURL);
    eventColumn2.append(eventMap);
    eventDiv.append(eventColumn1, eventColumn2);
    $("#events-holder").append(eventDiv);
  };

    
    

    events.length = 0;
    promiseEventsStatus = false;
    promiseArtistStatus = false;
};

$("#search-btn").on("click", function(event) {
    event.preventDefault();
    
    artistInput = $("#artist-input").val().trim();
    artistLetterArray = artistInput.split("");

    if (artistInput === "") {
      modal();
    } else {
      queryURLArtist = queryURLTemplate + artistInput + "?app_id=codingbootcamp";
      queryURLEvents = queryURLTemplate + artistInput + "/events?app_id=codingbootcamp"
      searchBandana();
    };

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
      
      
    locationInput = $("#location-input").val().trim();
    startDateInput = $("#start-date-input").val().trim();
    endDateInput = $("#end-date-input").val().trim();
    
    // added "Input" to the end of variable names

    
    
    $("#artist-input").val("");
    $("#location-input").val("");
    $("#start-date-input").val("");
    $("#end-date-input").val("");

  });