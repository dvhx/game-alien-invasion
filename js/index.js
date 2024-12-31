// main window
"use strict";
// globals: Image, window, document, clearInterval, setInterval, setTimeout, navigator

var SC = window.SC || {};

SC.canvas = null;
SC.context = null;
SC.cx = SC.w / 2;
SC.cy = SC.h / 2;
SC.earth = new Image();
SC.earth.src = 'image/earth.png';
SC.compass = new Image();
SC.compass.src = 'image/compass.png';
SC.compass_dummy = new Image();
SC.compass_dummy.src = 'image/compass_dummy.png';

function purge() {
    // Clear all storage and restart
    SC.storage.eraseAll();
    document.location.reload();
}

SC.isPhone = function () {
    // Return true if this is run on phone, then it will talk about "touching" instead of "clicking"
    return false;
};

SC.onResize = function () {
    // resize canvas
    console.log('SC.onResize', window.innerWidth, window.innerHeight);
    SC.w = window.innerWidth; // SC.canvas.clientWidth;
    SC.h = window.innerHeight; // SC.canvas.clientHeight;
    SC.canvas.width = SC.w;
    SC.canvas.height = SC.h;
    SC.cx = SC.w / 2;
    SC.cy = SC.h / 2;
};

SC.deadTime = 0;

SC.restart = function () {
    // restart game from first level
    // hide touchpad
    SC.touchpad.hide();
    // hide in-game shop
    document.getElementById('gameshop').style.visibility = 'hidden';
    // hide fire button
    document.getElementById('fire').style.visibility = 'hidden';
    // center ship
    SC.kills = 0;
    SC.ship.reset();
    SC.touchpad.x = 0;
    SC.touchpad.y = 0;
    SC.credits.credits = [];
    SC.deadTime = 0;
    SC.credits.credits = [];
    SC.credits.creditsCount = 0;
    // clear canvas
    SC.canvas.style.backgroundPosition = (-SC.ship.x / 2).toFixed(0) + 'px ' + (-SC.ship.y / 2).toFixed(0) + 'px';
    document.body.style.backgroundPosition = (-SC.ship.x / 4).toFixed(0) + 'px ' + (-SC.ship.y / 4).toFixed(0) + 'px';
    SC.context.clearRect(0, 0, SC.w, SC.h);
    //SC.canvas.style.display = 'block';
    // intro
    SC.level = -1;
    SC.newLevel();
};

SC.gameOver = function () {
    // Show game over dialog with IAP choice
    SC.pause = true;
};

SC.revive = function (aBonus) {
    // Revive ship after death
    window.onclick = null;
    SC.pause = true;
    SC.ship.life = 1e9;
    SC.ship.dx = 0;
    SC.ship.dy = 0;
    SC.ship.dxKey = 0;
    SC.ship.dyKey = 0;
    SC.touchpad.x = 0;
    SC.touchpad.y = 0;
    SC.deadTime = 0;
    SC.aliens.freeze();
    SC.aliens.spread(200);
    // after second show touchpad
    setTimeout(function () {
        SC.ship.dx = 0;
        SC.ship.dy = 0;
        SC.ship.dxKey = 0;
        SC.ship.dyKey = 0;
        SC.touchpad.x = 0;
        SC.touchpad.y = 0;
        SC.touchpad.showIfNeeded();
    }, 1000);
    // after 3 seconds restore life
    setTimeout(function () {
        SC.ship.life = aBonus || 300;
        SC.pause = false;
    }, 10000);
};

SC.onInterval = function () {
    // main refresh interval
    if (SC.pause) {
        return;
    }

    // utilization counter
    var t1 = Date.now(), t2, dt;

    // ship touchpad movement
    SC.ship.dx = SC.touchpad.x * SC.ship.maxSpeed;
    SC.ship.dy = SC.touchpad.y * SC.ship.maxSpeed;
    if (SC.ship.dx !== 0 || SC.ship.dy !== 0) {
        SC.ship.angle = Math.atan2(SC.ship.dy, SC.ship.dx) + Math.PI / 2;
    }

    // ship WASD movement, update background if necessary
    if (SC.ship.wasd()) {
        //SC.canvas.style.backgroundPositionX = (-SC.ship.x / 2).toFixed(0) + 'px';
        //SC.canvas.style.backgroundPositionY = (-SC.ship.y / 2).toFixed(0) + 'px';
        SC.canvas.style.backgroundPosition = (-SC.ship.x / 2).toFixed(0) + 'px ' + (-SC.ship.y / 2).toFixed(0) + 'px';
        document.body.style.backgroundPosition = (-SC.ship.x / 4).toFixed(0) + 'px ' + (-SC.ship.y / 4).toFixed(0) + 'px';
    }

    // clear canvas
    SC.context.clearRect(0, 0, SC.w, SC.h);

    // earth
    SC.context.save();
    SC.context.translate(SC.cx - SC.ship.x, SC.cy - SC.ship.y);
    SC.context.drawImage(SC.earth, -32.5, -32.5);
    SC.context.restore();

    // compass
    SC.context.save();
    SC.context.translate(SC.cx, SC.cy);
    SC.context.rotate(Math.atan2(-SC.ship.y, -SC.ship.x));
    SC.context.globalAlpha = Math.min(0.5, (SC.ship.x * SC.ship.x + SC.ship.y * SC.ship.y) / SC.cx / SC.cy);
    SC.context.drawImage(SC.compass, -8 + 20, -8);
    SC.context.globalAlpha = 1.0;
    SC.context.restore();

    // compass - point to first dummy
    if (SC.aliens.aliens.length > 0) {
        SC.context.save();
        SC.context.translate(SC.cx, SC.cy);
        SC.context.rotate(Math.atan2(SC.aliens.aliens[0].y - SC.ship.y, SC.aliens.aliens[0].x - SC.ship.x));
        //SC.context.globalAlpha = Math.min(0.5,(ship.x*ship.x+ship.y*ship.y)/SC.cx/SC.cy);
        SC.context.drawImage(SC.compass_dummy, -8 + 20, -8);
        SC.context.globalAlpha = 1.0;
        SC.context.restore();
    }

    // draw game objects
    SC.ship.draw(SC.context);
    SC.aliens.draw(SC.context);
    SC.shots.draw(SC.context);
    SC.credits.draw(SC.context);

    // level info
    if ((SC.aliens.aliens.length === 0) && (SC.ship.life > 0) && (SC.level >= 0)) {
        SC.context.font = "16pt courier";
        SC.context.fillStyle = "rgba(0,255,0,1)";
        SC.context.textAlign = "center";
        SC.context.fillText("Level", SC.cx, SC.cy - 20);
        SC.context.fillText("completed", SC.cx, SC.cy + 35);
        //if (SC.level < SC.levels.length - 2) {
        //    SC.context.fillText("Prepare for level " + (SC.level + 2), SC.cx, SC.cy + 35);
        //}
    }
    SC.context.font = "16pt courier";
    SC.context.fillStyle = "rgba(0,255,0,1)";
    SC.context.textAlign = "center";
    SC.context.fillText("Level " + (SC.level + 1), SC.cx, 20);

    // aliens left
    if (SC.aliens.aliens.length > 0) {
        SC.context.font = "12pt courier";
        SC.context.fillStyle = "rgba(0,255,0,0.7)";
        SC.context.textAlign = "center";
        SC.context.fillText(SC.aliens.aliens.length + " alien" + (SC.aliens.aliens.length > 1 ? 's' : ''), SC.cx, 40);
    }

    // aliens killed
    if (SC.aliens.aliens.length > 0) {
        SC.context.font = "9pt courier";
        SC.context.fillStyle = "rgba(255,70,70,0.9)";
        SC.context.textAlign = "center";
        SC.context.fillText(SC.kills + " kills", SC.cx, 55);
    }

    // collisions with objects and shots
    SC.aliensHit();

    // game over?
    if (SC.ship.life <= 0) {
        SC.context.save();
        if (SC.deadTime > 0) {
            SC.context.font = "20pt fixed";
            SC.context.textAlign = "center";
            SC.context.fillStyle = "rgba(0,0,0,0.7)";
            SC.context.fillRect(SC.cx - 150, SC.cy - 15 - 10, 2 * 150, 2 * 15 + 5);
            SC.context.font = "20pt fixed";
            SC.context.fillStyle = "rgb(255,0,0)";
            SC.context.fillText("You just lost the game", SC.cx, SC.cy);
            SC.context.fillStyle = "rgb(0,255,0)";
        }
        SC.deadTime++;

        // click to restart
        if (SC.deadTime >= 50) {
            window.onclick = function () {
                window.onclick = null;
                SC.restart();
            };
            SC.context.font = "20pt fixed";
            SC.context.fillStyle = "rgba(0,0,0,0.7)";
            SC.context.fillRect(SC.cx - 100, SC.cy + 40 - 15 - 10, 2 * 100, 2 * 15 + 5);
            SC.context.fillStyle = "rgb(0,255,0)";
            SC.context.fillText("Click to restart", SC.cx, SC.cy + 40);
        }

        SC.context.restore();
        document.getElementById('fire').style.visibility = 'hidden';
        SC.touchpad.hide();
        /*
        if (SC.deadTime === 50) {
            SC.gameOver();
        }
        */
    }

    // calculate utilization
    if (SC.showFps) {
        t2 = Date.now();
        dt = Math.round(100 * (t2 - t1) / (1000 / SC.FPS));
        if (dt < 10) {
            dt = '0' + dt;
        }
        SC.context.font = "bold 9pt courier";
        SC.context.textAlign = "left";
        SC.context.fillStyle = "#888";
        SC.context.fillText(dt + '%', 4, 10);
        SC.context.font = "9pt courier";
    }
};

SC.onKeyDown = function (event) {
    // press key
    if (SC.inInput) {
        return;
    }
    SC.key[event.keyCode] = true;
    if (!SC.pause && ([37, 38, 39, 40].indexOf(event.keyCode) >= 0)) {
        event.preventDefault();
    }
    if (SC.pause && (event.key === 'm')) {
        SC.music.stop();
    }
};

SC.onKeyUp = function (event) {
    // release key
    if (SC.inInput) {
        return;
    }
    SC.key[event.keyCode] = false;
    // pause on/off?
    if (event.keyCode === 80) {
        SC.pause = !SC.pause;
    }
};

SC.onGameShop = function () {
    // show shop in game
    if (SC.ship.life > 0) {
        SC.pause = true;
        SC.touchpad.hide();
        SC.shop(function () {
            SC.pause = false;
            SC.touchpad.showIfNeeded();
        });
    }
};

SC.shakeLast = 0;

SC.shake = function (aCount) {
    // Shake screen and play big explosion sound
    aCount = aCount || 10;
    SC.sound.play('explosion2');
    function one() {
        aCount *= 0.7;
        if (aCount > 1) {
            //console.log(aCount * (Math.random() - 0.5));
            SC.canvas.style.left = 5 * (aCount * (Math.random() - 0.5)) + 'px';
            SC.canvas.style.top = 5 * (aCount * (Math.random() - 0.5)) + 'px';
            setTimeout(one, 30);
        } else {
            SC.canvas.style.left = '0px';
            SC.canvas.style.top = '0px';
        }
    }
    if (Date.now() - SC.shakeLast > 1000) {
        SC.shakeLast = Date.now();
        one();
    }
};

// initialize window
window.addEventListener('DOMContentLoaded', function () {
    // canvas
    SC.canvas = document.getElementById('canvas');
    SC.context = SC.canvas.getContext('2d');
    // keyboard controls (only for debugging)
    window.addEventListener('keydown', SC.onKeyDown, true);
    window.addEventListener('keyup', SC.onKeyUp, true);
    // fire
    SC.shots.autofire('fire');

    // window resize event
    window.addEventListener('resize', function () {
        SC.onResize();
    });
    SC.onResize();

    // touchpad
    SC.touchpad = SC.touchpad('image/dpad128.png', SC.onTouchpad, true);
    //SC.touchpad.img.style.left = '1ex';
    //SC.touchpad.img.style.bottom = '1ex';
    SC.touchpad.hide();

    // debug
    //SC.level = 8; SC.newLevel();
    //SC.sampleLevel();
    //SC.god();

    // first level
    SC.newLevel();
    setInterval(SC.onInterval, 50);
    console.log('aliens:', SC.aliens.aliens.length);

    // shop
    document.getElementById('gameshop').addEventListener('click', SC.onGameShop);

    SC.sound.add('pew', 6);
    SC.sound.add('explosion', 6);
    SC.sound.add('explosion2', 1);

    SC.music.add('Gravity_Sound__No_Patience');
    if (SC.ship.music) {
        //SC.music.playOnFirstGesture('Gravity_Sound__No_Patience');
    }
});

SC.god = function () {
    // enable god mode
    SC.ship.magnet = 1000;
    SC.ship.life = 1e12;
    SC.ship.credit = 999999;
    SC.ship.beams = 200;
    SC.ship.spread = 36;
    SC.ship.range = 470;
    SC.ship.penetration = 15;
    SC.ship.rate = 600;
    SC.ship.maxSpeed = 5;
};

SC.promo1 = function () {
    // enable promo mode
    SC.credits.explode(-100, -100, 10);
    SC.credits.explode(-80, -50, 20);
    SC.credits.explode(130, 150, 30);
    SC.ship.life = 1e9;
    SC.ship.beams = 1;
    SC.ship.spread = 1;
    SC.ship.range = 200;
    SC.ship.penetration = 2;
    SC.ship.rate = 300;
    SC.ship.maxSpeed = 8;
    //setInterval(function () {
    SC.ship.x = 60;
    SC.ship.y = 20;
    SC.touchpad.x = 0.001;
    SC.touchpad.y = -0.002;
    //}, 1000);
    setTimeout(function () {
        setInterval(function () {
            SC.shots.promo();
        }, 200);
    }, 3000);
    document.getElementById('fire').style.bottom = '5ex';
    SC.aliens.add(SC.alienDummy, 15);
    var i, m;
    for (i = 0; i < SC.aliens.aliens.length; i++) {
        SC.aliens.aliens[i].dx = 0;
        SC.aliens.aliens[i].dy = 0;
    }
    m = SC.alienDummy();
    m.x = 100;
    m.y = -40;
    m.dx = 0;
    m.dy = 0;
    m.life = 1e9;
    SC.aliens.aliens.push(m);
};

SC.promo2 = function (aMultiplier) {
    // enable promo mode
    aMultiplier = aMultiplier || 1;
    SC.ship.magnet = 600;
    SC.ship.life = 1e9;
    SC.ship.credit = 43256;
    SC.ship.beams = 3;
    SC.ship.spread = 5;
    SC.ship.range = 200 * aMultiplier;
    SC.ship.penetration = 2 * aMultiplier;
    SC.ship.rate = 300;
    SC.ship.maxSpeed = 8;
    setInterval(function () {
        SC.touchpad.y = Math.random() - Math.random();
        SC.touchpad.x = Math.random() - Math.random();
    }, 1000);
    setInterval(function () {
        SC.shots.promo();
    }, 200 / aMultiplier);
    document.getElementById('fire').style.bottom = '5ex';
    SC.level = 8;
    SC.aliens.add(SC.alienFollower, 15 * aMultiplier);
    SC.aliens.add(SC.alienMummy, 5 * aMultiplier);
    SC.aliens.add(SC.alienFummy, 5 * aMultiplier);
    SC.aliens.add(SC.alienCannon, 5 * aMultiplier);
    SC.aliens.add(SC.alienRock, 5 * aMultiplier);
    SC.aliens.add(SC.alienStealer, 5 * aMultiplier);
    SC.aliens.add(SC.alienLauncher, 5 * aMultiplier);
};

SC.promo3 = function () {
    // enable promo mode
    SC.ship.magnet = 1600;
    SC.ship.life = 1e9;
    SC.ship.credit = 143256;
    SC.ship.beams = 300;
    SC.ship.spread = 36;
    SC.ship.range = 600;
    SC.ship.penetration = 15;
    SC.ship.rate = 300;
    SC.ship.maxSpeed = 8;
    setInterval(function () {
        SC.touchpad.y = Math.random() - Math.random();
        SC.touchpad.x = Math.random() - Math.random();
    }, 1000);
    setInterval(function () {
        SC.shots.promo();
    }, 150);
    document.getElementById('fire').style.bottom = '5ex';
    SC.level = 13;
    SC.aliens.add(SC.alienLauncher, 500);
};

SC.sampleLevel = function () {
    // sample level
    SC.aliens.clear();
    SC.ship.life = 1e9;
    SC.ship.spread = 36;
    SC.ship.rate = 600;
    SC.ship.penetration = 3;
    SC.ship.magnet = 100;
    SC.ship.beams = 130;
    SC.touchpad.show();
    SC.canvas.style.display = 'block';
    // show in-game shop
    document.getElementById('gameshop').style.visibility = 'visible';
    // fire button
    document.getElementById('fire').style.visibility = 'visible';
    setTimeout(function () {
        document.getElementsByClassName('start')[0].click();
    }, 500);
    setTimeout(function () {
        SC.aliens.aliens.splice(2, 20);
        SC.aliens.add(SC.alienMummy, 120);
    }, 3500);
};
