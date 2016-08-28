angular.module('scheduler', ['multislider', 'grid'])

.filter('intToTime', [function () {

    return function (input) {

        function pad(n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }
        var meridean = input >= 720 ? 'PM' : 'AM';
        var hours = Math.floor(input / 60);
        hours = hours > 12 ? hours - 12 : hours;
        var minutes = input % 60;
        return pad(hours, 2) + ':' + pad(minutes, 2) + ' ' + meridean;
    };
}])


.directive('scheduler', [function () {
    return {
        templateUrl: 'templates/scheduler.html',
        restrict: 'E',
        scope: {
            slots: '=',
        },
        link: function (scope) {
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