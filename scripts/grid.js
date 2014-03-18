angular.module('grid', [])
.directive('grid', ['$document', function($document) {
    return {
        scope: {
            min: '=',
            max: '=',
            tick: '='
        },
        restrict: 'E',
        templateUrl: 'templates/grid.html',
        link: function(scope, element, attr) {
            scope.range = function(n) {
                return new Array(n);
            };
            scope.tickcount = (scope.max - scope.min) / scope.tick;
            scope.ticksize = 100 / scope.tickcount;
        }
    }
}]);