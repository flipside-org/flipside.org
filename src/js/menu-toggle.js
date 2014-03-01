$(document).ready(function() {
	$('.toggle').click(function(event) {
		event.stopPropagation();
		event.preventDefault();

		$(this).siblings('ul.links').toggleClass('visible');
	});

	$(document).click(function() {
		$('ul.links').removeClass('visible');
	});
});