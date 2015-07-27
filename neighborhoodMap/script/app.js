function init() {
	var map;
	// var geocoder;
	initialize();
}

function initialize() {
	var mapOptions = {
		zoom: 8,
		center : new google.maps.LatLng(32.857738, -117.21151),
		panControl: false,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: true,
		streetViewControl: true,
		overviewMapControl: false,
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	// geocoder = new google.maps.Geocoder();
}

function codeAddress() {
	var geocoder = new google.maps.Geocoder();
	var $address = $('#address').val();
	geocoder.geocode({'address': $address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			map.setOptions({zoom: 15});
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		};
	});
}


// function loadScript() {
// 	var script = document.createElement('script');
// 	script.type = 'text/javascript';
// 	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + 
// 		'&signed_in=true&callback=init';
// 	document.body.appendChild(script);
// }

// window.onload = loadScript;

google.maps.event.addDomListener(window, 'load', initialize);

function crimeLog() {
	$.ajax({
	    url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate=6%2F25%2F2015&lat=32.715&long=-117.1625&startdate=6%2F19%2F2014',
	    type: 'GET', // The HTTP Method
	    data: {}, // Additional parameters here
	    datatype: 'json',
	    success: function(data) { 
	    	for (i in data) {
	    		console.log(data[i].description); 
	    	};
	    },
	    error: function(err) { alert(err); },
	    beforeSend: function(xhr) {
	    xhr.setRequestHeader("X-Mashape-Authorization", "KqEmEEqnUomsh36Fd17Aei0l9fGqp1BTzhCjsnMPd4iZC218H6"); // Enter here your Mashape key
    	}
	});
}

// window.onload = crimeLog;