$(document).ready(function() {
	$('.toggle').click(function(event) {
		event.stopPropagation();
		event.preventDefault();
		var $links = $('ul.links');
		if ($links.is(':hidden')) {
			$links.show();
		}
		else {
			$links.hide();
		}
	});
	$(document).click(function() {
		$('ul.links').hide();
	});
});