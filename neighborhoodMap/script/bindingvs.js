$(document).ready(function() {
	ko.applyBindings(viewModel);
});

ko.bindingHandlers.map = {
	init: function(element, valueAccessor) {
		mapObj = ko.utils.unwrapObservable(valueAccessor());
		var latLng = new google.maps.LatLng(
			ko.utils.unwrapObservable(mapObj.lat),
			ko.utils.unwrapObservable(mapObj.lng));
		var mapOptions = { 
			center: latLng,
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		mapObj.googleMap = new google.maps.Map(element, mapOptions);

		mapObj.marker = new google.maps.Marker({
			map: mapObj.googleMap,
			position: latLng,
			title: "Desired Home",
			draggable: true
		});

		mapObj.onChangedCoord = function(newValue) {
			var latLng = new google.maps.LatLng(
				ko.utils.unwrapObservable(mapObj.lat),
				ko.utils.unwrapObservable(mapObj.lng));
			mapObj.googleMap.setCenter(latLng);
		};

		mapObj.onMarkerMoved = function(dragEnd) {
			var latLng = mapObj.marker.getPosition();
			mapObj.lat(latLng.lat());
			mapObj.lng(latLng.lng());
		};

		mapObj.lat.subscribe(mapObj.onChangedCoord);
		mapObj.lng.subscribe(mapObj.onChangedCoord);

		google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);

		$("#" + element.getAttribute("id")).data("mapObj",mapObj);
	},
};

function MyViewModel() {
	var self = this;
	self.mapOne = ko.observable({
		lat: ko.observable(32.857738),
		lng: ko.observable(-117.21151)
	});

	self.codeAddress = function() {
		var geocoder = new google.maps.Geocoder();
		var $address = $('#address').val();
		geocoder.geocode({'address': $address}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				mapObj.googleMap.setCenter(result[0].geometry.location);
				mapObj.googleMap.setOptions({zoom: 15});
				var marker = new google.maps.Marker({
					map: mapObj.googleMap,
					position: results[0].geometry.location
				});
			} else {
				alert('Geocode was not successful for the following reason: ' + stauts);
			};
		});
	};
}


var viewModel = new MyViewModel();
