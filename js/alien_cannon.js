// Static alien that rotate and shoots shrapnels directly to the ship
"use strict";

var SC = window.SC || {};

SC.alienCannon = function () {
    // constructor
    var self = SC.alien();
    self.images = SC.sprite('cannon', 1);
    self.credit = 220;
    self.delay = 40;
    self.shake = true;

    // update
    self.update = function () {
        // rotate towards ship
        self.angle = Math.atan2(SC.ship.y - self.y, SC.ship.x - self.x);
        // fire (create shrapnel) every once in a while
        if (self.frame % self.delay === self.delay - 1) {
            var s = SC.alienShrapnel(self.x, self.y);
            s.dx = 10 * Math.cos(self.angle);
            s.dy = 10 * Math.sin(self.angle);
            SC.aliens.aliens.push(s);
        }
    };

    return self;
};

