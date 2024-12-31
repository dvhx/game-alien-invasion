// Static alien that rotate and shoots shrapnels
"use strict";

var SC = window.SC || {};

SC.alienTurret = function () {
    // constructor
    var self = SC.alien();
    self.images = SC.sprite('turret', 6);
    self.credit = 150;
    self.shake = true;

    // update
    self.update = function () {
        // fire every once in a while
        if (self.frame % 20 === 19) {
            SC.alienShrapnels(1, self.x, self.y);
        }
    };

    return self;
};

