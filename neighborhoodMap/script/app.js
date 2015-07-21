function initialize() {
	var mapOptions = {
		zoom: 8,
		center : new google.maps.LatLng(32.857738, -117.21151),
		panControl: false,
		zoomControl: true,
		mapTypecontrol: true,
		scaleControl: true,
		streetViewControl: true,
		overviewMapControl: false,
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + 
		'&signed_in=true&callback=initialize';
	document.body.appendChild(script);
}

window.onload = loadScript;