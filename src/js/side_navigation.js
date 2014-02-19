$(document).ready(function() {
  
  /**
   * Navigation div.
   */
  var $post_nav;
  
  /**
   * Stores the status of the post loading.
   * When the user clicks the next/previous, if the post is not loaded
   * the animation will not happen and the link will work normally.
   */
  var load_status = {
    previous : false,
    next : false,
  };
  
  /**
   * Variable to control whether the animation is running.
   */
  var animating = false;
  
  if ($(".notes-navigation").length >= 1) {
    $post_nav = $(".notes-navigation");
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
      var $prev_link = $post_nav.find('.previous');
      if (nav.prev) {
        $prev_link.attr('href', nav.prev.url + nav.append_hash);
      }
      else {
        $prev_link.addClass('inactive');
      }
      
      var $next_link = $post_nav.find('.next');
      if (nav.next) {
        $next_link.attr('href', nav.next.url + nav.append_hash); 
      }
      else {
        $next_link.addClass('inactive');
      }      
    
    
      // Now that the navigation is all ready prepare the content.
      // The next and previous posts need to be dynamically loaded
      // because we could be filtering.
      _init($prev_link, $next_link);
    });
  }
  
  if ($(".project-navigation").length >= 1) {
    $post_nav = $(".project-navigation");
    // Project page.
    var $prev_link = $post_nav.find('.previous');
    var $next_link = $post_nav.find('.next');
    _init($prev_link, $next_link);
  }
  
  /**
   * Sets up the click listeners.
   * @param {Object} $prev_link
   * @param {Object} $next_link
   */
  function _init($prev_link, $next_link) {
    
    // The animation shouldn't run on mobile. Since the posts are not going
    // to load the link will behave as a normal one.
    // Use the font size technique.
    // 0px we are on mobile (small)
    // 1px we are over mobile (medium and up)
    if ($('#site-title img').css('font-size') != '0px') {
      _load_post('next');
      _load_post('previous');
    } 
    
    var $current_post = $('#site-body > article:first-child');
    
    $next_link.click(function(e) {
      var $self = $(this);      
      if ($self.hasClass('inactive')) {
        e.preventDefault();
        return;
      }
      // If the post is not loaded, work as normal link.
      if (!load_status.next) {
        return true;
      }
      
      e.preventDefault();
      var $next_post = $('article.next-post');
      _animate_post_transition($current_post, $next_post, 'left', $self.attr('href'));
      
    });
    
    $prev_link.click(function(e) {
      var $self = $(this);
      if ($self.hasClass('inactive')) {
        e.preventDefault();
        return;
      }
      // If the post is not loaded, work as normal link.
      if (!load_status.previous) {
        return true;
      }
      
      e.preventDefault();
      var $prev_post = $('article.previous-post');
      _animate_post_transition($current_post, $prev_post, 'right', $self.attr('href'));
      
    });
    
  } 
  
  /**
   * Loads a post and adds it to the body.
   * The link is fetched from the <a> in the navigation
   * @param string type
   *  The post to load (next|previous)
   */
  function _load_post(type) {
    var post_url = $post_nav.find('.' + type).attr('href');
    if (post_url == '#') { return; }
    console.log('Ajaxing ' + type + ': ' + post_url);
    
    $.ajax({
      url: post_url
    }).done(function(post_data){
      load_status[type] = true;
      // Prepare post.
      var $temp = $('<div>').html(post_data);
      var $post_article = $temp.find('#site-body > article');
      $post_article.addClass(type + '-post')
        .css('top', 0);
        
      // Add to body.
      $('#site-body').append($post_article);
    });
  }
  
  /**
   * Animate the post.
   */
  function _animate_post_transition($current_post, $sliding_post, direction, location) {
    if (animating) {
      return false;
    }
    else {
      animating = true;
    }
    
    var options = {
      banner_speed : 250,
      sliding_speed : 750
    };
  
    var $current_banner = $current_post.find('.banner');
    var $sliding_banner = $sliding_post.find('.banner');
  
    // NOTE:
    // We are using box-sizing: border-box so when setting the height
    // without animation, we need to use the actual height without
    // padding or borders.
    // However when animating, it's the css property that gets animated
    // and thanks to the box-sizing we need the outerHeight, that includes
    // borders and paddings.
    var current_banner_height = $current_banner.outerHeight();
    var sliding_banner_height = $sliding_banner.outerHeight();
    
    var sliding_body_height = $sliding_post.outerHeight();
    
    // Sizes of paddings and borders
    var site_body_extra = $('#site-body').outerHeight() - $('#site-body').height();
    
    async.auto({
      
      animate_banner : function(callback) {
        if (current_banner_height < sliding_banner_height) {
          console.log('animate_banner : current banner smaller');
          // Check NOTE.
          $current_banner.animate({
            height: sliding_banner_height
          }, options.banner_speed, function(){
            callback(null);
          });
        }
        else if (sliding_banner_height < current_banner_height) {
          console.log('animate_banner : sliding banner smaller');
          // Off stage. Doesn't need animation.
          // Check NOTE.
          $sliding_banner.height($current_banner.height());
          callback(null);
        }
        else {
          console.log('animate_banner : banner equal');
          // Banner size are equal.
          callback(null);
        }
      },
      
      animate_body : function(callback) {
        if ($current_post.height() < $sliding_post.height()) {
          console.log('animate_body : current body smaller');
            
          $('#site-body').height($current_post.height());          
          $('#site-body').animate({
            // Due to the box-sizing when animating the height we need to
            // include the padding.
            height : sliding_body_height + site_body_extra
          }, options.banner_speed, function() {
            callback(null);
          });
        }
        else {
          console.log('animate_body : sliding body equal or smaller');
          callback(null);
        }
      },
      
      slide : ['animate_banner', 'animate_body', function(callback) {
        // Properties can not be dynamically set on JSON objects.
        var animation_properties = {};
        animation_properties[direction] = '0%';
        $sliding_post.animate(animation_properties, options.sliding_speed, function(){
          callback(null);
        });
        
        // Properties can not be dynamically set on JSON objects.
        animation_properties = {};
        animation_properties[direction] = '-100%';
        $current_post.animate(animation_properties, options.sliding_speed);
      }],
      
      animate_banner_original : ['slide', function(callback) {
        // sliding_banner_height will hold the banner height measured before
        // all the animations started. So it's the original height.
        // Only animate back if it changed.
        if ($sliding_banner.height() != sliding_banner_height) {
          console.log('animate_banner_original : animating');          
          // Check NOTE.
          $sliding_banner.animate({
            height: sliding_banner_height
          }, options.banner_speed, function(){
            callback(null);
          });
        }
        else {
          console.log('animate_banner_original : same size');
          callback(null);
        }
      }],
      
      animate_body_original : ['slide', function(callback) {
        if ($sliding_post.height() < $current_post.height()) {
          $('#site-body').animate({
            // Due to the box-sizing when animating the height we need to
            // include the padding.
            height : sliding_body_height + site_body_extra
          }, options.banner_speed, function() {
            callback(null);
          });
        }
        else {
          callback(null);
        }
      }],
      
      change_url : ['animate_banner_original', 'animate_body_original', function() {
        console.log('change_url');
        window.location = location;
      }]
    });
    
  }
});