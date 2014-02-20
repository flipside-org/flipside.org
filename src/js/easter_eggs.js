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