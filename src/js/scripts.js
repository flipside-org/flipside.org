$(document).ready(function() {
  
  var $notes_nav = $(".notes-navigation");
  
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
      console.log("Filtering: " + hash);
      
      // Let's use the url for comparison, but remove
      // the index.html if it exists.
      var location = window.location.pathname.replace("index.html", "");
      // Search the current page and extract the previous and next.
      for (var i = 0; i < data[hash].length; i++) {        
        if (data[hash][i].url == location) {
          console.log("Found it. Index: " + i);
          nav.prev = i - 1 < 0 ? false : data[hash][i - 1];
          nav.next = i + 1 > data[hash].length - 1 ? false : data[hash][i + 1];
        }
      }
      
      // Everything is ready. Create the prev and next links.
      var $prev_link = $notes_nav.find('.previous');
      if (nav.prev) {
        $prev_link.attr('href', nav.prev.url + nav.append_hash);
      }
      else {
        $prev_link.addClass('inactive');
      }
      
      var $next_link = $notes_nav.find('.next');
      if (nav.next) {
        $next_link.attr('href', nav.next.url + nav.append_hash); 
      }
      else {
        $next_link.addClass('inactive');
      }      
    
    
      // Now that the navigation is all ready prepare the content.
      // The next and previous posts need to be dynamically loaded
      // because we could be filtering.
      _load_post('next');
      _load_post('previous');      
      
      var $current_post = $('#site-body > article:first-child');
      var $prev_post = $('article.prev-post');
      
      $next_link.click(function(e) {
        e.preventDefault();
        var $self = $(this);
        
        if ($self.hasClass('inactive')) {
          return;
        }
        
        var $next_post = $('article.next-post');
        var $current_banner = $current_post.find('.banner');
        var $next_banner = $next_post.find('.banner');
        
        var current_banner_height = $current_banner.outerHeight();
        var next_banner_height = $next_banner.outerHeight();
        
        if (current_banner_height < next_banner_height) {
          
          $current_banner.animate({
            height: next_banner_height
          }, 250, function(){
            
            $next_post.animate({
              left : '0%'
            }, 750, function(){
              window.location = $self.attr('href');
            });
            
            $current_post.animate({
              left : '-100%'
            }, 750);
            
          });
        }
        else if (next_banner_height < current_banner_height) {
          // The magic number is used to calculate the height of the post banner..
          // It comes from the sum of the paddings applied to the banner.
          // Only needed when setting the value directly, not when animating.
          var magic_number = 432;
          // Off stage. Doesn't need animation
          $next_post.find('.banner').height(current_banner_height - magic_number);
            
          $next_post.animate({
            left : '0%'
          }, 750, function(){
            
            $next_banner.animate({
              height: next_banner_height
            }, 250, function(){
              window.location = $self.attr('href');
            });
          });
          
          $current_post.animate({
            left : '-100%'
          }, 750);
          
        }
        else {
          $next_post.animate({
            left : '0%'
          }, 750, function(){
            window.location = $self.attr('href');
          });
          
          $current_post.animate({
            left : '-100%'
          }, 750);
        }
      });
      
    });
  }
  
  function _load_post(type) {
    console.log($notes_nav);
    var post_url = $notes_nav.find('.' + type).attr('href');
    console.log('Ajaxing ' + type + ': ' + post_url);
    
    $.ajax({
      url: post_url
    }).done(function(post_data){
      // The posts need position absolute and a top distance equals to
      // the header height.
      var header_height = $('#site-hdr').height();
      
      // Prepare post.
      var $temp = $('<div>').html(post_data);
      var $post_article = $temp.find('#site-body > article');
      $post_article.addClass(type + '-post')
        .css('top', header_height);
        
      // Add to body.
      $('#site-body').append($post_article);
    });
  }

});
