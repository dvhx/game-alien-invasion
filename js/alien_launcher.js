// Static alien that fires guided missiles to ship
"use strict";

var SC = window.SC || {};

SC.alienLauncher = function () {
    // constructor
    var self = SC.alienCannon();
    self.images = SC.sprite('launcher', 1);
    self.shake = true;

    // update
    self.update = function () {
        // point towards ship
        self.angle = Math.atan2(SC.ship.y - self.y, SC.ship.x - self.x);
        // fire every once in a while
        if (self.frame % self.delay === self.delay - 1) {
            var s = SC.alienMissile(self.x, self.y);
            SC.aliens.aliens.push(s);
        }
    };

    return self;
};

