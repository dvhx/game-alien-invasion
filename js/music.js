// Universal music manager
// require: none
"use strict";
// globals: document, setTimeout, window

var SC = window.SC || {};

SC.music = (function () {
    // Universal music manager
    var self = {}, current, currentName;
    self.music = {};
    self.stops = {};

    self.add = function (aName, aStops) {
        // Add music track
        self.music[aName] = document.createElement('audio');
        self.music[aName].src = 'music/' + aName + '.ogg';
        self.music[aName].loop = true;
        self.stops[aName] = aStops;
        return self.music[aName];
    };

    self.change = function (aName) {
        // Change music track at allowed positions
        var i, n = 0, c = current ? current.currentTime : 0, latency = 0.005;
        if (currentName) {
            for (i = 0; i < self.stops[currentName].length; i++) {
                if (self.stops[currentName][i] >= c) {
                    n = self.stops[currentName][i];
                    break;
                }
            }
        }
        function check() {
            var cc = current ? current.currentTime : 0, old;
            if (cc > n - latency || cc <= 0) {
                old = current;
                if (old) {
                    old.pause();
                }
                self.play(aName);
                if (old) {
                    old.currentTime = 0;
                }
            } else {
                setTimeout(check, latency);
            }
        }
        check();
    };

    self.play = function (aName) {
        // Start playing music
        current = self.music[aName];
        currentName = aName;
        self.music[aName].play();
    };

    self.playOnFirstGesture = function (aName) {
        // Start playing given music on first gesture
        self.play(aName);
        function a() {
            if (self.music[aName].paused) {
                self.play(aName);
            }
            window.removeEventListener('click', a);
        }
        window.addEventListener('click', a);
    };

    self.stop = function (aName) {
        // Stop playing music
        if (!aName) {
            var k;
            for (k in self.music) {
                if (self.music.hasOwnProperty(k)) {
                    self.music[k].pause();
                }
            }
            return;
        }
        if (!self.music[aName].paused) {
            self.music[aName].pause();
        }
    };

    self.next = function () {
        // Play next track
        var k = Object.keys(self.music),
            a = k.indexOf(currentName);
        if (current) {
            current.pause();
        } else {
            self.play(k[0]);
            return;
        }
        a++;
        if (a > k.length - 1) {
            a = 0;
        }
        self.play(k[a]);
    };

    return self;
}());

