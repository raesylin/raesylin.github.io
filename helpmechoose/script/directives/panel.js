(function() {
	var app = angular.module('from-preset', []);

	app.directive('presetPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'preset-panel.html',
			controller: 'PresetController',
			controllerAs: 'preset'
		};
	});

	app.controller('PresetController', ['$http', function($http) {

		var choice = this;
		choice.presets = [];		// prestored lists
		this.list = [];				// content of current list

		$http.get('/presetStorage.json').success(function(data) {
			choice.presets = data;	// fetching prestored lists
		}).error(function(err) {
			alert(err);
		});

		this.selectList = function(list) {
			this.list = list.listItem;
		};

	}]);
			
})();