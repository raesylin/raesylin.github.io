(function(){
	var app = angular.module('num-select', []);

	app.directive('numPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'num-panel.html',
			controller: 'NumController',
			controllerAs: 'num'
		};
	});

	app.controller('NumController', function() {
		var num = this;

		this.getRandom = function() {
			start = parseInt(num.start);
			end = parseInt(num.end);
			num.randomNum = Math.floor(Math.random() * (end + 1 - start) + start);
		};

		this.isNumDefined = function() {
			return angular.isDefined(num.randomNum);
		};

		this.unDefineNum = function() {
			num.randomNum = undefined;
		};
	});

})();