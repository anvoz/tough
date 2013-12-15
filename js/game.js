(function(window, undefined) {
    'use strict';

    var Tough = window.Tough = {},
        Game = Tough.Game = function() {
            var game = this;

            game.width = 480;
            game.height = 320;
            game.maxWidth = 2400;
            game.maxHeight = 320;

            game.cursors;
            game.platforms;
            game.player;

            game.monsters;
            game.monsterTimer;
        };

    Game.prototype.preload = function() {
        var game = this;

        game.load.image('sky', 'assets/sky.png');
        game.load.image('cloud1', 'assets/cloud1.png');
        game.load.image('cloud2', 'assets/cloud2.png');

        game.load.image('ground', 'assets/ground.png');
        game.load.image('ledge', 'assets/ledge.png');

        game.load.spritesheet('player', 'assets/player.png', 32, 32);
        game.load.spritesheet('monster', 'assets/monster.png', 32, 32);
    };

    Game.prototype.create = function() {
        var game = this;

        game.cursors = game.input.keyboard.createCursorKeys();

        // Make the world larger than the actual canvas
        game.world.setBounds(0, 0, game.maxWidth, game.maxHeight);

        // TODO: rewrite these functions
        // to generate endless map
        game.createSky();
        game.createPlatforms();
        game.createMonster();
        game.monsterTimer = setInterval(function() {
            game.createMonster();
        }, 20000);

        game.createPlayer();

        game.camera.follow(game.player);
    };

    Game.prototype.update = function() {
        var game = this,
            platforms = game.platforms,
            player = game.player,
            monsters = game.monsters;

        game.physics.collide(player, monsters, function(player, monster) {
            monster.frame = 2;
            monster.body.velocity.x = 0;

            // @HACK:
            if (player.position.y < monster.position.y - 30) {
                monster.kill();
            }
        }, null, this);
        game.physics.collide(monsters, monsters);

        game.physics.collide(player, platforms);
        game.physics.collide(monsters, platforms);

        player.action();
    };

    Game.prototype.createSky = function() {
        var game = this,

            sky = game.add.group(),
            cloud1Y = game.world.height - 188,
            cloud2Y = game.world.height - 94,

            i = 0,
            perScreen = game.maxWidth / game.width;
        for ( ; i < perScreen; i++) {
            var x = i * game.width;

            sky.create(x, 0, 'sky');
            if (i % 2 == 0) {
                sky.create(x, cloud1Y, 'cloud1');
            } else {
                sky.create(x, cloud2Y, 'cloud2');
            }
        }
    };

    Game.prototype.createPlatforms = function() {
        var game = this,

            // The platforms group contains the ground
            // where the character can jump on
            platforms = game.platforms = game.add.group(),

            groundY = game.world.height - 32,
            groundWidth = 1200,

            i = 0,
            totalGround = game.maxWidth / groundWidth;
        // Create the ground
        for ( ; i < totalGround; i++) {
            var x = i * groundWidth + ((i > 0) ? 150 : 0),
                ground = platforms.create(x, groundY, 'ground');
            // This stops it from falling away when the character jumps on it
            ground.body.immovable = true;

            var ledge1 = platforms.create(x - 100, game.world.height - 180, 'ledge'),
                ledge2 = platforms.create(x + 300, game.world.height - 100, 'ledge');
            ledge1.body.immovable = true;
            ledge2.body.immovable = true;
        }
    };

    Game.prototype.createPlayer = function() {
        var game = this,
            cursors = game.cursors,

            // Create the player
            player = game.player = game.add.sprite(32, game.world.height - 150, 'player');

        // Player physics properties
        player.body.gravity.y = 12;
        player.body.collideWorldBounds = true;
     
        // Walking left and right animations
        player.animations.add('left', [1, 0, 2, 0], 10, true);
        player.animations.add('right', [4, 3, 5, 3], 10, true);

        // The player always looks to the right when the game started
        player.frame = 3;

        player.action = function() {
            // Reset the player velocity (movement)
            player.body.velocity.x = 0;

            if (cursors.left.isDown)
            {
                // Move to the left
                player.body.velocity.x = -150;
                player.animations.play('left');

                // Stop the left animation while jumping
                if ( ! player.body.touching.down) {
                    player.frame = 1;
                }
            }
            else if (cursors.right.isDown)
            {
                // Move to the right
                player.body.velocity.x = 150;
                player.animations.play('right');

                // Stop the right animation while jumping
                if ( ! player.body.touching.down) {
                    player.frame = 4;
                }
            }
            else
            {
                // Stand still
                player.animations.stop();
            }
            
            // Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.body.velocity.y = -350;
            }
        };
    };

    Game.prototype.createMonster = function() {
        var game = this,
            positions = [ 200, 500, 1150, 1200, 1500, 1900, 2450, 2500 ],
            monsters;

        if (typeof game.monsters === 'undefined') {
            // Create monster group
            monsters = game.monsters = game.add.group()
        } else {
            monsters = game.monsters;
        }

        for (var i = 0; i < positions.length; i++) {
            var monster = monsters.create(positions[i], 0, 'monster');
            monster.body.gravity.y = 12;
            monster.body.velocity.x = -50;
        }
    };
})(window);