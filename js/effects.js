// Visual effects settings
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.effects = (function () {
    var self = {};

    self.preset = {
        'none': {credit: 10, spatter: 3, beam: 2, sound: false, color: 'silver', parallax: false, shotSizeLimit: 1},
        'minimum': {credit: 5, spatter: 30, beam: 20, sound: true, color: 'lime', parallax: true, shotSizeLimit: 5},
        'average': {credit: 3, spatter: 300, beam: 50, sound: true, color: 'orange', parallax: true, shotSizeLimit: 30},
        'maximum': {credit: 1, spatter: 1000, beam: 1000, sound: true, color: 'red', parallax: true, shotSizeLimit: 50}
    };
    self.current = self.preset.maximum;

    self.range = function (aRange, aLabel) {
        // bind to input element
        var i, names = Object.keys(self.preset);
        aRange.type = 'range';
        aRange.min = 0;
        aRange.max = names.length - 1;
        aRange.step = 1;
        aRange.value = aRange.max;
        for (i = 0; i < names.length; i++) {
            if (self.current === self.preset[names[i]]) {
                aRange.value = i;
            }
        }
        aLabel.textContent = names[aRange.value];
        aLabel.style.color = self.current.color;
        aRange.oninput = function () {
            self.current = self.preset[names[aRange.value]];
            console.log('current', self.current);
            aLabel.textContent = names[aRange.value];
            aLabel.style.color = self.current.color;
            SC.sound.enabled = self.current.sound;
            if (self.current.parallax) {
                document.body.style.background = '';
            } else {
                document.body.style.background = '#003';
            }
        };
    };

    return self;
}());

