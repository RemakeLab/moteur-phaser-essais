var button;
var music;

var menuState = {


preload:function(){

	fond = oGame.load.image('background', 'images/menuback.jpg');

//redimensionne l'image

	fond.width = oGame.width;
	fond.height = oGame.height;

	
	button = oGame.load.image('button', 'images/menu.png');
	
},

create: function (){

	

	//var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

	//wkey.onDown.addOnce(this.start,this);

	oGame.add.tileSprite(0, 0, width, height, 'background');

	button = oGame.add.button(350, 200, 'button', this.actionOnClick, this, 2, 1, 0);	
	

	},

	actionOnClick: function (){

	
		?????????
	},

	


};


