// Player's ship (singleton)
"use strict";
// globals: window

var SC = window.SC || {};

SC.key = [];

SC.ship = (function () {
    // create ship
    var self = {}, oldlife = 0;
    self.name = 'anonymous';
    self.images = SC.sprite('ship', 4);
    self.imagesHurt = SC.sprite('shiphurt', 3);
    self.music = SC.storage.readBoolean('SC.ship.music', true);
    self.extraCredit = 1500;

    self.reset = function () {
        // reset ship attributes to initial values
        self.x = 0;
        self.y = 0;
        self.dx = 2;
        self.dy = 0;
        self.speed = 0;
        self.frame = 0;
        self.angle = 0;
        self.credit = self.extraCredit;
        self.life = 100;
        self.magnet = 16;
        self.beams = 1;
        self.range = 150;
        self.rate = 120;  // 60'000ms = 60s / 120 rpm = 500 ms timer
        self.spread = 1;
        self.acceleration = 4.5;
        self.maxSpeed = 5;
        self.credit_multiplier = 1;
        self.penetration = 2;
        self.dxKey = 0;
        self.dyKey = 0;
    };
    self.reset();

    self.short = function () {
        // return short summary of ship improvements
        return 'Cr' + self.credit +
            ' Mu' + self.credit_multiplier +
            ' Bm' + self.beams +
            ' Lf' + self.life +
            ' Mg' + self.magnet +
            ' Rn' + self.range +
            ' Rt' + self.rate +
            ' Sr' + self.spread +
            ' Pn' + self.penetration +
            ' Sp' + self.maxSpeed;
    };

    // wasd movement
    self.wasd = function () {
        // game over?
        if (self.life <= 0) {
            return false;
        }
        // update ship speed according to pressed keys
        if (SC.key[87] || SC.key[38]) {
            self.dyKey -= 0.2; // W
            if (self.dyKey < -1) {
                self.dyKey = -1;
            }
        }
        if (SC.key[65] || SC.key[37]) {
            self.dxKey -= 0.2; // A
            if (self.dxKey < -1) {
                self.dxKey = -1;
            }
        }
        if (SC.key[83] || SC.key[40]) {
            self.dyKey += 0.2; // S
            if (self.dyKey > 1) {
                self.dyKey = 1;
            }
        }
        if (SC.key[68] || SC.key[39]) {
            self.dxKey += 0.2; // D
            if (self.dxKey > 1) {
                self.dxKey = 1;
            }
        }
        if (!SC.touchpad.visible) {
            SC.touchpad.x = self.dxKey;
            SC.touchpad.y = self.dyKey;
        } else {
            // wasd on phone only for debuging
            if (SC.key[87] || SC.key[38]) {
                self.dy = -self.maxSpeed; // W
            }
            if (SC.key[65] || SC.key[37]) {
                self.dx = -self.maxSpeed; // A
            }
            if (SC.key[83] || SC.key[40]) {
                self.dy = self.maxSpeed; // S
            }
            if (SC.key[68] || SC.key[39]) {
                self.dx = self.maxSpeed; // D
            }
        }
        self.dxKey *= 0.95;
        self.dyKey *= 0.95;
        // speed limiter
        if (self.dx > self.maxSpeed) {
            self.dx = self.maxSpeed;
        }
        if (self.dy > self.maxSpeed) {
            self.dy = self.maxSpeed;
        }
        if (self.dx < -self.maxSpeed) {
            self.dx = -self.maxSpeed;
        }
        if (self.dy < -self.maxSpeed) {
            self.dy = -self.maxSpeed;
        }
        // move ship
        self.x += self.dx;
        self.y += self.dy;
        // return true if ship is moving
        var ship_is_moving = (self.dx !== 0) || (self.dy !== 0);
        // slowing down without thrusters
        self.dx *= 0.95;
        self.dy *= 0.95;
        // done
        return ship_is_moving;
    };

    // ship rendering
    self.draw = function (aContext) {
        // credits indicator
        var s = self.credit + '🌟', z;
        aContext.save();
        aContext.font = "16pt courier";
        aContext.textAlign = "left";
        aContext.fillStyle = "yellow";
        //aContext.fillText(s, SC.w - SC.context.measureText(s).width - 10, SC.h - 20);
        aContext.fillText(s, 10, 30);
        aContext.restore();
        // life indicator
        z = Math.max(0, self.life);
        z = Math.min(100, z);
        aContext.fillStyle = "rgba(0,255,0,0.5)";
        //aContext.fillRect(SC.w - 100 - 8, SC.h - 10 - 8, z, 10);
        aContext.fillRect(10 - 8, 35, z, 10);
        aContext.fillStyle = "rgba(255,0,0,0.5)";
        //aContext.fillRect(SC.w - 100 + z - 8, SC.h - 10 - 8, 100 - z, 10);
        aContext.fillRect(10 + z - 8, 35, 100 - z, 10);
        // game over?
        if (self.life > 0) {
            // calculate ships speed and corresponding image
            self.speed = self.dx * self.dx + self.dy * self.dy;
            self.frame = 0;
            if (self.speed > 0.4 * self.maxSpeed) {
                self.frame = 1;
            }
            if (self.speed > 0.6 * self.maxSpeed) {
                self.frame = 2;
            }
            if (self.speed > 0.8 * self.maxSpeed) {
                self.frame = 3 - Math.round(Math.random());
            }
            // draw ship
            aContext.save();
            aContext.translate(SC.cx, SC.cy);
            aContext.rotate(self.angle);
            if (self.life < oldlife) {
                self.imagesHurt.draw(aContext, -16, -16);
            } else {
                aContext.drawImage(self.images.images[self.frame], -8, -8);
            }
            oldlife = self.life;
            aContext.restore();
        }
    };

    return self;
}());

