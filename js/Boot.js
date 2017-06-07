var bootState = {
	preload:function(){
		// chargement des images
		game.load.image('background_preload','images/background.png');
		game.load.image('progressBar_vide','images/vide.jpg')
		game.load.image('progressBar_full','images/full.jpg')
	},

	create:function(){
		//game.stage.backgroundColor = '#ccfbff';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.state.start('preload');
	}
};