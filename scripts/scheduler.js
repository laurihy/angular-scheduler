var scripts = document.getElementsByTagName('script');
var currentScriptPath = scripts[scripts.length - 1].src;
var templatePath = '';
if (currentScriptPath.indexOf('lib') !== -1) {
    templatePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/lib') + 1) + '/templates/';
}
else {
    templatePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/scripts') + 1) + '/templates/';
}
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

.filter('intToSlot', [function () {

    return function (input, slotsize) {

        function pad(n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }
        var from = input;
        var to = from + slotsize;
        var merideanfrom = from >= 720 ? 'PM' : 'AM';
        var merideanto = to >= 720 ? 'PM' : 'AM';

        var hoursfrom = Math.floor(from / 60);
        hoursfrom = hoursfrom > 12 ? hoursfrom - 12 : hoursfrom;
        //var minutesfrom = from % 60;

        var hoursto = Math.floor(to / 60);
        hoursto = hoursto > 12 ? hoursto - 12 : hoursto;
        // var minutesto = to % 60;

        return pad(hoursfrom, 2) + ' ' + merideanfrom + pad(hoursto, 2) + ' ' + merideanto;
    };
}])



.directive('scheduler', [function () {
    return {
        templateUrl: templatePath + 'scheduler.html',
        restrict: 'E',
        scope: {
            slots: '=',
        },
        link: function (scope) {
            scope.labels = [
                 'Sunday',
                 'Monday',
                 'Tuesday',
                 'Wednesday',
                 'Thursday',
                 'Friday',
                 'Saturday'
            ];
        }
    };
}]);