$.ajax({
	url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate=enddate=6%2F25%2F2015&lat=32.85&long=-117.21&startdate=6%2F19%2F2014',
	type: 'GET',
	dataType: 'json',
	success: function(data) { 
		console.log(); 
	},
	error: function(err) { alert(err) ;},
	beforeSend: function(xhr) {
		xhr.setRequestHeader("X-Mashape-Authorization", "a5axdWoV2Xmshmoa205omjGF3NZop14QCAsjsnQN5GoFAOSzBl");
	}
});
