var gameState3 = {	


	    preload: function () {

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

	        
	    },



	    create: function() {  
 		    	
	    	game.stage.backgroundColor = "black";

	    	
	    	floorGroup = game.add.group();
	    	obstacleGroup = game.add.group();
	    	movableGroupe = game.add.group();
	    	itemGroup = game.add.group();

	    	  
	       

	        

	    	var floorTile;
	        for (var xt = 1024; xt > 0; xt -= 12) {
	            for (var yt = 1024; yt > 0; yt -= 32) {

	            	floorTile = game.add.isoSprite(xt, yt, 0, 'sol', 0, floorGroup);
	            	floorTile.anchor.set(0);
	            	

	            }
	        }

	 
	     
	        	for (var y = 1024; y > 0; y -= 37){
	        		 mur = game.add.isoSprite( 0, y, 0, 'mur', 0, obstacleGroup);
	        		 game.physics.isoArcade.enable(mur);
	        		 mur.body.collideWorldBounds = true;
	        		 mur.body.immovable = true ;	        	
	        }

	      		for (var x = 1024; x > 0; x -=37){
	        		 mur2 = game.add.isoSprite( x, 0, 0, 'mur2', 0, obstacleGroup);
	        		 game.physics.isoArcade.enable(mur2);
	        		 mur2.body.collideWorldBounds = true;
	        		 mur2.body.immovable = true ;	
	        		}

	        

	        lit = game.add.sprite(1000,600, 'lit', obstacleGroup);
	    	lit.animations.add('run');
	    	lit.animations.play('run', 25 , true);
	    	lit.anchor.set(0.5);

	    	game.physics.isoArcade.enable(lit);
	    	lit.body.immovable = true;
	    	lit.body.collideWorldBounds = true;

	    	exitMarker = this.game.add.isoSprite(830, 194, 0, 'exit', 0, itemGroup);
	        this.game.physics.isoArcade.enable(exitMarker);
	        exitMarker.body.collideWorldBounds = true;
	        exitMarker.anchor.set(0.5);
	        exitMarker.alpha = 0.5;
	       // ------Creste the player----


	        
	       player = game.add.isoSprite(350, 280, 0, 'player', 0, obstacleGroup);    
	        player.alpha = 0.6;
	        
	        

	         
	     	
	     	player.animations.add('bas', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
	        player.animations.add('basgauche', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
	        player.animations.add('gauche', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
	        player.animations.add('hautgauche', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
	        player.animations.add('haut', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
	        player.animations.add('hautdroite', [40, 41, 42, 43, 44, 45, 46, 47], 10, true);
	        player.animations.add('droite', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
	        player.animations.add('basdroite', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);
	        

	  			

	        // on place le player au centre de l'écran
	        player.anchor.set(0.5);
	        game.physics.isoArcade.enable(player);
	        player.body.collideWorldBounds = true;

	        // on veut que la camera nous suive
	        game.camera.follow(player);

	       
	    	// active les commandes claviers
		    //cursors = game.input.keyboard.createCursorKeys();

		    // active la fonction 
		  	game.input.onDown.add(this.movePlayer, this);
       
   		 	    },

 


	     update: function () {

	     	

			game.physics.isoArcade.collide(player, floorGroup);	
			
			game.physics.isoArcade.collide(player, obstacleGroup);

			game.physics.isoArcade.collide(obstacleGroup);
			
			game.physics.isoArcade.overlap(exitMarker, player,this.lvl2);

 

 
},


lvl2 : function (){
	game.state.start('game');
},	


movePlayer: function() {

    
   move = game.physics.arcade.moveToPointer(player, 100, game.input.activePointer, 1000)*57.2958;



  if (game.input.mousePointer.position)
       {
	       	

	       		
	       	if(move > -45 && move < 45)
	   		{
	   			console.log("droite");
	   			player.animations.play('droite');
	   		}

	     	 if ( move > 157.5 && move < -157.5 )
	   		{
	   			console.log("gauche");
	   			player.animations.play('gauche');
	   		}

	       	if ( move > 112.5  &&  move < 67.5 )
	   		{
	   			console.log("bas");	   			
	   			player.animations.play('bas');	   			
	   		}

	       	 if (move > -112.5  && move < -67.5 )
	   		{
	   			console.log("haut");	   			
	   			player.animations.play('haut');	   			
	   		}

       		if (move > -135 && move < -112.5)
       		{
       			console.log("hautgauche");       		
       			player.animations.play("hautgauche");
       		}

       		if (move >-67.5 && move < -45)
       		{
       			console.log('hautdroite');
       			player.animations.play('hautdroite');
       		}

       		if (move >22.7 && move < 67.5)
       		{
       			console.log('basdroite');
       			player.animations.play('basdroite');
       		}

       		if (move >112.5 && move < 157.5)
       		{
       			console.log('basgauche');
       			player.animations.play('basgauche');
       		}


       } else {
	    	// si la souris ne bouge plus, on stop le mouvement et on met la frame 4 (position à l'arret)
	        player.body.velocity.setTo(0, 0);
	        player.animations.stop();

	        player.frame = 4;
	    }
	    },



};
var litData = {
	"frames": [

{
	"filename": "test anim lit0000.png",
	"frame": {"x":1,"y":1,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0001.png",
	"frame": {"x":203,"y":1,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0002.png",
	"frame": {"x":405,"y":1,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0003.png",
	"frame": {"x":607,"y":1,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0004.png",
	"frame": {"x":809,"y":1,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0005.png",
	"frame": {"x":1,"y":156,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0006.png",
	"frame": {"x":203,"y":156,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0007.png",
	"frame": {"x":405,"y":156,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0008.png",
	"frame": {"x":607,"y":156,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0009.png",
	"frame": {"x":809,"y":156,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0010.png",
	"frame": {"x":1,"y":311,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0011.png",
	"frame": {"x":203,"y":311,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0012.png",
	"frame": {"x":405,"y":311,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0013.png",
	"frame": {"x":607,"y":311,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0014.png",
	"frame": {"x":809,"y":311,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0015.png",
	"frame": {"x":1,"y":466,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0016.png",
	"frame": {"x":203,"y":466,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0017.png",
	"frame": {"x":405,"y":466,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0018.png",
	"frame": {"x":607,"y":466,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0019.png",
	"frame": {"x":809,"y":466,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0020.png",
	"frame": {"x":1,"y":621,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0021.png",
	"frame": {"x":203,"y":621,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0022.png",
	"frame": {"x":405,"y":621,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0023.png",
	"frame": {"x":607,"y":621,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0024.png",
	"frame": {"x":809,"y":621,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0025.png",
	"frame": {"x":1,"y":776,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0026.png",
	"frame": {"x":203,"y":776,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0027.png",
	"frame": {"x":405,"y":776,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0028.png",
	"frame": {"x":607,"y":776,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0029.png",
	"frame": {"x":809,"y":776,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0030.png",
	"frame": {"x":1,"y":931,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0031.png",
	"frame": {"x":203,"y":931,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0032.png",
	"frame": {"x":405,"y":931,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0033.png",
	"frame": {"x":607,"y":931,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0034.png",
	"frame": {"x":809,"y":931,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0035.png",
	"frame": {"x":1,"y":1086,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0036.png",
	"frame": {"x":203,"y":1086,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0037.png",
	"frame": {"x":405,"y":1086,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0038.png",
	"frame": {"x":607,"y":1086,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0039.png",
	"frame": {"x":809,"y":1086,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
},
{
	"filename": "test anim lit0040.png",
	"frame": {"x":1,"y":1241,"w":200,"h":153},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":238,"y":202,"w":200,"h":153},
	"sourceSize": {"w":640,"h":480}
}],
"meta": {
	"app": "http://www.codeandweb.com/texturepacker",
	"version": "1.0",
	"image": "lit.png",
	"format": "RGBA8888",
	"size": {"w":1010,"h":1395},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:2755317af13595b0a5712c363a6b6fef:67fb83b0ebf0bf0b7183d47c99f14aa3:b4d47a07e84700679b104ab217ba70b4$"
}
}



	



	