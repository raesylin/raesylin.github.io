(function(){
	var app = angular.module('app', ['num-select']);

	var getRandom = function(max) {
		return Math.floor(Math.random() * max);
	};

	app.directive('presetPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'preset-panel.html'
		};
	});

	app.directive('listContent', function() {
		return {
			restrict: 'E',
			templateUrl: 'list-content.html'
		};
	});

	app.directive('newPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'new-panel.html'
		};
	});

	app.controller('TabController', function() {
		this.tab = 1;

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};

		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});

	app.controller('ListController', ['$http', function($http) {
		var choice = this;
		choice.list = [];			// content of the current list
		choice.listIndex = -1;		// name of current list
		this.item = {};				// new item to add to current list
		choice.presets = [];		// content of presets


		$http.get('/helpmechoose/presetStorage.json').success(function(data) {
			choice.presets = data;	// fetching presets
			choice.presetsBackUp = JSON.parse(JSON.stringify(choice.presets));
		}).error(function(err) {
			alert(err);
		});

		this.clearStatus = function() {
			for (item in choice.list) {
				choice.list[item].chosen = false;
			};
		};

		this.selectList = function(list) {
			choice.clearList();
			var emptyList = {
				'listName': 'new',
				'listItem': []
			};

			var currentChoice = list || emptyList;

			if (currentChoice != emptyList) {
				var index = choice.presets.indexOf(currentChoice);
				choice.list = JSON.parse(JSON.stringify(choice.presets[index].listItem));
				choice.listIndex = index;
			} else {
				choice.list = [];
				choice.listIndex = -1;
			};
			
			choice.clearStatus();

		};

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
			choice.clearStatus();
			var max = choice.list.length;
			var chosenNum = getRandom(max);
			choice.list[chosenNum].chosen = true;
		};

		this.reloadList = function() {
			choice.selectList(choice.presets[choice.listIndex]);
		};
	}]);

})();