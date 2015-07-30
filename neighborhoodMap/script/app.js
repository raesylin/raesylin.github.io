var setOptions = function(zoom, latlng) {
	var mapOptions = {
		zoom: zoom,
		center : latlng,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		mapTypeControl: true,
		maptypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
		scaleControl: true,
		streetViewControl: true,
		streetViewControlOptions: {
			style: google.maps.MapTypeControlStyle.DEFAULT,
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		overviewMapControl: false,
	};
	return mapOptions;
};

var stylesArray = [
	{
		featureType: 'all',
		stylers: [
			{saturation: -50},
			{hue: "#20FFFF"},
		]
	},{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [
			{lightness: 100},
			{visibility: "simplified"}
		]
	},{
		featureType: 'poi.business',
		elementType: 'labels',
		stylers: [
			{visibility: "simplified"}
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
	self.nav = ko.observable(true);

	var initializeMap = function() {

		var locSuccss = function(position) {
			var localLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			setMap(8, localLatLng);
			console.log('Positioning successfully, current coordinate: ', localLatLng);
		};

		var locError = function(error) {
			var localLatLng = new google.maps.LatLng(39.8282, -98.5795);
			setMap(5, localLatLng);
			console.log('Error getting position: ', error, ', using default location');
		};

		var setMap = function(zoom, localLatLng) {
			var myMapOptions = new setOptions(zoom, localLatLng);
			self.map = new google.maps.Map(document.getElementById('map-canvas'), myMapOptions);
			self.map.setOptions({styles: stylesArray});			
			self.coordinate(localLatLng);
			self.heatmap = new google.maps.visualization.HeatmapLayer();

			google.maps.event.addListener(self.map, 'dragend', function() {
				self.coordinate(self.map.getCenter());
				self.setCrimeMap();
			});
		};

		navigator.geolocation.getCurrentPosition(locSuccss, locError);

	};

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
				self.toggleNav();
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			};
		});

	};

	this.toggleNav = function() {
		self.nav(!self.nav());
	};

	this.toggleCrimeMap = function() {
		self.heatmap.setMap(self.heatmap.getMap() ? null : self.map);
		// self.map.setOptions(self.heatmap.getMap() ? {styles: stylesArray} : {styles: []});
	};

	this.setCrimeMap = function() {
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

	initializeMap();

	// Get new center after moving map and request new crime data


};

$(document).ready(function() {
	ko.applyBindings(new mapViewModel);
});
