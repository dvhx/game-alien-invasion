// Mother of all followers, similar to mummy but bigger and spawn another followers
"use strict";

var SC = window.SC || {};

SC.alienFummy = function () {
    // constructor
    var self = SC.alienDummy();
    self.images = SC.sprite('fummy', 4);
    self.shrapnel = 0;
    self.maxSpeed = 1;
    self.life = 1800;
    self.credit = 300;
    self.size = 24;
    self.shake = true;

    // update
    self.update = function () {
        // move
        self.simpleMove();
        // keep them near earth
        self.constraint(300);
        // once in a while summon random followers
        if ((self.frame % 100 === 0) && (SC.aliens.aliens.length < 1000)) {
            var d = SC.alienFollower();
            d.x = self.x;
            d.y = self.y;
            SC.aliens.aliens.push(d);
        }
    };

    return self;
};

