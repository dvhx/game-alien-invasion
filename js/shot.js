// Shots fired by my ship
"use strict";
// globals: setInterval, clearInterval, document

var SC = window.SC || {};

SC.spattersDrawnInFrame = 0;

SC.shot = function (aFromX, aFromY, aToX, aToY, aSpreadAngle, aSize) {
    // create single shot
    var self = {};
    self.x = aFromX;
    self.y = aFromY;
    self.speed = 12;
    self.size = aSize || SC.ship.penetration;
    self.angle = Math.atan2(aToY - aFromY, aToX - aFromX) + aSpreadAngle * Math.PI / 180;
    self.dx = self.speed * Math.cos(self.angle) + SC.ship.dx;
    self.dy = self.speed * Math.sin(self.angle) + SC.ship.dy;
    self.range = SC.ship.range / self.speed;

    // drawing procedure
    self.draw = function (aContext, aSizeLimit) {
        // moving shot forward
        self.x = self.x + self.dx;
        self.y = self.y + self.dy;
        self.range--;
        // improve appearance of used shots
        if (self.size <= 0) {
            self.size -= 3;
            self.speed *= 0.8;
            // mobile optimization
            if (SC.spattersDrawnInFrame > SC.effects.current.spatter) {
                return;
            }
            SC.spattersDrawnInFrame++;
        }
        // draw shot
        aContext.save();
        aContext.translate(SC.cx + self.x - SC.ship.x, SC.cy + self.y - SC.ship.y);
        // draw it
        if (self.size > 0) {
            if (self.size > 5) {
                aContext.fillStyle = "rgba(255, 255, 0, 0.5)";
            } else {
                aContext.fillStyle = "rgba(255, 255, 0, 1)";
            }
        } else {
            // blood splatter
            aContext.fillStyle = "rgba(0, 255, 0, " + (1 / Math.abs(self.size / 3)) + ")";
        }
        if (self.size !== 0) {
            var as = Math.min(Math.abs(self.size), aSizeLimit);
            aContext.fillRect(-as, -as, 2 * as, 2 * as); // NOTE: for some reson, opera crash if fillRect is given +/- weird coords, e.g. negative size or so
        }
        aContext.restore();
    };

    return self;
};

SC.shots = (function () {
    // all shots
    var self = {};
    self.shots = [];
    self.angle = 10;

    // adding function
    self.push = function (aShot) {
        self.shots.push(aShot);
    };

    // drawing function
    self.draw = function (aContext) {
        var i, s = SC.effects.current.shotSizeLimit;
        SC.spattersDrawnInFrame = 0;
        for (i = self.shots.length - 1; i >= 0; i--) {
            self.shots[i].draw(aContext, s);
            // remove unused
            if (self.shots[i].range <= 0) {
                self.shots.splice(i, 1);
            }
        }
    };

    // autofire mechanism
    self.autofireInterval = undefined;
    self.autofireLastAim = 0;
    self.nearest = -1;

    function fireAtNearest() {
        // fire at nearest enemy
        var a, q, tx, ty, i, d, r, dx, dy, c;
        if (self.nearest >= 0) {
            a = SC.aliens.aliens[self.nearest];
            if (!a) {
                return;
            }
            // calculate current distance
            dx = SC.ship.x - a.x;
            dy = SC.ship.y - a.y;
            d = Math.sqrt(dx * dx + dy * dy);
            // predict where it will be
            q = 0.09 * d;
            r = -8;
            tx = a.x + q * a.dx + r * SC.ship.dx;
            ty = a.y + q * a.dy + r * SC.ship.dy;
            // shoot there
            if (SC.ship.life > 0) {
                SC.sound.play('pew');
                c = SC.ship.spread % 2 === 1 ? 0 : 5;
                for (i = 0; i < SC.ship.spread; i++) {
                    SC.shots.push(SC.shot(SC.ship.x, SC.ship.y, tx, ty, 5 + 10 * i - 10 * SC.ship.spread / 2 - c));
                }
            }
        }
    }

    function fireAtCursor() {
        var i, dx, dy, c;
        // calculate current distance
        dx = SC.ship.x + (self.mouseX - SC.cx);
        dy = SC.ship.y + (self.mouseY - SC.cy);
        // shoot there
        if ((SC.ship.life > 0) && (!SC.pause)) {
            SC.sound.play('pew');
            c = SC.ship.spread % 2 === 1 ? 0 : self.angle / 2;
            for (i = 0; i < SC.ship.spread; i++) {
                SC.shots.push(SC.shot(SC.ship.x, SC.ship.y, dx, dy, self.angle / 2 + self.angle * i - self.angle * SC.ship.spread / 2 - c));
            }
        }
        self.mouseDown = true;
    }

    function autofireIntervalCallback() {
        // re-aim occasionaly
        var ms = Date.now();
        if (ms - self.autofireLastAim > 200) {
            self.nearest = SC.aliens.nearest();
            self.autofireLastAim = ms;
        }
        // fire
        fireAtNearest();
    }

    function onFireTouchStart(event) {
        // start shooting
        event.preventDefault();
        self.nearest = SC.aliens.nearest();
        fireAtNearest();
        clearInterval(self.autofireInterval);
        self.autofireInterval = setInterval(autofireIntervalCallback, 60000 / SC.ship.rate);
        event.target.classList.add('active');
    }

    function onFireTouchEnd(event) {
        // stop shooting
        event.preventDefault();
        clearInterval(self.autofireInterval);
        SC.autofireInterval = 0;
        event.target.classList.remove('active');
    }

    self.autofire = function (aElementOrId) {
        // hook autofire to fire button
        var e = typeof aElementOrId === 'string' ? document.getElementById(aElementOrId) : aElementOrId;
        e.addEventListener('touchstart', onFireTouchStart, true);
        e.addEventListener('touchend', onFireTouchEnd, true);
    };


    function onFireMouseDown(event) {
        // Shoot at cursor
        self.mouseX = event.clientX;
        self.mouseY = event.clientY;
        fireAtCursor();
        clearInterval(self.autofireInterval);
        self.autofireInterval = setInterval(fireAtCursor, 60000 / SC.ship.rate);
    }

    function onFireMouseMove(event) {
        self.mouseX = event.clientX;
        self.mouseY = event.clientY;
    }

    function onFireMouseUp() {
        clearInterval(self.autofireInterval);
        SC.autofireInterval = 0;
    }
    self.mouseStopShooting = onFireMouseUp;

    self.mouse = function (aElementOrId) {
        var e = typeof aElementOrId === 'string' ? document.getElementById(aElementOrId) : aElementOrId;
        e.addEventListener('mousedown', onFireMouseDown, true);
        e.addEventListener('mousemove', onFireMouseMove, true);
        e.addEventListener('mouseup', onFireMouseUp, true);
    };

    self.promo = autofireIntervalCallback;
    return self;
}());

