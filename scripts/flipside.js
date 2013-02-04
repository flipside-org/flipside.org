/* The contact fly-out */

$(document).ready(function(){

    $(".contact-info").hide();
    $(".show_hide").show();
	 
    $('.show_hide').click(function(){
        $(".contact-info").slideToggle("medium");
        return false;
    });

});

hljs.initHighlightingOnLoad();
