(function(){
	var app = angular.module('chooseapp', ['from-preset']);

	var getRandom = function(max) {
		return Math.floor(Math.random() * max);
	};

	app.directive('listContent', function() {
		return {
			restrict: 'E',
			templateUrl: 'list-content.html'
		};
	});

	app.directive('numPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'num-panel.html'
		};
	});

	app.directive('newPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'new-panel.html'
		};
	});

	app.controller('TabController', function() {
		this.tab = 2;

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};

		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});

	app.controller('NewListController', function() {
		var choice = this;
		choice.list = [];
		this.item = {};

		this.addItem = function() {
			this.item.chosen = false;
			choice.list.push(this.item);
			this.item = {};
		};

		this.removeItem = function(item) {
			var index = choice.list.indexOf(item);
			choice.list.splice(index, 1);     
		};

		this.clearList = function() {
			choice.list = [];
		};

		this.makeChoice = function() {
			for (item in choice.list) {
				choice.list[item].chosen = false;
				// console.log(choice.list[item]);
			};
			var max = choice.list.length;
			var chosenNum = getRandom(max);
			choice.list[chosenNum].chosen = true;
		};

	});

})();