// var myLat;
// var myLng;

// navigator.geolocation.getCurrentPosition(function(position) {
// 	myLat = position.coords.latitude;
// 	myLng = position.coords.longitude;
// 	console.log('success');
// });

var latlng = new google.maps.LatLng(32.85738, -117.21151);

var mapOptions = {
		zoom: 8,
		center : latlng,
		panControl: false,
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: true,
		overviewMapControl: false,
};

var stylesArray = [
	{
		featureType: 'all',
		stylers: [
			{saturation: -80}
		]
	},{
		featureType: 'road.arterial',
		elementType: 'geometry',
		stylers: [
			{hue: "#00ffee"},
			{saturation: 50}
		]
	},{
		featureType: 'poi.business',
		elementType: 'labels',
		stylers: [
			{visibility: "off"}
		]
	}
];

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

	self.showInfo = ko.observable(false);
	self.togglePane = ko.observable(false);

	self.address = ko.observable();
	self.dateDelta = ko.observable('7');
	self.dateDelta.subscribe(function() {
		self.setCrimeMap();
	});

	self.crimeMapButton = ko.observable(false);
	self.coordinate = ko.observable();

	var initializeMap = function() {
		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		self.coordinate(latlng);
		self.heatmap = new google.maps.visualization.HeatmapLayer();
	};

	// Operations:
	// -- Initialize map

	// initializeMap(initialSetting);
	initializeMap();

	// -- Center map to new address

	this.newHome = function() {
		self.showInfo(false);
		self.crimeMapButton(false);
		self.heatmap.setMap(null);

		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({'address': self.address()}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				self.coordinate(results[0].geometry.location);
				self.map.setCenter(self.coordinate());
				self.map.setOptions({zoom: 14});
				self.homeMarker = new google.maps.Marker({
					map: self.map,
					position: self.coordinate(),
					title: "Your new home",
				});
				if (self.heatmap) {
					self.heatmap.setMap(null);
				};
				self.togglePane(true);
				self.setCrimeMap();
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			};
		});

	};

	this.toggleCrimeMap = function() {
		self.heatmap.setMap(self.heatmap.getMap() ? null : self.map);
		self.map.setOptions(self.heatmap.getMap() ? {styles: stylesArray} : {styles: []});
	};

	this.setCrimeMap = function() {
		// self.togglePane(true);
		var range_int = parseInt(self.dateDelta());
		var dateRange = getDateRange(range_int);
		this.startDate = dateRange.startDate;
		this.endDate = dateRange.endDate;
		
		$.ajax({
			url: 'https://jgentes-Crime-Data-v1.p.mashape.com/crime?enddate='+this.endDate+'&lat='+self.coordinate().lat()+'&long='+self.coordinate().lng()+'&startdate='+this.startDate,
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
					self.crimeMapButton(true);
					// self.heatmap.setMap(self.map);
				} else {
					self.showInfo(true);
				};
			},
			error: function(err) { alert(err) ;},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "KqEmEEqnUomsh36Fd17Aei0l9fGqp1BTzhCjsnMPd4iZC218H6");
			}
		});
	};

	// Get new center after moving map and request new crime data
	google.maps.event.addListener(self.map, 'dragend', function() {
		self.coordinate(self.map.getCenter());
		self.setCrimeMap();
	});

};

$(document).ready(function() {
	ko.applyBindings(new mapViewModel);
});
