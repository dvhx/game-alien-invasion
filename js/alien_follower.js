// Alien that follows you
"use strict";

var SC = window.SC || {};

SC.alienFollower = function () {
    // constructor
    var self = SC.alien();
    self.images = SC.sprite('follower', 4);
    self.maxSpeed = 2 + 3 * Math.random(); // followers have slightly random speed, just for fun
    self.credit = 20;
    self.life = 90;

    // update
    self.update = function () {
        // move
        self.simpleMove();
        var kx, ky, kk;
        // follow ship if it is alive
        if (SC.ship.life > 0) {
            kx = SC.ship.x - self.x;
            ky = SC.ship.y - self.y;
            kk = Math.sqrt(kx * kx + ky * ky);
            self.dx = self.maxSpeed * kx / kk;
            self.dy = self.maxSpeed * ky / kk;
        } else {
            // if ship is destroyed, move randomly
            if (Math.random() < 0.05) {
                self.dx = self.maxSpeed * (Math.random() - Math.random());
                self.dy = self.maxSpeed * (Math.random() - Math.random());
            }
        }
    };

    return self;
};

