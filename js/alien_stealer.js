// Steals nearby credits, otherwise it is harmless
"use strict";

var SC = window.SC || {};

SC.alienStealer = function () {
    // constructor
    var self = SC.alien();
    self.images = SC.sprite('stealer', 1);
    self.shrapnel = 0;
    self.credit = 0;
    self.dx = 2 * (Math.random() - Math.random());
    self.dy = 2 * (Math.random() - Math.random());
    self.targeted = -1;
    self.strength = 0;
    self.maxSpeed = 5;
    self.life = 1000;

    // update dummy
    self.update = function () {
        // keep near earth
        self.constraint(500);
        // move towards first dropped credit
        if (SC.credits.credits.length > 0) {
            // follow chosen credit
            if ((self.targeted > 0) && (self.targeted < SC.credits.credits.length - 1)) {
                var xx, yy, d;
                xx = (SC.credits.credits[self.targeted].x - self.x);
                yy = (SC.credits.credits[self.targeted].y - self.y);
                d = Math.sqrt(xx * xx + yy * yy);
                self.dx = self.maxSpeed * xx / d;
                self.dy = self.maxSpeed * yy / d;
                // when close enough, steal it
                if (d <= 30) {
                    SC.credits.creditsCount--;
                    SC.credits.credits.splice(self.targeted, 1);
                    if (Math.random() > 0.5) {
                        self.credit++;
                    }
                }
            } else {
                // choose some credit and follow it until it dissapear, then choose another credit
                self.targeted = Math.floor(Math.random() * (SC.credits.credits.length - 1));
            }
        }
        // move
        self.simpleMove();
    };

    return self;
};

