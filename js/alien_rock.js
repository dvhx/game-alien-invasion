// Space rock, contain no credits but when you collide with it it will took your life, such is rock
"use strict";

var SC = window.SC || {};

SC.alienRock = function () {
    // constructor
    var self = SC.alien(), big = Math.random() > 0.9;
    self.images = SC.sprite('rock', 1);
    self.shrapnel = big ? 30 : 10;
    self.credit = 0;
    self.da = Math.random() / 10;
    self.dx = 2 * (Math.random() - Math.random());
    self.dy = 2 * (Math.random() - Math.random());
    self.shake = big;

    // update
    self.update = function () {
        // rotate them slowly
        self.angle += self.da;
        // rotate them around earth
        var r, a = Math.atan2(self.y, self.x) + Math.PI / 2;
        self.dx = Math.cos(a);
        self.dy = Math.sin(a);
        // point it slightly towards earth
        self.dx -= 0.001 * self.x;
        self.dy -= 0.001 * self.y;
        // move
        self.simpleMove();
        self.constraint(400);
        // if it is too close the earth, let it burn in atmoshere
        r = Math.sqrt(self.x * self.x + self.y * self.y);
        if (r <= 30) {
            self.life--;
        }
    };

    return self;
};

