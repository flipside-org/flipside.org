//$(document).foundation();

$(document).ready(function() {
  
  // Remove this eventually
  var $log = $('<div>');
  $.extend($log, {log : function(txt) {
    //$(this).append(txt + '<br/>');
    console.log(txt);
  }
  });
  $log.prependTo("body");
  // END / Remove this eventually
  
  
  var $notes_nav = $(".notes-nav-link");
  
  if ($notes_nav.length >= 1) {
    // We're on the notes page. Proceed.
    
    // Ajax power activate!
    $.ajax({
     url: "/json/notes_filter.json" 
    }).done(function(data) {
      // Let's build the navigation
      var nav = {
        // Will either be false or an object with data.
        prev : null,
        // Will either be false or an object with data.
        next : null,
        // Will store the hash to append.
        // We don't want to append #all so it will only be used when filtering.
        append_hash : ""
      };
      
      // Are we filtering by something?
      var hash = window.location.hash.replace("#", "");
      nav.append_hash = "#" + hash;
      if (hash === "" || data[hash] === null) {
        // Either the hash is not set or someone's been messin' with ma' hash.
        // Teach 'em a lesson and give 'em the default.
        hash = 'all';
        // Filtering by all. Clean the nav.append_hash so we don't
        // have a useless # in the url.
        nav.append_hash = "";
      }
      $log.log("Filtering: " + hash);
      
      // Let's use the url for comparison, but remove
      // the index.html if it exists.
      var location = window.location.pathname.replace("index.html", "");
      // Search the current page and extract the previous and next.
      for (var i = 0; i < data[hash].length; i++) {        
        if (data[hash][i].url == location) {
          $log.log("Found it. Index: " + i);
          nav.prev = i - 1 < 0 ? false : data[hash][i - 1];
          nav.next = i + 1 > data[hash].length - 1 ? false : data[hash][i + 1];
        }
      }
      
      // Everything is ready. Create the prev and next links.
      var $prev_link = $notes_nav.filter('.previous');
      if (nav.prev) {
        $prev_link.attr('href', nav.prev.url + nav.append_hash);
      }
      else {
        $prev_link.attr('class', 'inactive');
      }
      
      var $next_link = $notes_nav.filter('.next');
      if (nav.next) {
        $next_link.attr('href', nav.next.url + nav.append_hash);
      }
      else {
        $next_link.attr('class', 'inactive');
      }      
    });
  }
});

$(document).ready(function() {
  // Easter eggs.
  
  // Konami code
  keypress.sequence_combo("up up down down left right left right b a", function() {
    window.location = 'http://edispilf.org';
  }, false);
  
  keypress.sequence_combo("f l i p s i d e", function() {
    alert('Hello! :)');
  }, false);
  
});
