(function(window, undefined) {
    'use strict';

    var Tough = window.Tough = {},
        Game = Tough.Game = function(game) {
            this.cursors;
            this.platforms;
            this.player;
        };

    Game.prototype.preload = function() {
        var game = this;

        game.load.image('ground', 'assets/ground.png');
        game.load.spritesheet('player', 'assets/player.png', 32, 32);
    };

    Game.prototype.create = function() {
        var game = this;

        game.cursors = game.input.keyboard.createCursorKeys();

        // Make the world larger than the actual canvas
        game.world.setBounds(0, 0, 960, 320);

        game.createPlatforms();
        game.createPlayer();

        game.camera.follow(game.player);
    };

    Game.prototype.update = function() {
        var game = this,
            platforms = game.platforms,
            player = game.player;

        game.physics.collide(player, platforms);

        player.action();
    };

    Game.prototype.createPlatforms = function() {
        var game = this,

            // The platforms group contains the ground
            // where the character can jump on
            platforms = game.platforms = game.add.group(),
            // Create the ground
            ground = platforms.create(0, game.world.height - 30, 'ground'),
            // Create two ledges
            ledge1 = platforms.create(0, 100, 'ground'),
            ledge2 = platforms.create(300, 200, 'ground');

        // Temporarily use scale to draw the 10x10 pixels sprite
        ground.scale.setTo(48, 3);
        // This stops it from falling away when the character jumps on it
        ground.body.immovable = true;

        ledge1.scale.setTo(20, 3);
        ledge1.body.immovable = true;
        ledge2.scale.setTo(20, 3);
        ledge2.body.immovable = true;
    };

    Game.prototype.createPlayer = function() {
        var game = this,
            cursors = game.cursors,

            // Create the player
            player = game.player = game.add.sprite(32, game.world.height - 150, 'player');

        // Player physics properties
        player.body.gravity.y = 10;
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
})(window);