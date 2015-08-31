(function() {
	var app = angular.module('app', []);

	app.directive('aboutTab', function() {
		return {
			restrict: 'E',
			templateUrl: 'about.html',
			controller: 'HoverController',
			controllerAs: 'hoverCtrl'
		};
	});

	app.controller('HoverController', function() {
		this.over = 0;

		this.setOver = function(item) {
			this.over = item;
		};

		this.showInfo = function(checkItem) {
			return this.over === checkItem;
		};

		this.showTooltip = function(hoveredItem) {
			var index = hoveredItem - 1;

			var tooltipspan, x, y;

			tooltipspan = document.getElementsByClassName('nav-description');

			tooltipspan[0].style.top = -68 + 'px';
			tooltipspan[0].style.left = -150 + 'px';

			tooltipspan[1].style.top = -140 + 'px';
			tooltipspan[1].style.left = 0 + 'px';

			tooltipspan[2].style.top = -68 + 'px';
			tooltipspan[2].style.left = 150 + 'px';

			return this.over === hoveredItem;
		};
	});

	app.directive('resumeTab', function() {
		return {
			restrict: 'E',
			templateUrl: 'resume.html',
			controller: 'ResumeController',
			controllerAs: 'resume'
		};
	});

	app.controller('ResumeController', function(){
		this.show = [false, false, false, false, false];

		this.toggleSection = function(tab) {
			this.show[tab] = !this.show[tab];
		};
	});

	app.directive('portfolioTab', function() {
		return {
			restrict: 'E',
			templateUrl: 'portfolio.html'
		};
	});

	app.directive('contactTab', function() {
		return {
			restrict: 'E',
			templateUrl: 'contact.html'
		};
	});

	app.controller('TabController', function() {
		this.tab = 'about';

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};

		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};

	});
})();


// $(document).ready(function() {
// 	// circle hover
// 	$('.middle-circle.section-selector').hover(function() {
// 		$(this).toggleClass('section-hover');
// 	});
// });