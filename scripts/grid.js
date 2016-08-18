var scripts = document.getElementsByTagName('script');
var currentScriptPath = scripts[scripts.length - 1].src;
var templatePath = '';
if(currentScriptPath.indexOf('lib') !== -1){
  templatePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/lib') + 1) + '/templates/';
  }
 else{
  templatePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/scripts') + 1) + '/templates/';
  }
angular.module('grid', [])
.directive('grid', [function() {
    return {
        scope: {
            min: '=',
            max: '=',
            tick: '='
        },
        restrict: 'E',
        templateUrl: templatePath + 'grid.html',
        link: function(scope) {
            scope.range = function(n) {
                return new Array(n);
            };
            scope.tickcount = (scope.max - scope.min) / scope.tick;
            scope.ticksize = 100 / scope.tickcount;
        }
    };
}]);