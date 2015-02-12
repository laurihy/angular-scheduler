angular.module('grid', [])
.directive('grid', [function() {
    return {
        scope: {
            min: '=',
            max: '=',
            tick: '='
        },
        restrict: 'E',
        templateUrl: 'templates/grid.html',
        link: function(scope) {
            scope.range = function(n) {
                return new Array(n);
            };
            scope.tickcount = (scope.max - scope.min) / scope.tick;
            scope.ticksize = 100 / scope.tickcount;
        }
    };
}]);;angular.module('handle', [])
.directive('handle', ['$document', function($document){
    return {
        scope: {
            ondrag: '=',
            ondragstop: '=',
            ondragstart: '='
        },
        restrict: 'A',
        link: function(scope, element) {

            var x = 0;

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();

                x = event.pageX;

                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

                if(scope.ondragstart){
                    scope.ondragstart();
                }

            });

            function mousemove(event) {
                var delta = event.pageX - x;
                scope.ondrag(delta);
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);

                if(scope.ondragstop){
                    scope.ondragstop();
                }
            }
        }
    };
}]);;angular.module('multislider', ['slot'])

.filter('byDay', [function(){
    return function(input, day){
        var ret = [];
        angular.forEach(input, function(el){
            if(el.day === day){
                ret.push(el);
            }
        });
        return ret;
    };
}])

.directive('multiSlider', [function() {
    return {
        scope: {
            slots: '=',
            max: '=',
            min: '=',
            tick: '=',
            defaultValue: '=',
            day: '='
        },
        restrict: 'E',
        templateUrl: 'templates/multi-slider.html',
        link: function(scope, element){

            // used for calculating relative click-events
            var elOffX = element[0].getBoundingClientRect().left;

            var valToPixel = function(val){
                var percent = val / (scope.max - scope.min);
                return Math.floor(percent * element[0].clientWidth + 0.5);
            };

            var pixelToVal = function(pixel){
                var percent = pixel / element[0].clientWidth;
                return Math.floor(percent * (scope.max - scope.min) + 0.5);
            };

            var round = function(n){
                return scope.tick * Math.round(n / scope.tick);
            };

            var addSlot = function(start, stop){
                start = start >= scope.min ? start : scope.min;
                stop = stop <= scope.max ? stop : scope.max;
                scope.slots.push({start: start, stop: stop, day: scope.day});
                scope.$apply();
            };


            var hoverElement = angular.element(element.find('div')[0]);
            var hoverElementWidth = valToPixel(scope.defaultValue);

            hoverElement.css({
                width: hoverElementWidth+'px'
            });

            element.on('mousemove', function(e){
                hoverElement.css({
                    left: e.pageX - elOffX - hoverElementWidth/2 + 'px'
                });
            });

            hoverElement.on('click', function(event){
                if(!element.attr('no-add')){
                    var pixelOnClick = event.pageX - elOffX;
                    var valOnClick = pixelToVal(pixelOnClick);

                    var start = round(valOnClick - scope.defaultValue/2);
                    var stop = start + scope.defaultValue;

                    addSlot(start, stop);
                }
            });
        }
    };
}]);;angular.module('scheduler', ['multislider', 'grid'])

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
}]);;angular.module('slot', ['handle'])
.directive('slot', [function() {
    return {
        scope: {
            min: '=',
            max: '=',
            model: '=',
            slots: '=',
            tick: '='
        },
        restrict: 'E',
        templateUrl: 'templates/slot.html',
        link: function(scope, element) {


            scope.$watch('model', function(){
                setPosition();
            }, true);


            var container = element.parent()[0];
            var resizeDirectionIsStart = true;
            var valuesOnDragStart = {start: scope.model.start, stop: scope.model.stop};


            var valToPixel = function(val){
                var percent = val / (scope.max - scope.min);
                return Math.floor(percent * container.clientWidth + 0.5);
            };

            var valToPercent = function(val){
                return val / (scope.max - scope.min) * 100;
            };

            var pixelToVal = function(pixel){
                var percent = pixel / container.clientWidth;
                return Math.floor(percent * (scope.max - scope.min) + 0.5);
            };

            var round = function(n){
                return scope.tick * Math.round(n / scope.tick);
            };

            var setPosition = function(){
                var offset = valToPercent(scope.model.start);
                var width = valToPercent(scope.model.stop - scope.model.start);
                element.css({
                    left: offset + '%',
                    width: width + '%'
                });
            };


            scope.stopDrag = function(){

                // this prevents user from accidentally
                // adding new slot after resizing or dragging
                setTimeout(function(){
                    angular.element(container).removeAttr('no-add');
                }, 500);

                element.removeClass('active');
                angular.element(container).removeClass('dragging');

                mergeOverlaps();
            };


            scope.startResizeStart = function(){
                resizeDirectionIsStart = true;
                scope.startDrag();
            };

            scope.startResizeStop = function(){
                resizeDirectionIsStart = false;
                scope.startDrag();
            };

            scope.startDrag = function(){
                element.addClass('active');

                angular.element(container).addClass('dragging');
                angular.element(container).attr('no-add', true);

                valuesOnDragStart = {start: scope.model.start, stop: scope.model.stop};
            };


            scope.resize = function(d){
                if(resizeDirectionIsStart){

                    var newStart = round(pixelToVal(valToPixel(valuesOnDragStart.start) + d));

                    if (newStart <= scope.model.stop && newStart>=scope.min) {
                        scope.model.start = newStart;
                        checkForFlip();
                        scope.$apply();
                    }

                } else {

                    var newStop = round(pixelToVal(valToPixel(valuesOnDragStart.stop) + d));

                    if (newStop >= scope.model.start && newStop<=scope.max) {
                        scope.model.stop = newStop;
                        checkForFlip();
                        scope.$apply();
                    }
                }
            };

            scope.drag = function(d){
                var oldVal = scope.model.stop - scope.model.start;
                var newVal = round(pixelToVal(valToPixel(valuesOnDragStart.start) + d));

                if (newVal>=scope.min && newVal+(oldVal)<=scope.max) {
                    scope.model.start = newVal;
                    scope.model.stop = newVal+oldVal;
                    scope.$apply();
                }
            };


            var checkForFlip = function(){
                if(scope.model.start >= scope.model.stop){

                    var tmp = valuesOnDragStart.stop;
                    valuesOnDragStart.stop = valuesOnDragStart.start;
                    valuesOnDragStart.start = tmp;

                    resizeDirectionIsStart = !resizeDirectionIsStart;
                }
            };

            var mergeOverlaps = function(skip_apply){
                angular.forEach(scope.slots, function(el){
                    if(el !== scope.model && el.day === scope.model.day){

                        // model is inside another slot
                        if(el.stop >= scope.model.stop && el.start <= scope.model.start){
                            scope.slots.splice(scope.slots.indexOf(el), 1);
                            scope.model.stop = el.stop;
                            scope.model.start = el.start;
                        }
                        // model completely covers another slot
                        else if(scope.model.stop >= el.stop && scope.model.start <= el.start){
                            scope.slots.splice(scope.slots.indexOf(el), 1);
                        }
                        // another slot's stop is inside current model
                        else if(el.stop >= scope.model.start && el.stop <= scope.model.stop ){
                            scope.slots.splice(scope.slots.indexOf(el), 1);
                            scope.model.start = el.start;
                        }
                        // another slot's start is inside current model
                        else if (el.start >= scope.model.start && el.start <= scope.model.stop){
                            scope.slots.splice(scope.slots.indexOf(el), 1);
                            scope.model.stop = el.stop;
                        }
                    }
                });

                if(!skip_apply){
                    scope.$apply();
                }

            };

            var deleteSelf = function(){
                angular.element(container).removeClass('dragging');
                angular.element(container).removeClass('slot-hover');
                scope.slots.splice(scope.slots.indexOf(scope.model), 1);
            };


            element.bind('contextmenu', function(e){
                e.preventDefault();
                deleteSelf();
            });

            element.on('mouseover', function(){
                angular.element(container).addClass('slot-hover');
            });

            element.on('mouseleave', function(){
                angular.element(container).removeClass('slot-hover');
            });


            // on init, merge overlaps
            mergeOverlaps(true);

        }
    };
}]);