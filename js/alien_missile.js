// Guided missile move towards ship like follower but renders differently, is faster and have limited lifespan, it is produced by other aliens
"use strict";

var SC = window.SC || {};

SC.alienMissile = function (aLeft, aTop) {
    // constructor
    var self = SC.alien();
    self.images = null;
    self.color = 'rgba(255,0,0,1.0)';
    self.credit = 0;
    self.shrapnel = 3;
    self.x = aLeft;
    self.y = aTop;
    self.maxSpeed = 7;
    self.life = 10;
    self.size = 5;
    self.targetable = false;

    // update
    self.update = function () {
        // missile move towards ship
        self.angle = Math.atan2(SC.ship.y - self.y, SC.ship.x - self.x);
        self.dx = self.maxSpeed * (Math.cos(self.angle));
        self.dy = self.maxSpeed * (Math.sin(self.angle));
        // move
        self.x += self.dx;
        self.y += self.dy;
        // missiles short lived
        if (self.frame >= 50) {
            self.life = 0;
        }
    };

    return self;
};

