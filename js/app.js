;(function(){

	// change navbar color to be less transparent when scrolling down
	$(window).scroll(function() { 
		// check if scroll event happened

		if ($(document).scrollTop()> 50) {
			$('.navbar-wrapper nav').removeClass('navbar-default').addClass('navbar-inverse');

		} else {
			$('.navbar-wrapper nav').removeClass('navbar-inverse').addClass('navbar-default');
		}

		
	});

}());