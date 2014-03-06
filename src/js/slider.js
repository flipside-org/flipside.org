$(document).ready(function() {
  $('.flexslider').flexslider({
    animation: 'slide',
    // http://stackoverflow.com/questions/11471034/weird-flickering-background-with-multiple-flex-sliders-on-page
    // Css problem doesn't happen anymore because there's no loop.
    useCSS:true,
    animationLoop: false,
    //keyboard: false,
  });
});