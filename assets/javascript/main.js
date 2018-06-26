$(document).ready(function(){
    $('.sidenav').sidenav();
    
  });
  var video = $("#myVideo");
  var btn =$("#myBtn");
  
  function myFunction() {
    if (video.paused) {
      $("video").play();
      $("#myBtn").html("Pause");
    } else {
      $("video").pause();
      $("#myBtn").html("Play");
    }
  }