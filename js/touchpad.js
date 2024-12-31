// Touchpad with arrows for mobile phones
"use strict";
// globals: document

var SC = window.SC || {};

SC.touchpad = function (aImageUrl, aCallback, aZeroRelease, aRight) {
    // Touchpad with arrows for mobile phones
    var self = {}, w, h, w2, h2;
    self.x = 0;
    self.y = 0;
    self.margin = 16;
    self.visible = true;
    self.padRange = 2;

    // pad
    self.pad = document.createElement('div');
    self.pad.style.position = 'fixed';
    self.pad.style.zIndex = 998;
    if (aRight) {
        self.pad.style.right = (self.margin + 64 - 16) + 'px';
    } else {
        self.pad.style.left = (self.margin + 64 - 16) + 'px';
    }
    self.pad.style.bottom = (self.margin + 64 - 16) + 'px';
    self.pad.style.width = '32px';
    self.pad.style.height = '32px';
    self.pad.style.border = '1px solid aqua';
    self.pad.style.borderRadius = '50%';
    self.pad.style.backgroundColor = 'darkcyan';
    document.body.appendChild(self.pad);

    function updatePad() {
        if (aRight) {
            self.pad.style.right = (self.margin + 64 - 16 - w2 * self.x / self.padRange) + 'px';
        } else {
            self.pad.style.left = (self.margin + 64 - 16 + w2 * self.x / self.padRange) + 'px';
        }
        self.pad.style.bottom = (self.margin + 64 - 16 - h2 * self.y / self.padRange) + 'px';
    }
    updatePad();
    self.updatePad = updatePad;

    // arrows element
    self.img = document.createElement('img');
    self.img.style.position = 'fixed';
    if (aRight) {
        self.img.style.right = self.margin + 'px';
    } else {
        self.img.style.left = self.margin + 'px';
    }
    self.img.style.bottom = self.margin + 'px';
    self.img.style.zIndex = 999;
    self.img.style.border = '1px solid transparent'; // "1px solid red" 2019-01 webkit/chrome update broke this, if you remove this line img will stop receiving touchmove events
    self.img.addEventListener('load', function () {
        w = self.img.width;
        h = self.img.height;
        w2 = w / 2;
        h2 = h / 2;
    });
    self.img.src = aImageUrl;
    document.body.appendChild(self.img);

    // touch events
    // touch start
    self.img.addEventListener('touchstart', function (event) {
        event.preventDefault();
        self.x = (event.targetTouches[0].clientX - event.target.offsetLeft - w2) / w2;
        self.y = (event.targetTouches[0].clientY - event.target.offsetTop - h2) / h2;
        self.x = Math.max(Math.min(self.x, 1), -1);
        self.y = Math.max(Math.min(self.y, 1), -1);
        updatePad();
        if (aCallback) {
            aCallback(self.x, self.y);
        }
    }, true);
    // touch move
    self.img.addEventListener('touchmove', function (event) {
        event.preventDefault();
        self.x = (event.targetTouches[0].clientX - event.target.offsetLeft - w2) / w2;
        self.y = (event.targetTouches[0].clientY - event.target.offsetTop - h2) / h2;
        self.x = Math.max(Math.min(self.x, 1), -1);
        self.y = Math.max(Math.min(self.y, 1), -1);
        updatePad();
        if (aCallback) {
            aCallback(self.x, self.y);
        }
    }, true);
    // touch end
    self.img.addEventListener('touchend', function (event) {
        event.preventDefault();
        if (aCallback) {
            aCallback(self.x, self.y);
        }
        // reset to zero when user end touch
        if (aZeroRelease) {
            self.x = 0;
            self.y = 0;
        }
        updatePad();
    }, true);

    self.show = function () {
        // show arrows
        self.img.style.display = '';
        self.pad.style.display = '';
        self.visible = true;
    };

    self.showIfNeeded = function () {
        // Show touch controls only on mobile
        if (SC.isTouchDevice()) {
            self.show();
            document.getElementById('fire').style.display = '';
        } else {
            self.hide();
            document.getElementById('fire').style.display = 'none';
        }
    };

    self.hide = function () {
        // hide arrows
        self.img.style.display = 'none';
        self.pad.style.display = 'none';
        self.visible = false;
    };

    return self;
};

