/*
 * ccspinner.js
 * Version 0.0.1
 * Copyright 2017 chicong chen
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Original Author: John Papa and Dan Wahlin
 * Modified by chicong chen
 */
(function () {
    'use strict';

    var overlayApp = angular.module('ccspinner', []);

    //Empty factory to hook into $httpProvider.interceptors
    //Directive will hookup request, response, and responseError interceptors
    overlayApp.factory('ccspinner.httpInterceptor', httpInterceptor);
    function httpInterceptor() { return {} }

    //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    overlayApp.config(['$httpProvider', httpProvider]);
    function httpProvider($httpProvider) {
        $httpProvider.interceptors.push('ccspinner.httpInterceptor');
    }

    //Directive that uses the httpInterceptor factory above to monitor XHR calls
    //When a call is made it displays an overlay and a content area
    //No attempt has been made at this point to test on older browsers
    overlayApp.directive('ccspinner', ['$q', '$timeout', '$window', 'ccspinner.httpInterceptor', '$rootScope',
        '$http', overlay]);

    function overlay($q, $timeout, $window, httpInterceptor, rootScope,$http) {
        var directive = {
            scope: {
                ccspinnerDelayIn: "@",
                ccspinnerDelayOut: "@",
                ccspinnerAnimation: "@",
                ccspinnerDebug: "=?"
            },
            restrict: 'EA',
            transclude: true,
            template: getTemplate(),
            link: link
        };
        return directive;

        function getTemplate() {
            return '<div id="ccspinner-container" ' +
                           'class="{{ccspinnerAnimation}}" data-ng-show="!!show">' +
                  '<div id="ccspinner-content" class="ccspinner-content">' +
       '<div class="ccspinner-background"></div>' +
    '<div class="centerBlock" data-ng-transclude></div>' +
                  '</div>' +
                '</div>';
        }

        function link(scope, element, attrs) {
            //scope.ccspinnerDebug = angular.isDefined(scope.ccspinnerDebug) ? scope.ccspinnerDebug : false;
            var defaults = {
                overlayDelayIn: 500,
                overlayDelayOut: 500
            };
            var delayIn = scope.ccspinnerDelayIn ? scope.ccspinnerDelayIn : defaults.overlayDelayIn;
            var delayOut = scope.ccspinnerDelayOut ? scope.ccspinnerDelayOut : defaults.overlayDelayOut;
            var overlayContainer = null;
            scope.queue = [];
            var timerPromise = null;
            var timerPromiseHide = null;
            var currentState = "";
         
            init();
            function calculateOverlayContentPosition() {
                var w = 0;
                var h = 0;
                if (!$window.innerWidth) {
                    if (!(document.documentElement.clientWidth == 0)) {
                        w = document.documentElement.clientWidth;
                        h = document.documentElement.clientHeight;
                    }
                    else {
                        w = document.body.clientWidth;
                        h = document.body.clientHeight;
                    }
                }
                else {
                    w = $window.innerWidth;
                    h = $window.innerHeight;
                }
                var content = document.getElementById('ccspinner-content');
                var contentWidth = parseInt(getComputedStyle(content, 'width').replace('px', ''));
                var contentHeight = parseInt(getComputedStyle(content, 'height').replace('px', ''));

                content.style.top = h / 2 - contentHeight / 2 + 'px';
                content.style.left = w / 2 - contentWidth / 2 + 'px';
            }
            angular.element($window).bind('resize', function () {
                calculateOverlayContentPosition();
            });
            var wait = 0;
            rootScope.$on('showSpinner',
           function() {
                if (++wait === 1) {
                    showOverlay();
                }
            });
            rootScope.$on('hideSpinner',
            function(){
                if (--wait === 0) {
                    hideOverlay();
                }
            });
         
            function init() {
               
                stopSpinnerWhenStateChanged();
                wireUpHttpInterceptor();
                if (window.jQuery) wirejQueryInterceptor();
                overlayContainer = document.getElementById('ccspinner-container');
               
            }
            
            function stopSpinnerWhenStateChanged() {
                rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                    //console.log('state changed start');
                });

                rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        currentState = toState.name;
                        
                        //console.log('State changed to:', currentState);
                        $http.pendingRequests.forEach(function (request) {
                            //console.log("pending req==>from state:",request.requestFromState);
                            if (request.cancel && currentState !== request.requestFromState) {
                                //console.log("canceling req==>:", request.url);
                                request.cancel.resolve('Cancel!');
                            }
                        });
                    }
                );
            }
            //Hook into httpInterceptor factory request/response/responseError functions
            function wireUpHttpInterceptor() {

                httpInterceptor.request = function (config) {
                    // console.log("request config:", config);
                    if (!config.timeout) {
                        config.cancel = $q.defer();
                        config.timeout = config.cancel.promise;
                        config.requestFromState = currentState;
                    }
                    if (!config.hideOverlay) {
                        processRequest();
                    }
                    return config || $q.when(config);
                };

                httpInterceptor.response = function (response) {
                    //console.log("response:", response);
                    if (response && response.config && !response.config.hideOverlay) {
                        processResponse();
                    }
                    return response || $q.when(response);
                };

                httpInterceptor.responseError = function (rejection) {
                    if (rejection && rejection.config && !rejection.config.hideOverlay) {
                        processResponse();
                    }
                    return $q.reject(rejection);
                };
            }

            //Monitor jQuery Ajax calls in case it's used in an app
            function wirejQueryInterceptor() {

                $(document).ajaxSend(function (e, xhr, options) {
                    if (options && !options.hideOverlay) {
                        processRequest();
                    }
                });

                // ajax complete always gets fired, even on errors
                $(document).ajaxComplete(function (e, xhr, options) {
                    if (options && !options.hideOverlay) {
                        processResponse();
                    }
                });
            }

            function processRequest() {
                //console.log('request==>curr state', currentState);
                scope.queue.push({});
               
                if (scope.queue.length == 1) {
                    timerPromise = $timeout(function () {
                        if (scope.queue.length) showOverlay();
                    }, delayIn); //Delay showing for 500 millis to avoid flicker
                }
            }

          
            function processResponse() {
                scope.queue.pop();
               
                //console.log('response==>curr state', currentState);

                if (scope.queue.length == 0) {
                    //Since we don't know if another XHR request will be made, pause before
                    //hiding the overlay. If another XHR request comes in then the overlay
                    //will stay visible which prevents a flicker
                    timerPromiseHide = $timeout(function () {
                        //Make sure queue is still 0 since a new XHR request may have come in
                        //while timer was running
                        if (scope.queue.length == 0) {
                            hideOverlay();
                            if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                        }
                    }, delayOut);
                }
            }

            function showOverlay() {
                calculateOverlayContentPosition();
                scope.show = true;
            }

            function hideOverlay() {
                if (timerPromise) $timeout.cancel(timerPromise);
                scope.show = false;
            }

            var getComputedStyle = (function () {
                var func = null;
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    func = document.defaultView.getComputedStyle;
                } else if (typeof (document.body.currentStyle) !== "undefined") {
                    func = function (element, anything) {
                        return element["currentStyle"];
                    };
                } else {
                    func = function (el, prop, getComputedStyle) {
                        getComputedStyle = window.getComputedStyle;

                        // In one fell swoop
                        return (
                            // If we have getComputedStyle
                            getComputedStyle ?

                            // Query it
                            getComputedStyle(el) :

                            // Otherwise, we are in IE and use currentStyle
                            el.currentStyle
                        )[
                            // Switch to camelCase for CSSOM
                            prop.replace(/-(\w)/gi, function (word, letter) {
                                return letter.toUpperCase();
                            })
                        ];
                    };
                }

                return function (element, style) {
                    return func(element, null)[style];
                };
            })();
        }
    }
}());
