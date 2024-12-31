// Ancestor of all aliens and manager for all aliens
"use strict";
// globals: window

var SC = window.SC || {};

SC.FPS = 20;
SC.alienFreezeTime = 2 * SC.FPS;

SC.alien = function () {
    // Create alien ancestor
    var self = {};
    self.frame = 0;
    self.life = 100;
    self.credit = 15;
    self.shrapnel = 3;
    self.x = 0;
    self.y = 0;
    self.strength = 5;  // how much energy it steals from ship
    self.maxSpeed = 2;
    self.dx = 0;
    self.dy = 0;
    self.images = null;
    self.color = 'rgba(255,0,255,1)';   // used in simple aliens, e.g. missile
    self.size = 16;
    self.angle = 0;
    self.targetable = true;
    self.fragile = false; // if true it will hurt on contact with ship (e.g. shrapnel)
    self.shake = false; // whether destruction cause shake

    self.randomPosition = function () {
        // move alien to random position
        var a = Math.PI * 2 * Math.random(),
            d = (0.4 + Math.random()) * 300;        // 120 - 420
        self.x = d * Math.sin(a);
        self.y = d * Math.cos(a);
    };
    self.randomPosition();

    self.simpleMove = function () {
        // keep moving in current direction
        if (self.frame > SC.alienFreezeTime) {
            self.x += self.dx;
            self.y += self.dy;
        }
    };

    self.update = function () {
        // update alien
        // move alien
        self.simpleMove();
    };

    self.constraint = function (aRange) {
        // keep them near earth
        if (self.x > aRange) {
            self.dx = -self.maxSpeed;
        }
        if (self.x < -aRange) {
            self.dx = +self.maxSpeed;
        }
        if (self.y > aRange) {
            self.dy = -self.maxSpeed;
        }
        if (self.y < -aRange) {
            self.dy = +self.maxSpeed;
        }
    };

    // draw alien
    self.draw = function (aContext) {
        // update
        self.update();
        // drawing
        self.frame++;
        aContext.save();
        aContext.translate(SC.cx + self.x - SC.ship.x, SC.cy + self.y - SC.ship.y);
        aContext.rotate(self.angle);
        if (self.images) {
            self.images.draw(aContext, -self.size / 2, -self.size / 2);
        } else {
            aContext.fillStyle = self.color;
            aContext.fillRect(-self.size / 2, -self.size / 2, self.size, self.size);
        }
        aContext.restore();
    };

    return self;
};

SC.aliens = (function () {
    // Create array of aliens
    var self = {};
    self.aliens = [];

    // reset
    self.clear = function () {
        self.aliens = [];
    };
    self.clear();

    // add aliens of specific type
    self.add = function (aConstructor, aCount) {
        var i;
        for (i = 0; i < aCount; i++) {
            self.aliens.push(aConstructor());
        }
    };

    // find nearest targetable alien (not shrapnels)
    self.nearest = function () {
        var i, sx = SC.ship.x, sy = SC.ship.y, x, y, d, m = Number.MAX_VALUE, mi = -1;
        for (i = 0; i < self.aliens.length; i++) {
            if (self.aliens[i].targetable) {
                x = sx - self.aliens[i].x;
                y = sy - self.aliens[i].y;
                d = Math.sqrt(x * x + y * y);
                if (d < m) {
                    m = d;
                    mi = i;
                }
            }
        }
        return mi;
    };

    // draw all aliens at once
    self.draw = function (aContext) {
        var i, close, oldlife;
        for (i = 0; i < self.aliens.length; i++) {
            // draw aliens
            self.aliens[i].draw(aContext);
            // too close aliens suck life from ship
            close = (Math.abs(self.aliens[i].x - SC.ship.x) < 16) && (Math.abs(self.aliens[i].y - SC.ship.y) < 16);
            if (close) {
                oldlife = SC.ship.life;
                SC.ship.life -= self.aliens[i].strength;
                if (self.aliens[i].fragile) {
                    self.aliens[i].life--;
                }
                if ((SC.ship.life <= 0) && (oldlife > 0)) {
                    // limit size of ship explosion to 500 for performance reason
                    SC.credits.explode(SC.ship.x, SC.ship.y, Math.min(500, SC.ship.credit + 10));
                    //SC.score.add(SC.ship.name, SC.level + 1, SC.kills, SC.ship.credit);
                }
                if (SC.ship.life < 0) {
                    SC.ship.life = 0;
                }
            }
        }
    };

    // freeze aliens
    self.freeze = function () {
        var i;
        for (i = 0; i < self.aliens.length; i++) {
            self.aliens[i].frame = 0;
        }
    };

    // move aliens away from ship
    self.spread = function (aDistance) {
        var i, x, y, sx = SC.ship.x, sy = SC.ship.y, d, dx, dy;
        for (i = 0; i < self.aliens.length; i++) {
            x = sx - self.aliens[i].x;
            y = sy - self.aliens[i].y;
            d = Math.sqrt(x * x + y * y);
            if (d < aDistance) {
                dx = Math.random() < 0.5 ? -1 : 1;
                dy = Math.random() < 0.5 ? -1 : 1;
                self.aliens[i].x += aDistance * dx;
                self.aliens[i].y += aDistance * dy;
            }
        }
    };

    return self;
}());

