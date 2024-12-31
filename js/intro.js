// Introduction before every level (briefing)
"use strict";
// globals: document

var SC = window.SC || {};

SC.intro = function (aTitle, aImageAndTexts, aCallback) {
    // show info between levels
    var i, bg, title, img, p, clearFix, buttons, start, restart, shop, send, credit;
    SC.touchpad.hide();
    SC.pause = true;

    // background
    bg = document.createElement('div');
    bg.className = 'intro';

    // title
    title = document.createElement('h1');
    title.textContent = aTitle;
    bg.appendChild(title);

    // buttons
    buttons = document.createElement('nav');
    bg.appendChild(buttons);

    if (aTitle !== 'Congratulation!') {
        // shop
        shop = document.createElement('button');
        shop.textContent = 'Shop';
        shop.className = 'shop';

        // show credit in shop button
        credit = document.createElement('h3');
        credit.textContent = 'You have ' + (SC.level === 0 ? '???' : SC.ship.credit) + '🌟';
        SC.shopButtonCredit = credit;
        shop.appendChild(credit);
        buttons.appendChild(shop);

        shop.addEventListener('click', function () {
            SC.shop(function () {
                credit.textContent = 'You have ' + SC.ship.credit + '🌟';
            });
        });

        // start
        start = document.createElement('button');
        start.textContent = 'Play';
        start.className = 'start';
        start.addEventListener('click', function () {
            //console.log('Play', SC.level, aCallback);
            // hide intro
            bg.parentNode.removeChild(bg);
            // show touchpad
            SC.touchpad.showIfNeeded();
            // center ship
            SC.ship.x = 0;
            SC.ship.y = 0;
            SC.ship.dx = 0;
            SC.ship.dy = 0;
            // show in-game shop
            document.getElementById('gameshop').style.visibility = 'visible';
            // fire button
            document.getElementById('fire').style.visibility = 'visible';
            // callback for next level
            aCallback();
            // show canvas
            SC.canvas.style.backgroundPosition = (-SC.ship.x / 2).toFixed(0) + 'px ' + (-SC.ship.y / 2).toFixed(0) + 'px';
            SC.context.clearRect(0, 0, SC.w, SC.h);
            SC.canvas.style.display = 'block';
            // handle pending purchases
            console.log('Play2');
        });
        buttons.appendChild(start);
    }

    // paragraphs (image + text)
    for (i = 0; i < aImageAndTexts.length; i++) {
        // image
        if (aImageAndTexts[i].image) {
            img = document.createElement('img');
            img.className = "icon";
            img.src = aImageAndTexts[i].image;
            if (!aImageAndTexts[i].pixelate) {
                img.style.imageRendering = 'unset';
            }
            bg.appendChild(img);
        }

        // text
        if (aImageAndTexts[i].text) {
            p = document.createElement('p');
            p.style.marginTop = 0;
            p.innerHTML = aImageAndTexts[i].text;
            bg.appendChild(p);
        }

        // clearfix
        clearFix = document.createElement('div');
        clearFix.style.clear = 'left';
        bg.appendChild(clearFix);
    }

    if (aTitle === 'Congratulation!') {
        // restart
        restart = document.createElement('button');
        restart.textContent = 'New game';
        restart.className = 'restart';
        restart.addEventListener('click', function () {
            bg.parentNode.removeChild(bg);
            SC.restart();
        });
        restart.style.marginBottom = '90vh';
        bg.appendChild(restart);
    }

    // add intro element to body
    document.body.appendChild(bg);

    // timer for animating background (too slow, hard to read)
    /*
    var bgOffset = 0;
    var bgTimer = setInterval(function () {
        bgOffset -= 1;
        bg.style.backgroundPositionX = bgOffset + 'px';
    }, 50);
    */

    // hide canvas
    SC.canvas.style.display = 'none';
    bg.display = 'block';
};

