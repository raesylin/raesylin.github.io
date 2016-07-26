;(function(){

	// change navbar color to be less transparent when scrolling down
	$(window).scroll(function() { 
		// check if scroll event happened

		if ($(document).scrollTop()> 50) { 
		// if scrolled more than 50 px from the top of browser window
			$('.navbar-wrapper nav').removeClass('navbar-default').addClass('navbar-inverse');

		} else { 
			// if back to the top of the page, restore original class
			$('.navbar-wrapper nav').removeClass('navbar-inverse').addClass('navbar-default');
		}

		
	});

}());