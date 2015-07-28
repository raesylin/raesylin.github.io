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

var getDateRange = function(range) {
	var today_in_sec = new Date(Date.now());
	var endday_in_sec = new Date(today_in_sec - range * 24 * 3600);

	var dateRange = {
		startDate: (today_in_sec.getMonth()+1).toString() + '/' + (today_in_sec.getDate()-range).toString() + '/' + today_in_sec.getFullYear().toString(),
		endDate: (endday_in_sec.getMonth()+1).toString() + '/' + endday_in_sec.getDate().toString() + '/' + endday_in_sec.getFullYear().toString()
	};
	return dateRange;
};

var processCrimeLoc = function(data) {
	var crimeData = [];
	for (var i = 0; i < data.length; i++) {
		crimeData.push(new google.maps.LatLng(data[i].lat, data[i].long));
	};
	return crimeData;
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
		var $range = $(form).children('#dateRange').val();

		var dateRange = getDateRange($range);
		this.startDate = dateRange.startDate;
		this.endDate = dateRange.endDate;

		geocoder.geocode({'address': $address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				self.coordinate = new myLatLng(results[0].geometry.location);
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

	this.callCrime = function(latlng) {
		$.ajax({
			url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate='+this.endDate+'&lat='+latlng.lat+'&long='+latlng.lng+'&startdate='+this.startDate,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				var crimeData = processCrimeLoc(data);
				var pointArray = new google.maps.MVCArray(crimeData);
				self.heatmap = new google.maps.visualization.HeatmapLayer({
    				data: pointArray
				});
				self.heatmap.setMap(self.map);
			},
			error: function(err) { alert(err) ;},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "a5axdWoV2Xmshmoa205omjGF3NZop14QCAsjsnQN5GoFAOSzBl");
			}
		});

	};

};

$(document).ready(function() {
	ko.applyBindings(new mapViewModel);
});
