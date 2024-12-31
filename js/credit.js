// Destroyed aliens drop few credits around, this manages them
"use strict";
// globals: setTimeout

var SC = window.SC || {};

SC.creditLimit = 500;

SC.credit = function (aLeft, aTop) {
    // constructor for single dropped credit
    var self = {};
    self.life = 100 + 100 * Math.random();
    self.x = aLeft;
    self.y = aTop;
    self.dx = 5 * (Math.random() - Math.random());
    self.dy = 5 * (Math.random() - Math.random());

    self.update = function () {
        // age and move credit
        self.life--;
        self.x += self.dx;
        self.y += self.dy;
        self.dx *= 0.95;
        self.dy *= 0.95;
    };

    self.draw = function (aContext) {
        // draw credit
        aContext.save();
        aContext.translate(self.x + SC.cx - SC.ship.x, self.y + SC.cy - SC.ship.y);
        aContext.fillStyle = "rgba(255,255,0," + (0.1 + 0.9 * self.life / 100) + ")";
        aContext.fillRect(-1, -1, 2, 2);
        aContext.restore();
    };

    return self;
};

SC.credits = (function () {
    // all credits currently on screen
    var self = {};
    self.credits = [];
    self.creditsCount = 0;

    self.explode = function (aLeft, aTop, aCount) {
        // create bunch of credits
        // console.log('Exploding '+aCount+' credits at ['+Math.round(aLeft)+', '+Math.round(aTop)+']');
        var i;
        SC.sound.play('explosion');
        if (self.creditsCount < SC.creditLimit) {
            self.creditsCount += aCount;
            for (i = 0; i < aCount; i++) {
                self.credits.push(SC.credit(aLeft, aTop));
            }
        }
    };

    self.implode = function (aKoef) {
        // move credits towards ship
        var i, d;
        for (i = 0; i < self.credits.length; i++) {
            self.credits[i].dx = -(self.credits[i].x - SC.ship.x);
            self.credits[i].dy = -(self.credits[i].y - SC.ship.y);
            d = Math.sqrt(self.credits[i].dx * self.credits[i].dx + self.credits[i].dy * self.credits[i].dy);
            self.credits[i].dx /= d;
            self.credits[i].dy /= d;
            self.credits[i].dx *= aKoef;
            self.credits[i].dy *= aKoef;
        }
    };

    self.implodeAll = function () {
        // move remaining credits towards ship several times
        console.log('Imploding credits');
        self.implode(10);
        setTimeout(function () {
            self.implode(10);
        }, 500);
        setTimeout(function () {
            self.implode(10);
        }, 1000);
        setTimeout(function () {
            self.implode(10);
        }, 1500);
        setTimeout(function () {
            self.implode(10);
        }, 2000);
    };

    // draw function
    self.creditFrame = 0;
    self.draw = function (aContext) {
        var i, eaten = 0, close, endSuck = SC.aliens.aliens.length <= 0, beamDrawn = 0;
        for (i = self.credits.length - 1; i > 0; i--) {
            // draw
            self.creditFrame++;
            self.credits[i].update();
            if (self.creditFrame % SC.effects.current.credit === 0) {
                self.credits[i].draw(aContext);
            }
            // suck near credits into ship and increase it's credit
            close = false;
            if ((SC.ship.life > 0) && (eaten < SC.ship.beams)) {
                close = (Math.abs(self.credits[i].x - SC.ship.x) < SC.ship.magnet) && (Math.abs(self.credits[i].y - SC.ship.y) < SC.ship.magnet);
            }
            if (endSuck) {
                close = (Math.abs(self.credits[i].x - SC.ship.x) < SC.ship.magnet) && (Math.abs(self.credits[i].y - SC.ship.y) < SC.ship.magnet);
            }
            // remove old credits
            if ((self.credits[i].life <= 0) || close) {
                if (close) {
                    SC.ship.credit += SC.ship.credit_multiplier;
                    if (beamDrawn < SC.effects.current.beam) {
                        aContext.lineWidth = 4;
                        aContext.strokeStyle = "rgba(200,200,255,0.3)";
                        aContext.beginPath();
                        aContext.moveTo(SC.cx, SC.cy);
                        aContext.lineTo(SC.cx + self.credits[i].x - SC.ship.x, SC.cy + self.credits[i].y - SC.ship.y);
                        aContext.stroke();
                        aContext.closePath();
                    }
                    beamDrawn++;
                }
                self.creditsCount--;
                self.credits.splice(i, 1);
                eaten++;
            }
        }
    };

    return self;
}());

