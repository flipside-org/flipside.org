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
      
      $next_link.click(function(e) {
        e.preventDefault();
        var $self = $(this);
        
        if ($self.hasClass('inactive')) {
          return;
        }
        
        var $next_post = $('article.next-post');
        animate_post_transition($current_post, $next_post, 'left', $self.attr('href'));
        
      });
      
      $prev_link.click(function(e) {
        e.preventDefault();
        var $self = $(this);
        
        if ($self.hasClass('inactive')) {
          return;
        }
        
        var $prev_post = $('article.previous-post');
        animate_post_transition($current_post, $prev_post, 'right', $self.attr('href'));
        
      });
      
    });
  }
  
  function _load_post(type) {
    var post_url = $notes_nav.find('.' + type).attr('href');
    if (post_url == '#') { return; }
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
  
  function animate_post_transition($current_post, $sliding_post, direction, location) {
    var options = {
      banner_speed : 250,
      sliding_speed : 750
    };
      var animation_properties = {};
    
      var $current_banner = $current_post.find('.banner');
      var $sliding_banner = $sliding_post.find('.banner');
    
      var current_banner_height = $current_banner.outerHeight();
      var sliding_banner_height = $sliding_banner.outerHeight();
      
      var animate_sliding_post_article_size = function(){
        // If the sliding article is smaller then the current one
        // We need to animate the size before changing page,
        if ($sliding_post.height() < $current_post.height()) {
          $current_post.css('position', 'absolute');
          
          var original_height = $sliding_post.outerHeight();
          $('#site-body').height($current_post.outerHeight());
          
          $('#site-body').animate({
            // 62 is the nav menu height
            height : original_height + 62
          }, options.banner_speed, function() {
            window.location = location;
          });
        }
        else {
          window.location = location;
        }
      };
      
      var slide_post = function(direction, after_callback) {
        // Properties can not be dynamically set on JSON objects.
        animation_properties = {};
        animation_properties[direction] = '0%';
        $sliding_post.animate(animation_properties, options.sliding_speed, function(){
          after_callback();
        });
        
        // Properties can not be dynamically set on JSON objects.
        animation_properties = {};
        animation_properties[direction] = '-100%';
        $current_post.animate(animation_properties, options.sliding_speed);
      };
      
      var animation = function() {
        if (current_banner_height < sliding_banner_height) {
          // First animate the banner and then the post body.
          $current_banner.animate({
            height: sliding_banner_height
          }, options.banner_speed, function(){
            slide_post(direction, animate_sliding_post_article_size);
          });
        }
        else if (sliding_banner_height < current_banner_height) {
          // The magic number is used to calculate the height of the post banner..
          // It comes from the sum of the paddings applied to the banner.
          // Only needed when setting the value directly, not when animating.
          var magic_number = 432;
          // Off stage. Doesn't need animation
          $sliding_banner.height(current_banner_height - magic_number);
          
          slide_post(direction, function() {
            // Revert banner size to normal.
            $sliding_banner.animate({
              height: sliding_banner_height
            }, options.banner_speed, function(){
              animate_sliding_post_article_size();
            });
          });
        }
        else {
          // Banner size are equal.
          slide_post(direction, animate_sliding_post_article_size);
        }
     };
     
      // Animate article size.
      if ($current_post.height() < $sliding_post.height()) {
        $current_post.animate({
          height : $sliding_post.outerHeight()
        }, options.banner_speed, function() {
          animation();
        });
      }
      else {
        animation();
      }
      
  }

});
