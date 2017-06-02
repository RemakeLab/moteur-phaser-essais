



var loadState = {

preload: function(){
//ajout le fond

var im_fond= game.add.sprite(0,0,'background_preload');

//redimensionne l'image

im_fond.width = game.width;
im_fond.height = game.height;


//ajout la barre de progress

var barre_vide = game.add.sprite(250,400,'progressBar_vide');
barre_vide.width = 500;


var barre_pleine = game.add.sprite(250,400,'progressBar_full');
barre_pleine.width = 500;

game.load.setPreloadSprite(barre_pleine);



    this.load.spritesheet('player', 'images/characterAnim.png',70,74,64);
    this.load.image('exit', 'images/exit.png');
    this.load.crossOrigin='Anonymous';
    this.load.bitmapFont('font', 'https://dl.dropboxusercontent.com/s/z4riz6hymsiimam/font.png?dl=0', 'https://dl.dropboxusercontent.com/s/7caqsovjw5xelp0/font.xml?dl=0');
    this.load.image('heroTile', 'https://dl.dropboxusercontent.com/s/8b5zkz9nhhx3a2i/hero_tile.png?dl=0');
    this.load.image('heroShadow', 'https://dl.dropboxusercontent.com/s/sq6deec9ddm2635/ball_shadow.png?dl=0');
    
    this.load.atlasJSONArray('hero', 'images/assets/spritesheet.png', 'images/assets/sprites.json');


    this.load.image('wall','images/assets/murG.png');
    this.load.image('wall2','images/assets/murD.png');
    this.load.image('floor','images/assets/sol3.png');


 var player;
 var tiles;
 var cursors;
           
           
            game.time.advancedTiming = true;
            // Add the Isometric plug-in to Phaser
            game.plugins.add(new Phaser.Plugin.Isometric(game));
            // Set the world size
            game.world.setBounds(0, 0, 2048, 1024);
            // Start the physical system
            game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
            // set the middle of the world in the middle of the screen
            game.iso.anchor.setTo(0.5, 0.2);
            
            this.load.onLoadComplete.add(this.loadComplete, this);
    },

    loadComplete: function(){
       this.ready = true;
    },
    update: function(){
        if(this.ready === true) 
        {
            this.state.start('Game');    
        } 
    },


create: function(){

game.state.start('menu');


}





};
