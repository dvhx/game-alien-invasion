// Levels design (just counts for different alien types for every level + intro)
"use strict";
// globals: document, setTimeout

var SC = window.SC || {};

SC.level = -1;

SC.newLevel = function () {
    // show intro and switch to new level
    if (SC.ship.life <= 0) {
        return false;
    }

    // clear aliens
    SC.aliens.clear();

    // move ship back to center
    SC.pause = false;
    SC.ship.x = 0;
    SC.ship.y = 0;
    SC.ship.dx = 0;
    SC.ship.dx = 0;
    SC.touchpad.x = 0;
    SC.touchpad.y = 0;

    // stop wasd movement
    SC.key = [];
    // stop shooting
    SC.shots.mouseStopShooting();
    SC.shots.shots = [];

    // increase level
    SC.level++;

    // last level completed?
    if (SC.level > SC.levels.length - 1) {
        throw 'No more levels!';
    }

    // Show touch controls
    SC.touchpad.showIfNeeded();

    // level intro
    SC.intro(
        SC.levels[SC.level].title,
        SC.levels[SC.level].message,
        function () {
            // enemies for next level
            //console.log('enemies', SC.levels[SC.level].enemies);
            SC.aliens.clear();
            SC.aliens.add(SC.alienDummy, SC.levels[SC.level].enemies.dummy);
            SC.aliens.add(SC.alienFollower, SC.levels[SC.level].enemies.follower);
            SC.aliens.add(SC.alienTurret, SC.levels[SC.level].enemies.turret);
            SC.aliens.add(SC.alienMummy, SC.levels[SC.level].enemies.mummy);
            SC.aliens.add(SC.alienFummy, SC.levels[SC.level].enemies.fummy);
            SC.aliens.add(SC.alienCannon, SC.levels[SC.level].enemies.cannon);
            SC.aliens.add(SC.alienRock, SC.levels[SC.level].enemies.rock);
            SC.aliens.add(SC.alienStealer, SC.levels[SC.level].enemies.stealer);
            SC.aliens.add(SC.alienLauncher, SC.levels[SC.level].enemies.launcher);
            SC.pause = false;
        }
    );
};

SC.levels = [
    {
        title: 'Alien invasion!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'Unidentified flying objects suddenly appeared on Earth\'s orbit! Mankind united and created super space ship - our last hope to destroy aliens before they anihilate human race. Use ' + (SC.isPhone() ? 'on screen <b>arrows</b> for movement, <b>fire</b> button for <b>shooting</b>.' : '<b>W, A, S, D</b> for movement and <b>left mouse button</b> for shooting.<div style="display: flex; justify-content: center; "><img src="image/wasd.png" /></div>') },
            { image: 'image/dummy/dummy0.png', pixelate: true, text: 'These aliens seems to aimlessly wander in our airspace, we call them <b>dummies</b>, but don\'t get fooled by them. <b>Don\'t get near them</b> or they will destroy your ship. Keep them at distance and destroy them!' },
            { image: 'image/credit.png', pixelate: true, text: 'When you destroy aliens, they will drop some stars (🌟), go <b>near</b> it and <b>magnetic beam</b> will collect it . When you collect enough  🌟 you can improve your ship by buying upgrades in <b>shop</b>.' }
        ],
        enemies: {
            dummy: 10,
            follower: 0,
            turret: 0,
            mummy: 0,
            fummy: 0,
            cannon: 0,
            rock: 0,
            stealer: 0,
            launcher: 0
        },
        revive: 150
    },

    {
        title: 'Level 1 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'Good work pilot! You saved earth for one more day, but it won\'t be always this easy, because aliens just changed their tactics.' },
            { image: 'image/rock/rock0.png', pixelate: true, text: 'They brought asteroids to earth orbit. They want to use them for kinetic bombardment of the Earth. You must destroy them as well. Be carefull tho, when they hit your ship you\'ll die. Sometimes they try to hide them further away from earth, follow green arrow to locate remaining enemy.' },
            { image: 'image/shrapnel.png', pixelate: true, text: 'Unlike jelly-like dummies, space rocks are hard and when you destroy them, they create bunch of shrapnels which can damage the ship. Shoot them from far away to minimize the risk of damage of your ship.' }
        ],
        enemies: {
            dummy: 12,
            rock: 5,
            follower: 0,
            turret: 0,
            mummy: 0,
            fummy: 0,
            cannon: 0,
            stealer: 0,
            launcher: 0
        },
        revive: 200
    },

    {
        title: 'Level 2 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'You got some luck rookie. But we are in trouble now. It seems that aliens are more advanced than we thought.' },
            { image: 'image/follower/follower0.png', pixelate: true, text: 'This new type of alien is real beast. They are fast and they will follow you anywhere. You should shoot them first or they will chase you down. Oh, and by the way, they are made from pure ruby so prepare for some ultra hard shrapnels.' }
        ],
        enemies: {
            dummy: 14,
            rock: 6,
            follower: 4,
            turret: 0,
            mummy: 0,
            fummy: 0,
            cannon: 0,
            stealer: 0,
            launcher: 0
        },
        revive: 300
    },

    {
        title: 'Level 3 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'You made it. I am starting to think you got some talent pilot! But I have a bad news for you. They can multiply!' },
            { image: 'image/mummy/mummy0.png', pixelate: true, text: 'Sending bunch of aliens apparently isn\'t enough. We call this new type "mummy", because it can spawn new dummies. On top of that, they are hard as nail, but we believe they can be killed. Shoot them first before their offspring overpower you.' }
        ],
        enemies: {
            dummy: 16,
            rock: 7,
            follower: 6,
            turret: 0,
            mummy: 4,
            fummy: 0,
            cannon: 0,
            stealer: 0,
            launcher: 0
        },
        revive: 400
    },

    {
        title: 'Level 4 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'You deserve some medal my friend. Keep up the good work. But there is always some complications!' },
            { image: 'image/stealer/stealer0.png', pixelate: true, text: 'Aliens noticed we are collecting the 🌟 they drops, so they created new type of alien. Itself, it is harmless, but it will search and collect every 🌟 it can find. It is even tougher than mummy! Kill it first. If you don\'t kill it, we will run out of resources soon an that will be the end.' }
        ],
        enemies: {
            dummy: 18,
            rock: 8,
            follower: 8,
            turret: 0,
            mummy: 5,
            fummy: 0,
            cannon: 0,
            stealer: 3,
            launcher: 0
        },
        revive: 500
    },

    {
        title: 'Level 5 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'Uff, now that was close. Keep collecting as much 🌟 as you can, cause things about to get realy bad.' },
            { image: 'image/fummy/fummy0.png', pixelate: true, text: 'Somehow they managed to mass produce ruby at such speed that they can now spawn followers in Earth\'s orbit. This is <b>fummy</b>, mother of followers. Their offspring will hunt you down forever, unless you shoot fummy first!' }
        ],
        enemies: {
            dummy: 20,
            rock: 9,
            follower: 10,
            turret: 0,
            mummy: 6,
            fummy: 4,
            cannon: 0,
            stealer: 5,
            launcher: 0
        },
        revive: 600
    },

    {
        title: 'Level 6 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'Good news is that you survived. You are now real pro. Now for the bad news...' },
            { image: 'image/turret/turret0.png', pixelate: true, text: 'Aliens copied our cannons and now they are able to shoot. We call this new beast <b>turret</b>. It doesn\'t seems to be firing at our ships, but it shoots anyway so destroy it before it hits you by pure luck!' }
        ],
        enemies: {
            dummy: 20,
            rock: 10,
            follower: 10,
            turret: 4,
            mummy: 6,
            fummy: 4,
            cannon: 0,
            stealer: 5,
            launcher: 0
        },
        revive: 600
    },

    {
        title: 'Level 7 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'I knew it, nobody can hit our best pilot! Well, maybe until now.' },
            { image: 'image/cannon/cannon0.png', pixelate: true, text: 'Aliens learned how to aim and their turrets evolved into <b>cannons</b>, they will aim directly at you and shoot. If you keep moving, you should be alright.' }
        ],
        enemies: {
            dummy: 20,
            rock: 10,
            follower: 10,
            turret: 4,
            mummy: 6,
            fummy: 4,
            cannon: 4,
            stealer: 5,
            launcher: 0
        },
        revive: 800
    },

    {
        title: 'Level 8 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'You are still alive man, so prepare for the final beast.' },
            { image: 'image/launcher/launcher0.png', pixelate: true, text: 'This is launcher. It fires homing missiles. You can run, but you can\'t hide. No matter how fast you run, they will hit you. Be brave!' }
        ],
        enemies: {
            dummy: 20,
            rock: 10,
            follower: 10,
            turret: 4,
            mummy: 6,
            fummy: 4,
            cannon: 4,
            stealer: 5,
            launcher: 4
        },
        revive: 1000
    },

    {
        title: 'Level 9 completed!',
        message: [
            { image: 'image/ship48.png', pixelate: false, text: 'You saved the earth from alien invasion. I wish there was more to say but there is not, really. Now you can go back to boring work or clean those dishes you promised to clean 5 minutes ago.' },
            { image: 'image/dummy/dummy0.png', pixelate: true, text: 'Or... You can try to beat next level. 20 enemies of every kind!' }
        ],
        enemies: {
            dummy: 20,
            rock: 20,
            follower: 20,
            turret: 20,
            mummy: 20,
            fummy: 20,
            cannon: 20,
            stealer: 20,
            launcher: 20
        },
        revive: 2000
    },

    {
        title: 'Level 10 completed!',
        message: [
            { image: 'image/dummy/dummy0.png', pixelate: true, text: 'Either you are cheater or you are really really good. What about 50 of each!' }
        ],
        enemies: {
            dummy: 50,
            rock: 50,
            follower: 50,
            turret: 50,
            mummy: 50,
            fummy: 50,
            cannon: 50,
            stealer: 50,
            launcher: 50
        },
        revive: 3000
    },

    {
        title: 'Level 11 completed!',
        message: [
            { image: 'image/dummy/dummy0.png', pixelate: true, text: 'I\'m not finished. I swear 100 will do it!' }
        ],
        enemies: {
            dummy: 100,
            rock: 100,
            follower: 100,
            turret: 100,
            mummy: 100,
            fummy: 100,
            cannon: 100,
            stealer: 100,
            launcher: 100
        },
        revive: 6000
    },

    {
        title: 'Final level!',
        message: [
            { image: 'image/launcher/launcher0.png', pixelate: true, text: 'One thousand launchers!' }
        ],
        enemies: {
            dummy: 0,
            rock: 0,
            follower: 0,
            turret: 0,
            mummy: 0,
            fummy: 0,
            cannon: 0,
            stealer: 0,
            launcher: 1000
        },
        revive: 10000
    },

    {
        title: 'Congratulation!',
        message: [
            { image: 'image/earth.png', pixelate: false, text: 'You saved the earth! Most aliens were defeated and the rest went back to their home planet, maybe we defeat them in sequel, who knows.' },
            { image: 'image/ship48.png', pixelate: false, text: 'I hope you enjoyed playing this game as much as I enjoyed making it! See you space cowboy! Somewhere, someday.' },
            { newgame: true }
        ]
    }

];

