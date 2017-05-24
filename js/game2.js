var gameState2 = {

		
    create: function(){       
       	    
	    		
	    	// set the Background color of our game
	    	this.game.stage.backgroundColor = "#DC143C";

	    	// on "range" les objets par groupe afin de pouvoir les manipuler ensuite
	    	floorGroup = game.add.group();
	    	obstacleGroup = game.add.group();
	    	movableGroupe = game.add.group();
	    	itemGroup = game.add.group();

	    	  // set the gravity in our game
	        game.physics.isoArcade.gravity.setTo(0, 0, -100);

	        // creer le sol 

	    	var floorTile;
	        for (var xt = 1024; xt > 0; xt -= 37) {
	            for (var yt = 1024; yt > 0; yt -= 37) {

	            	floorTile = game.add.isoSprite(xt, yt, 0, 'tiles', 0, floorGroup);
	            	floorTile.anchor.set(0);
	            	//floorTile.scale.setTo(1.5,1.5);

	            }
	        }



	        var cactus;

	        for (var x = 1024; x > 0 ; x -= 400){
	        	for (var y = 1024; y > 0 ; y -=400){
	        		cactus = this.game.add.isoSprite(x,y,0,'cactus',0, obstacleGroup);
	        		cactus.anchor.set(0.5);
	        		this.game.physics.isoArcade.enable(cactus);
	        		cactus.body.collideWorldBounds = true;

	        		// immovable est = false de base, ici on veut que le cactus ne bouge pas donc :
	        		cactus.body.immovable = true;
	        	}
	        }

	         // create the exit marker 
	        
	        exitMarker = this.game.add.isoSprite(830, 194, 0, 'exit', 0, itemGroup);
	        this.game.physics.isoArcade.enable(exitMarker);
	        exitMarker.body.collideWorldBounds = true;
	        exitMarker.anchor.set(0.5);
	        exitMarker.alpha = 0.5;



	       // ------Creste the player----


	        
	        player = this.game.add.isoSprite(350, 280, 0, 'player', 0,obstacleGroup);
	        
	        // l'alpha permet de rendre plus ou moins visible la texture, 0.6 pour en effet " fantome "
	        player.alpha = 0.6;
	        
	        // add the animations from the spritesheet
	        // chaque frame = 1 chiffre de notre spritesheet, le 10 pour les fps, true pour boucler

	         
	     	
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
	        this.game.physics.isoArcade.enable(player);
	        player.body.collideWorldBounds = true;

	        // on veut que la camera nous suive
	        game.camera.follow(player);

	       	game.input.onDown.add(this.movePlayer, this);
	    	// active les commandes claviers
		    //cursors = game.input.keyboard.createCursorKeys();

		   
    },


update: function () {

	     	// collision entre les groupes

			game.physics.isoArcade.collide(player, floorGroup);	
			
			game.physics.isoArcade.collide(obstacleGroup);

			game.physics.isoArcade.collide(obstacleGroup);

			game.physics.isoArcade.overlap(exitMarker, player,this.lvl2);

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

		lvl2 : function (){
	game.state.start('game3');
},	   
 
};