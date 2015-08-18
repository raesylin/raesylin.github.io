(function)() {
	var app = angular.module('choose-from-list', []);

	app.directive('listPanel', ['$http', function($http) {
		return {
			restrict: 'E',
			templateUrl: 'list-panel.html',
			controller: function($http) {
				var choice = this;
				choice.lists = [];

				$http.get('/listStorage.json').success(function(data) {
					choice.lists = data;
					alert('success');
				}).error(function(err) {
					alert(err);
				});
			},
			controllerAs: 'list'
		};
	});
})();