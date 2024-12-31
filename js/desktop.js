// Modifications for desktop version
"use strict";
// globals: document, window, Image

var SC = window.SC || {};

SC.isTouchDevice = function () {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

// Enable shooting with mouse
window.addEventListener('DOMContentLoaded', function () {
    SC.shots.mouse('canvas');
});

