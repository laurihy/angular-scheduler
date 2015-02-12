angular.module('scheduler', ['multislider', 'grid'])

.filter('intToTime', [function(){

    return function(input){

        function pad(n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }

        var hours = Math.floor(input / 60);
        var minutes = input % 60;
        return pad(hours, 2)+':'+pad(minutes, 2);
    };
}])

.directive('scheduler', [function(){
    return {
        templateUrl: 'templates/scheduler.html',
        restrict: 'E',
        scope: {
            slots: '=',
        },
        link: function(scope){
            scope.labels = [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ];
        }
    };
}]);