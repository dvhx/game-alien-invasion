// Dummy aliens move only in orthogonal direction
"use strict";

var SC = window.SC || {};

SC.alienDummy = function () {
    // constructor
    var self = SC.alien();
    self.images = SC.sprite('dummy', 3);
    self.shrapnel = 0;

    // dummies move only 1 orthogonal direction
    self.randomize = function () {
        switch (Math.round(Math.random() * 4) % 4) {
        case 0:
            self.dx = +self.maxSpeed;
            break;
        case 1:
            self.dx = -self.maxSpeed;
            break;
        case 2:
            self.dy = +self.maxSpeed;
            break;
        case 3:
            self.dy = -self.maxSpeed;
            break;
        }
    };
    self.randomize();

    // update
    self.update = function () {
        // move
        self.simpleMove();
        // keep them near earth
        self.constraint(350);
    };

    return self;
};

