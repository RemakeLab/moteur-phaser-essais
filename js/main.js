var width = window.innerWidth;
var height = window.innerHeight;


var game = new Phaser.Game(width, height, Phaser.AUTO);
    game.state.add('Boot', bootState);
    game.state.add('preload', loadState);
    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.add('game2', gameState2);
    game.state.add('game3', gameState3);
    game.state.start('Boot',game.boot);