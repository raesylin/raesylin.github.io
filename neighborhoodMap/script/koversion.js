var initialSetting = {
	latlng: new google.maps.LatLng(32.857738, -117.21151),
	zoom: 8
};

var setOpt = function(zoom, latlng) {
	var mapOptions = {		
		zoom: zoom,
		center : latlng,
		panControl: false,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: true,
		streetViewControl: true,
		overviewMapControl: false,
	};
	return mapOptions;
};

var myLatLng = function(location) {
	this.lat = location.lat();
	this.lng = location.lng();
};


var mapViewModel = function() {
	var self = this;

	var initilizeMap = function(setting) {
		var mapOptions = new setOpt(setting.zoom, setting.latlng);
		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	};

	// Operations:

	// -- Initialize map
	initilizeMap(initialSetting);

	// -- Center map to new address
	this.newHome = function(form) {

		var geocoder = new google.maps.Geocoder();
		var $address = $(form).children('#address').val();
		geocoder.geocode({'address': $address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				self.coordinate = new myLatLng(results[0].geometry.location);
				console.log(self.coordinate);
				self.map.setCenter(results[0].geometry.location);
				self.map.setOptions({zoom: 15});
				self.homeMarker = new google.maps.Marker({
					map: self.map,
					position: results[0].geometry.location,
					title: "Your new home",
				});
				self.callCrime(self.coordinate);
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			};
		});

	};

	// 
	// Crime map
	// 
	var testLoc = {
		lat: 32.857738,
		lng: -117.2115
	};

	this.callCrime = function(latlng) {
		$.ajax({
			url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate=7%2F27%2F2015&lat='+latlng.lat+'&long='+latlng.lng+'&startdate=7%2F21%2F2015',
			type: 'GET',
			dataType: 'json',
			success: function(data) { 
				console.log(data.length); 
			},
			error: function(err) { alert(err) ;},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "a5axdWoV2Xmshmoa205omjGF3NZop14QCAsjsnQN5GoFAOSzBl");
			}
		});

	};

	// this.callCrime(self.coordinate);

};

$(document).ready(function() {
	ko.applyBindings(new mapViewModel);
});
