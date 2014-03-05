$(document).ready(function() {
  $('.toggle').click(function(event) {
    event.stopPropagation();
    event.preventDefault();

    var $links_siblings = $(this).siblings('.links');

    $('.links').not($links_siblings).removeClass('visible');
    $links_siblings.toggleClass('visible');
  });

  $(document).click(function() {
    $('.links').removeClass('visible');
  });
});