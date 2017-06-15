<<<<<<< HEAD
var button;
var music;

var menuState = {

	preload:function(){
	 	fond = game.load.image('background', 'images/menuback.jpg');
		//redimensionne l'image
		fond.width = game.width;
		fond.height = game.height;
	 	button = game.load.image('button', 'images/menu.png');
	},

	create: function (){
		game.add.tileSprite(0, 0, width, height, 'background');
		button = game.add.button(350, 200, 'button', this.actionOnClick, this, 2, 1, 0);	
	},

	actionOnClick: function (){
		game.state.start('game');
	},

};


=======
var button;
var music;

var menuState = {

	preload:function(){
	 	fond = game.load.image('background', 'images/menuback.jpg');
		//redimensionne l'image
		fond.width = game.width;
		fond.height = game.height;
	 	button = game.load.image('button', 'images/menu.png');
	},

	create: function (){
		game.add.tileSprite(0, 0, width, height, 'background');
		button = game.add.button(350, 200, 'button', this.actionOnClick, this, 2, 1, 0);	
	},

	actionOnClick: function (){
		game.state.start('game');
	},

};


>>>>>>> 39aa879b9b2721ef6137fbce7400909b5bef8406
