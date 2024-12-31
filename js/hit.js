// Detect when shots hits the aliens
"use strict";
// globals: setTimeout

var SC = window.SC || {};

SC.kills = 0;

SC.aliensHit = function () {
    // detect weather aliens was hit by my shots
    // for all
    var d, dummy_removed, dx, dy, s, sx, sy, r;
    for (d = SC.aliens.aliens.length - 1; d >= 0; d--) {
        // shrapnels age even without contact with shot so they should be removed
        if (SC.aliens.aliens[d].life <= 0) {
            SC.aliens.aliens.splice(d, 1);
            if (SC.aliens.aliens.length === 0) {
                SC.credits.implodeAll();
                setTimeout(SC.newLevel, 3000);
            }
            continue;
        }
        dummy_removed = false;
        dx = SC.aliens.aliens[d].x;
        dy = SC.aliens.aliens[d].y;
        // for all shots
        for (s = SC.shots.shots.length - 1; s >= 0; s--) {
            if (dummy_removed) {
                break;
            }
            sx = SC.shots.shots[s].x;
            sy = SC.shots.shots[s].y;
            // simple distance calculation
            r = Math.abs(dx - sx) + Math.abs(dy - sy);
            // hit?
            if (r < SC.aliens.aliens[d].size) {
                // shot suck aliens life
                if (SC.shots.shots[s].size > 0) {
                    SC.aliens.aliens[d].life -= SC.shots.shots[s].speed * SC.shots.shots[s].size;
                }
                //document.title = 'hit by r='+Math.round(r)+' dl='+aliens.aliens[d].life;
                // remove dead aliens
                if (SC.aliens.aliens[d].life <= 0) {
                    // add bunch of credits in the place of dead dummy
                    SC.credits.explode(SC.aliens.aliens[d].x, SC.aliens.aliens[d].y, SC.aliens.aliens[d].credit);
                    // add some shrapnels to alien explosion
                    if (SC.aliens.aliens[d].shrapnel > 0) {
                        SC.alienShrapnels(SC.aliens.aliens[d].shrapnel, SC.aliens.aliens[d].x, SC.aliens.aliens[d].y);
                    }
                    // add shake
                    if (SC.aliens.aliens[d].shake) {
                        SC.shake();
                    }
                    // remove dummy
                    dummy_removed = true;
                    SC.aliens.aliens.splice(d, 1);
                    SC.kills++;
                    // credits for killed aliens
                    SC.ship.credit += SC.ship.credit_multiplier;
                    // if we defeated all aliens, start new level
                    if (SC.aliens.aliens.length === 0) {
                        SC.credits.implodeAll();
                        setTimeout(SC.newLevel, 3000);
                    }
                }
                // remove shots because of it's low penetration
                // when hit, decrease their size (we use negative shot size for harmless blood splatter)
                SC.shots.shots[s].size--;
                // slow them down
                SC.shots.shots[s].dx *= 0.9;
                SC.shots.shots[s].dy *= 0.9;
            }
        }
    }
};

