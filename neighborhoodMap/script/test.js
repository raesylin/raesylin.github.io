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

	var todayInSec = Date.now();
	var end = new Date(todayInSec);
	var start = new Date(todayInSec - range * 24 * 3600 * 1000);

	var dateRange = {
		startDate: (start.getMonth()+1).toString() + '/' + start.getDate().toString() + '/' + start.getFullYear().toString(),
		endDate: (end.getMonth()+1).toString() + '/' + end.getDate().toString() + '/' + end.getFullYear().toString()
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

	var $info = $('#info');
	
	self.address = ko.observable();
	self.dateDelta = ko.observable('7');

	var initializeMap = function(setting) {
		var mapOptions = new setOpt(setting.zoom, setting.latlng);
		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		self.coordinate = setting.latlng;
	};

	// Operations:

	// -- Initialize map
	initializeMap(initialSetting);

	// -- Center map to new address
	this.newHome = function() {
		console.log(self.heatmap);
		var geocoder = new google.maps.Geocoder();
		// var $address = $(form).children('#address').val();

		geocoder.geocode({'address': self.address()}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				self.coordinate = results[0].geometry.location;
				self.map.setCenter(self.coordinate);
				self.map.setOptions({zoom: 14});
				self.homeMarker = new google.maps.Marker({
					map: self.map,
					position: self.coordinate,
					title: "Your new home",
				});
				if (self.heatmap) {
					console.log('resetting heatmap...');
					console.log(self.heatmap);
					self.heatmap.setMap(null);
				};
				// self.testCrimeMap(self.coordinate);
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			};
		});

	};

	// 
	// Crime map
	// 

	this.testCrimeMap = function(coordinate) {
		var range_int = parseInt(self.dateDelta());
		var dateRange = getDateRange(range_int);
		this.startDate = dateRange.startDate;
		this.endDate = dateRange.endDate;
		
		$.ajax({
			url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate='+this.endDate+'&lat='+coordinate.lat()+'&long='+coordinate.lng()+'&startdate='+this.startDate,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				console.log(data.length);
				if (data.length != 0) {
					var crimeData = processCrimeLoc(data);
					var pointArray = new google.maps.MVCArray(crimeData);
					if (self.heatmap) {
						self.heatmap.setData(pointArray);
					} else {
						self.heatmap = new google.maps.visualization.HeatmapLayer({
	    					data: pointArray
						});
					} ;
					// self.heatmap.setMap(self.map);
				} else {
					$info.css('display', 'block');
				};
			},
			error: function(err) { alert(err) ;},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "KqEmEEqnUomsh36Fd17Aei0l9fGqp1BTzhCjsnMPd4iZC218H6");
			}
		});
	};

	this.showCrimeMap = function(coordinate) {
		$.ajax({
			url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate='+this.endDate+'&lat='+coordinate.lat()+'&long='+coordinate.lng()+'&startdate='+this.startDate,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				if (data.length != 0) {
					var crimeData = processCrimeLoc(data);
					var pointArray = new google.maps.MVCArray(crimeData);
					self.heatmap = new google.maps.visualization.HeatmapLayer({
	    				data: pointArray
					});
					// self.heatmap.setMap(self.map);
				} else {
					$info.css('display', 'block');
				};
			},
			error: function(err) { alert(err) ;},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "KqEmEEqnUomsh36Fd17Aei0l9fGqp1BTzhCjsnMPd4iZC218H6");
			}
		});
	};

	this.toggleCrimeMap = function() {
		if (self.heatmap) {
			self.heatmap.setMap(self.heatmap.getMap() ? null : self.map)
		} else {
			self.testCrimeMap(self.coordinate);
		};

	};

	// Get new center after moving map and request new crime data
	// google.maps.event.addListener(self.map, 'center_changed', function() {

	// 	// self.showCrimeMap(self.map.getCenter);
	// });

};

$(document).ready(function() {
	ko.applyBindings(new mapViewModel);
});
