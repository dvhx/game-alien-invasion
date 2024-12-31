// Dynamically loading multiple images (e.g. animated sprites) + caching
"use strict";
// globals: Image

var SC = window.SC || {};

SC.spriteCache = {};

SC.sprite = function (aName, aCount) {
    // load set of multiple images and draw them as animation
    var self = {
        name: aName,
        images: [],
        frame: 0
    }, i, img, url;

    // load multiple images from set (must be "image/NAME/NAMEINDEX.png", zero indexed)
    for (i = 0; i < aCount; i++) {
        url = 'image/' + aName + '/' + (aName + i) + '.png';
        if (SC.spriteCache.hasOwnProperty(url)) {
            // use cached image
            img = SC.spriteCache[url];
        } else {
            // load new image
            img = new Image();
            img.src = url;
            SC.spriteCache[url] = img;
        }
        self.images.push(img);
    }

    // draw sprite
    self.draw = function (aContext, aLeft, aTop) {
        // increment frame
        self.frame = (self.frame + 1) % self.images.length;
        // draw current frame
        aContext.drawImage(self.images[self.frame], aLeft, aTop);
    };

    return self;
};

