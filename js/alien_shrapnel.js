// Shrapnel is sometimes produced by explosions, when they hit ship it lost some life
"use strict";

var SC = window.SC || {};

SC.shrapnelLimit = 100;
SC.shrapnelCount = 0;

SC.alienShrapnel = function (aLeft, aTop) {
    // constructor
    SC.shrapnelCount++;

    var self = SC.alien(), angle;
    self.images = null;
    self.color = 'rgba(255,255,255,1.0)';
    self.credit = 0;
    self.shrapnel = 0;
    self.x = aLeft;
    self.y = aTop;
    self.maxSpeed = 15; // 15;
    self.life = 2;
    self.size = 4;
    self.targetable = false;
    self.fragile = true;

    // shrapnel move in random direction
    angle = Math.random() * 2 * Math.PI;
    self.dx = self.maxSpeed * (Math.sin(angle));
    self.dy = self.maxSpeed * (Math.cos(angle));

    // update
    self.update = function () {
        // move
        self.x += self.dx;
        self.y += self.dy;
        // shrapnels are short lived
        if (self.frame >= 20) {
            self.life = 0;
            SC.shrapnelCount--;
        }
    };

    return self;
};

SC.alienShrapnels = function (aCount, aLeft, aTop) {
    // create multiple shrapnels
    var i;
    for (i = 0; i < aCount; i++) {
        SC.aliens.aliens.push(SC.alienShrapnel(aLeft, aTop));
        if (SC.shrapnelCount > SC.shrapnelLimit) {
            break;
        }
    }
};

