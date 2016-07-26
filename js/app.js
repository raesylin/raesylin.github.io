;(function(){

	// change navbar color to be less transparent when scrolling down
	$(window).scroll(function() { 
		// check if scroll event happened

		if ($(document).scrollTop() > 50) { 
			// check if scroll more than 50px from top of the browser window
			$(".navbar-default").css({
				background: 'rgba(255,255,255,0.9)'
			});
		} else {
			$(".navbar-default").css({
				background: 'rgba(255,255,255,0.15)'
			})
		}
		
	});

}());