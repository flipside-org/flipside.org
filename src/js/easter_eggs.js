$(document).ready(function() {
  // Easter eggs.
  var listener = new window.keypress.Listener();
  
  // Konami code
  listener.sequence_combo("up up down down left right left right b a", function() {
    window.location = 'http://edispilf.org';
  });
  
  listener.sequence_combo("f l i p s i d e", function() {
    alert('Hello! :)');
  });
  
});
