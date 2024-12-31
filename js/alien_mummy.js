// Mother of all dummies
"use strict";

var SC = window.SC || {};

SC.alienMummy = function () {
    // constructor
    var self = SC.alienDummy();
    self.images = SC.sprite('mummy', 4);
    self.shrapnel = 0;
    self.maxSpeed = 1;
    self.life = 2000;
    self.credit = 200;
    self.size = 24;
    self.shake = true;

    // update
    self.update = function () {
        // move
        self.simpleMove();
        // keep them near earth
        self.constraint(300);
        // once in a while summon random dummy
        if ((self.frame % 100 === 0) && (SC.aliens.aliens.length < 1000)) {
            var d = SC.alienDummy();
            d.x = self.x;
            d.y = self.y;
            SC.aliens.aliens.push(d);
        }
    };

    return self;
};

