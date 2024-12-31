// Buying ship improvements in shop
"use strict";
// globals: document

var SC = window.SC || {};

SC.shopCurrent = null;

SC.shop = function (aCloseCallback) {
    // Display shop
    if (SC.ship.life <= 0) {
        console.log('You are dead');
        return;
    }
    var bg, nav, back, h1, credit, credit_label;

    function close() {
        // close shop
        bg.parentElement.removeChild(bg);
        if (typeof aCloseCallback === 'function') {
            aCloseCallback();
        }
        SC.shopCurrent = null;
    }

    // background
    bg = document.createElement('div');
    bg.id = 'shop';
    document.body.appendChild(bg);

    // top menu
    nav = document.createElement('nav');
    bg.appendChild(nav);
    // back
    back = document.createElement('button');
    back.className = 'back';
    back.addEventListener('click', close);
    nav.appendChild(back);
    // title
    h1 = document.createElement('h1');
    h1.textContent = 'Shop';
    nav.appendChild(h1);
    // credit button
    credit = document.createElement('button');
    credit.className = 'credit';
    credit.onclick = SC.onCreditClick;
    nav.appendChild(credit);
    // credit label
    credit_label = document.createElement('div');
    credit_label.textContent = '?';
    credit.appendChild(credit_label);

    function updateCredit() {
        // credit label
        credit_label.textContent = SC.ship.credit + '🌟';
        // update color of buy buttons
        var i, btn = bg.getElementsByClassName('buy');
        for (i = 0; i < btn.length; i++) {
            if (btn[i].dataPrice <= SC.ship.credit) {
                btn[i].classList.add('available');
                btn[i].classList.remove('notavailable');
            } else {
                btn[i].classList.remove('available');
                btn[i].classList.add('notavailable');
            }
        }
        // also update in intro shop button
        if (SC.shopButtonCredit) {
            SC.shopButtonCredit.textContent = 'You have ' + SC.ship.credit + '🌟';
        }
    }
    updateCredit();

    function plural(aUnit) {
        // return correct plural (beams, cannons)
        switch (aUnit.trim()) {
        case "cannon":
            return SC.ship.spread > 1 ? " cannons" : aUnit;
        case "beam":
            return SC.ship.beams > 1 ? " beams" : aUnit;
        }
        return aUnit;
    }

    function onBuy(event) {
        // buy item user clicked on
        var key = event.target.dataKey,
            increase = event.target.dataIncrease,
            now = event.target.dataNow,
            unit = event.target.dataUnit,
            price = event.target.dataPrice;
        if (SC.ship.credit < price) {
            return;
        }

        // music is on/off
        if (key === 'music') {
            SC.ship.music = !SC.ship.music;
            if (SC.ship.music) {
                SC.music.play('Gravity_Sound__No_Patience');
            } else {
                SC.music.stop('Gravity_Sound__No_Patience');
            }
            SC.storage.writeBoolean('SC.ship.music', SC.ship.music);
            now.textContent = 'Now: ' + (SC.ship[key] ? 'playing' : 'silent');
        } else {
            // simple buy
            SC.ship[key] += increase;
            now.textContent = 'Now: ' + SC.ship[key] + plural(unit);
        }
        // update credit
        SC.ship.credit -= price;
        updateCredit();
    }

    function item(aImage, aKey, aName, aDescription, aPrice, aIncrease, aUnit) {
        // show single item
        var article, img, p, name, desc, button, now, next;
        // div
        article = document.createElement('article');
        bg.appendChild(article);
        // image
        img = document.createElement('img');
        img.src = aImage;
        article.appendChild(img);

        // p
        p = document.createElement('p');
        article.appendChild(p);
        // name
        name = document.createElement('b');
        name.textContent = aName;
        p.appendChild(name);
        // description
        desc = document.createElement('span');
        desc.textContent = aDescription + '. ';
        p.appendChild(desc);
        // now
        now = document.createElement('span');
        if (aKey === 'music') {
            now.textContent = 'Now: ' + (SC.ship[aKey] ? 'playing' : 'silent');
        } else {
            now.textContent = 'Now: ' + SC.ship[aKey] + plural(aUnit);
        }
        now.className = 'now';
        p.appendChild(now);
        // next
        next = document.createElement('span');
        next.textContent = 'Price: ' + aPrice + '🌟 (+' + aIncrease + plural(aUnit) + ')';
        next.className = 'next';
        p.appendChild(next);
        // button
        button = document.createElement('button');
        button.textContent = 'Buy';
        button.className = 'buy ' + (SC.ship.credit >= aPrice ? 'available' : 'notavailable');
        button.dataKey = aKey;
        button.dataIncrease = aIncrease;
        button.dataNow = now;
        button.dataUnit = aUnit;
        button.dataPrice = aPrice;
        button.onclick = onBuy;
        article.appendChild(button);
        // price
        //price = document.createElement('div');
        //price.textContent = '🌟' + aPrice;
        //button.appendChild(price);
    }

    // effects
    (function () {
        var div, label, bottom, range;
        /*config = {
            0: { name: 'none', credit: 10, spatter: 3, beam: 3, sound: false },
            1: { name: 'minimum', credit: 5, spatter: 30, beam: 20, sound: true },
            2: { name: 'average', credit: 3, spatter: 300, beam: 50, sound: true },
            3: { name: 'maximum', credit: 1, spatter: 1000, beam: 1000, sound: true }
        };
        */
        div = document.createElement('div');
        div.className = 'effects';

        label = document.createElement('label');
        label.textContent = 'Effects';
        div.appendChild(label);

        range = document.createElement('input');
        div.appendChild(range);

        bottom = document.createElement('label');
        div.appendChild(bottom);

        SC.effects.range(range, bottom);

        bg.appendChild(div);
    }());

    // shop items
    item('image/buy/life.png', 'life', 'Repair', 'Repair your ship and refill shields energy', 150, 100, '%');
    item('image/buy/range.png', 'range', 'Range', 'Increase range of your cannons, this will keep enemies at distance', 200, 20, 'km');
    item('image/buy/spread.png', 'spread', 'Cannon', 'Buying more cannons make it easier to hit the enemy', 250, 1, ' cannon');
    item('image/buy/rate.png', 'rate', 'Fire rate', 'Increase fire rate to hit more enemies', 280, 50, 'rpm');
    item('image/buy/speed.png', 'maxSpeed', 'Engine', 'Better engine makes your ship faster', 300, 2, 'km/s');
    item('image/buy/magnet.png', 'magnet', 'Magnet', 'Increase the range of magnetic beam to collect more 🌟', 500, 10, 'km');
    item('image/buy/credit.png', 'credit_multiplier', 'Credit multiplier', 'Increase the amount of money you get from every collected 🌟', 5000, 1, 'x');
    item('image/buy/penetration.png', 'penetration', 'Bullet size', 'Increase size of the bullet. Multiple enemies can be hit at once', 1000, 1, '0 caliber');
    item('image/buy/beam.png', 'beams', 'Multiple beams', 'Add multiple magnetic beams so that you collect 🌟 faster', 12000, 1, ' beam');
    item('image/buy/music.png', 'music', 'Turn music on/off', 'Is the soundtrack getting on your nerves? Pay to make it go away.', 50, 1, ' music');

    // another back button on the bottom
    back = document.createElement('button');
    back.className = 'back';
    back.addEventListener('click', close);
    bg.appendChild(back);

    SC.shopCurrent = {
        credit: credit_label,
        updateCredit: updateCredit,
        bg: bg
    };
};

