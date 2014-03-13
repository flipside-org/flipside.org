// This #$%&=! needs to be window, can't be document. Everything needs to
// be loaded otherwise size will be @#$&%! up.
$(window).load(function() {
  var $slider_li = $('.flexslider .slides li');

  if ($slider_li.length > 1) {
    fix_slider_height();
    
    $( window ).resize(function() {
      fix_slider_height();
    });
    
    // Chrome has a weird behavior with the slider.
    // When the page loads the height is not correctly computed.
    // Wait 50ms and set again.
    // I've no idea why this happens. If somebody finds out please fix!
    setTimeout(function(){ fix_slider_height(); }, 50);
  }
  
  function fix_slider_height() {
    var max_height = 0;

    // Reset everything.
    $slider_li.css('min-height', '');
    $slider_li.find('.media').css('min-height', '');
    
    // Find out highest li 
    $slider_li.each(function() {
      if ( $(this).outerHeight() > max_height ) {
        max_height = $(this).outerHeight();
      }
    });

    $slider_li.css('min-height', max_height);
    
    // The div.media must be the same height as the li minus the padding
    // applied to the artilce.row (64px) an to the li itself (72px).
    $slider_li.find('.media').css('min-height', max_height - 64 - 72);
  }
});