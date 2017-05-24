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


        this.load.atlas('lit','images/tiles/lit.png',null,litData);
       this.load.image('mur', 'images/tiles/minimur.png');
       this.load.image('mur2', 'images/tiles/minimur2.png');
       this.load.image('sol', 'images/tiles/solchambre.png');
	     this.load.image('preloadbar', 'images/progress-bar.png');
       this.load.image('tiles', 'images/testTile.png');           
       this.load.image('cactus', 'images/tiles/obstacle1');
       this.load.spritesheet('player', 'images/characterAnim.png',70,74,64);
       this.load.image('exit', 'images/tiles/exit.png');

    this.load.crossOrigin='Anonymous';
    this.load.bitmapFont('font', 'https://dl.dropboxusercontent.com/s/z4riz6hymsiimam/font.png?dl=0', 'https://dl.dropboxusercontent.com/s/7caqsovjw5xelp0/font.xml?dl=0');
    this.load.image('heroTile', 'https://dl.dropboxusercontent.com/s/8b5zkz9nhhx3a2i/hero_tile.png?dl=0');
    this.load.image('heroShadow', 'https://dl.dropboxusercontent.com/s/sq6deec9ddm2635/ball_shadow.png?dl=0');
    
    this.load.atlasJSONArray('hero', 'images/assets/spritesheet.png', 'images/assets/sprites.json');


    this.load.image('wall','images/assets/murG.png');
    this.load.image('wall2','images/assets/murD.png');
    this.load.image('floor','images/assets/sol3.png');

//fichiers à charger pr test la barre de chargement

game.load.image("test","images/1.jpg");
game.load.image("test2","images/2.jpg");
game.load.image("test3","images/3.jpg");
game.load.image("test4","images/4.jpg");
game.load.image("test5","images/5.jpg");
game.load.image("test6","images/6.jpg");
game.load.image("test7","images/7.jpg");
game.load.image("test8","images/8.jpg");
game.load.image("test9","images/9.jpg");
game.load.image("test10","images/10.jpg");
game.load.image("test11","images/11.jpg");
game.load.image("test12","images/12.jpg");
game.load.image("test13","images/13.jpg");
game.load.image("test14","images/14.jpg");

this.load.audio('m1', 'audio/1.mp3');
this.load.audio('m2', 'audio/2.mp3');
this.load.audio('m3', 'audio/3.mp3');
this.load.audio('m4', 'audio/4.mp3');
this.load.audio('m5', 'audio/5.mp3');
this.load.audio('m6', 'audio/6.mp3');
this.load.audio('m7', 'audio/7.mp3');
this.load.audio('m8', 'audio/8.mp3');
this.load.audio('m9', 'audio/9.mp3');
this.load.audio('m10', 'audio/10.mp3');      
this.load.audio('m11', 'audio/11.mp3');
this.load.audio('m12', 'audio/12.mp3');

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
