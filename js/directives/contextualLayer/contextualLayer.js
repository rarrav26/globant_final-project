angular.module("contextualLayerModule", ["getTimeModule"])
	.controller("contextualLayerController", ['$scope', 'getTimeService', function($scope, getTimeService){
		$scope.getTimeDifferenceString = function(date){
			return getTimeService.getTimeDifferenceString(date);
		};
	}])

	.directive("contextualLayer", function($interval){
		return {
			restrict: "E", //E: directive works as element
			templateUrl: "./js/directives/contextualLayer/contextualLayer.html",
			scope: {
				date: "@date"
			},
			link: function(scope, element, attrs){
				var refresh = $interval(function(){
					//executes $digest() and updates displayed values
				}, 1000);

				element.on('$destroy', function(){
					$interval.cancel(refresh);
				});
			}
		};
	});