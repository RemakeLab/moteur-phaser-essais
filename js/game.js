<<<<<<< HEAD
//level array
var levelData=
[   [1, 0,0,0,0,0,0,0,0, 1],
    [1, 2,2,2,2,2,2,2,2, 1], 
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 0,2,2,2,2,2,2,2, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,3,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 2,2,2,2,2,2,2,2, 1],
    [1, 0,0,0,0,0,0,0,0, 1] ];

//x & y values of the direction vector for character movement
var dX=0;
var dY=0;
var tileWidth=64;// the width of a tile
var borderOffset = new Phaser.Point(250,50);//to centralise the isometric level display
var floorGraphicWidth=64;
var floorGraphicHeight=32;
var heroGraphicWidth=64;
var heroGraphicHeight=50; /// gérer l'assiette perso / sol
var wallHeight=128; 
var heroHeight=(floorGraphicHeight/2)+(heroGraphicHeight-floorGraphicHeight)+6;//adjustments to make the legs hit the middle of the tile for initial load
var heroWidth= (floorGraphicWidth/2)-(heroGraphicWidth/2);//for placing hero at the middle of the tile
var facing='south';//direction the character faces
var sorcerer;//hero
var sorcererShadow;//duh
var shadowOffset=new Phaser.Point(heroWidth+7,11);
var gameScene;//this is the render texture onto which we draw depth sorted scene
var floorSprite;
var wallSprite;
var wallSprite2;
var heroMapTile=new Phaser.Point(3,3);//hero tile making him stand at centre of scene
var heroMapPos;//2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic
var heroSpeed=3;//well, speed of our hero 
var hero2DVolume = new Phaser.Point(30,30);//now that we dont have a minimap & hero map sprite, we need this
var cornerMapPos=new Phaser.Point(0,0);
var cornerMapTile=new Phaser.Point(0,0);
var halfSpeed=0.7;
var visibleTiles=new Phaser.Point(6,6);
var easystar;
var tapPos=new Phaser.Point(0,0);
var path=[];
var isFindingPath=false;
var destination=heroMapTile;
var isWalking;
var timeCheck = 2000;

var gameState = {
	
		
    create: function(){       
       	 	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);	
	    	// set the Background color of our game
	    	this.game.stage.backgroundColor = "#2ed1a0";

			gameScene=game.add.renderTexture(game.width,game.height);
		    game.add.sprite(0, 0, gameScene);
		    
            gameScene=game.add.renderTexture(game.width, game.height);
            game.add.sprite(0,0, gameScene);
		    exitMarker = this.game.make.sprite(0,0, 'exit');
	        exitMarker.tint='black';
	        exitMarker.alpha = 0.3;
	        exitMarker.anchor.set(0.5);
		    this.createLevel();


            easystar = new EasyStar.js();
            easystar.setGrid(levelData);
            easystar.setAcceptableTiles([0]);
            easystar.enableDiagonals();// we want path to have diagonals
            easystar.disableCornerCutting();// no diagonal path when walking at wall corners
            
            game.input.activePointer.leftButton.onUp.add(this.findPath);

    		wKey.onDown.add(this.changeVisibleTiles);
            game.add.existing(sorcerer);
       
     },

    changeVisibleTiles:function(){
        visibleTiles.x=Math.min(visibleTiles.x+1,levelData[0].length);
        visibleTiles.y=Math.min(visibleTiles.y+1,levelData.length);
        
    },

    update: function () {
    			this.aiWalk(); 


    		    //if no key is pressed then stop else play walking animation
    		    if (dY == 0 && dX == 0)
    		    {
    		        sorcerer.animations.stop();
    		        sorcerer.animations.currentAnim.frame=0;
    		    }else{
    		        if(sorcerer.animations.currentAnim!=facing){
    		            sorcerer.animations.play(facing);
    		        }
    		    }
    		    //check if we are walking into a wall else move hero in 2D
    	        heroMapPos.x +=  heroSpeed * dX;
    	        heroMapPos.y +=  heroSpeed * dY;
    		        
    		    //move the corner in opposite direction
    		    cornerMapPos.x -=  heroSpeed * dX;
    		    cornerMapPos.y -=  heroSpeed * dY;
    		    cornerMapTile=this.getTileCoordinates(cornerMapPos,tileWidth);
    		    //get the new hero map tile
    		    heroMapTile=this.getTileCoordinates(heroMapPos,tileWidth);     
    				
    },

    createLevel:function(){//create minimap
        this.level = new Level();
        this.sorcerer = new Sorcerer();
        heroMapPos=new Phaser.Point(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth);
        heroMapPos.x+=(tileWidth/2);
        heroMapPos.y+=(tileWidth/2);
        //heroMapTile=this.getTileCoordinates(heroMapPos,tileWidth);
    },

    findPath:function(){
        if(isFindingPath || isWalking)return;
        var pos=game.input.activePointer.position;
        var isoPt= new Phaser.Point(pos.x-borderOffset.x,pos.y-borderOffset.y);
        console.log(isoPt);
        // console.log(tapPos);
        tapPos=this.isometricToCartesian(isoPt);

        console.log(tapPos);

        tapPos.x-=tileWidth/2;//adjustment to find the right tile for error due to rounding off
        tapPos.y+=tileWidth/2;
        tapPos=this.getTileCoordinates(tapPos,tileWidth);
        
        // tapPos = function(tapPos,tileWidth){
        //     var tempPt=new Phaser.Point();
        //     tempPt.x=Math.floor(cartPt.x/tileHeight);
        //     tempPt.y=Math.floor(cartPt.y/tileHeight);
        //     return(tempPt);
        // }; //<=== Ne fonctionne pas
        
        if(tapPos.x>-1&&tapPos.y>-1&&tapPos.x<levelData.length&&tapPos.y<levelData.length){//tapped within grid
            if(levelData[tapPos.y][tapPos.x]!=1){//not wall tileh
                isFindingPath=true;
                //let the algorithm do the magic
                easystar.findPath(heroMapTile.x, heroMapTile.y, tapPos.x, tapPos.y, plotAndMove);

                easystar.calculate();
            }
        }
    },

    // plotAndMove:function(newPath){
    //     destination=heroMapTile;
    //     path=newPath;
    //     isFindingPath=false;

    //     if (path === null) {
    //         console.log("No Path was found.");
    //     }else{
    //         path.push(tapPos);
    //         path.reverse();
    //         path.pop();
    //         console.log("p "+path[i].x+":"+path[i].y);
    //     }
    // },

    aiWalk:function(){
        if(path.length==0){//path has ended
            if(heroMapTile.x == destination.x && heroMapTile.y == destination.y){
                // console.log(destination.x+":"+destination.y);
                dX=0;
                dY=0;
                isWalking=false;
                return;
            }
        }

        isWalking=true;
        if(heroMapTile.x==destination.x&&heroMapTile.y==destination.y){//reached current destination, set new, change direction
            //wait till we are few steps into the tile before we turn
            console.log("coucou");
            stepsTaken++;
            if(stepsTaken<stepsTillTurn){
                return;
            }
            console.log("at "+heroMapTile.x+" ; "+heroMapTile.y);
            //centralise the hero on the tile    
            heroMapSprite.x=(heroMapTile.x * tileWidth)+(tileWidth/2)-(heroMapSprite.width/2);
            heroMapSprite.y=(heroMapTile.y * tileWidth)+(tileWidth/2)-(heroMapSprite.height/2);
            heroMapPos.x=heroMapSprite.x+heroMapSprite.width/2;
            heroMapPos.y=heroMapSprite.y+heroMapSprite.height/2;
             
            stepsTaken=0;
            destination=path.pop();//whats next tile in path
            if(heroMapTile.x<destination.x){
                dX = 1;
            }else if(heroMapTile.x>destination.x){
                dX = -1;
            }else {
                dX=0;
            }
            if(heroMapTile.y<destination.y){
                dY = 1;
            }else if(heroMapTile.y>destination.y){
                dY = -1;
            }else {
                dY=0;
            }
            if(heroMapTile.x==destination.x){
                dX=0;
            }else if(heroMapTile.y==destination.y){
                dY=0;
            }
            //figure out which direction to face
            if (dX==1)
            {
                if (dY == 0)
                {
                    facing = "east";
                }
                else if (dY==1)
                {
                    facing = "southeast";
                    dX = dY=halfSpeed;
                }
                else
                {
                    facing = "northeast";
                    dX=halfSpeed;
                    dY=-1*halfSpeed;
                }
            }
            else if (dX==-1)
            {
                dX = -1;
                if (dY == 0)
                {
                    facing = "west";
                }
                else if (dY==1)
                {
                    facing = "southwest";
                    dY=halfSpeed;
                    dX=-1*halfSpeed;
                }
                else
                {
                    facing = "northwest";
                    dX = dY=-1*halfSpeed;
                }
            }
            else
            {
                dX = 0;
                if (dY == 0)
                {
                    //facing="west";
                }
                else if (dY==1)
                {
                    facing = "south";
                }
                else
                {
                    facing = "north";
                }
            }
        }
        console.log(facing);
    },
    /*
    lvl2 : function (){
    	game.state.start('game2');
    },*/
			   
 
};




=======
//level array
var levelData=
[   [1, 0,0,0,0,0,0,0,0, 1],
    [1, 2,2,2,2,2,2,2,2, 1], 
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 0,2,2,2,2,2,2,2, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,3,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1],
    [1, 0,0,0,0,0,0,0,0, 1], 
    [1, 2,2,2,2,2,2,2,2, 1],
    [1, 0,0,0,0,0,0,0,0, 1] ];

//x & y values of the direction vector for character movement
var dX=0;
var dY=0;
var tileWidth=64;// the width of a tile
var borderOffset = new Phaser.Point(250,50);//to centralise the isometric level display
var floorGraphicWidth=64;
var floorGraphicHeight=32;
var heroGraphicWidth=64;
var heroGraphicHeight=50; /// gérer l'assiette perso / sol
var wallHeight=128; 
var heroHeight=(floorGraphicHeight/2)+(heroGraphicHeight-floorGraphicHeight)+6;//adjustments to make the legs hit the middle of the tile for initial load
var heroWidth= (floorGraphicWidth/2)-(heroGraphicWidth/2);//for placing hero at the middle of the tile
var facing='south';//direction the character faces
var sorcerer;//hero
var sorcererShadow;//duh
var shadowOffset=new Phaser.Point(heroWidth+7,11);
var gameScene;//this is the render texture onto which we draw depth sorted scene
var floorSprite;
var wallSprite;
var wallSprite2;
var heroMapTile=new Phaser.Point(3,3);//hero tile making him stand at centre of scene
var heroMapPos;//2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic
var heroSpeed=3;//well, speed of our hero 
var hero2DVolume = new Phaser.Point(30,30);//now that we dont have a minimap & hero map sprite, we need this
var cornerMapPos=new Phaser.Point(0,0);
var cornerMapTile=new Phaser.Point(0,0);
var halfSpeed=0.7;
var visibleTiles=new Phaser.Point(6,6);
var easystar;
var tapPos=new Phaser.Point(0,0);
var path=[];
var isFindingPath=false;
var destination=heroMapTile;
var isWalking;
var timeCheck = 2000;

var gameState = {
	
		
    create: function(){       
       	 	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);	
	    	// set the Background color of our game
	    	this.game.stage.backgroundColor = "#2ed1a0";

			gameScene=game.add.renderTexture(game.width,game.height);
		    game.add.sprite(0, 0, gameScene);
		    
            gameScene=game.add.renderTexture(game.width, game.height);
            game.add.sprite(0,0, gameScene);
		    exitMarker = this.game.make.sprite(0,0, 'exit');
	        exitMarker.tint='black';
	        exitMarker.alpha = 0.3;
	        exitMarker.anchor.set(0.5);
		    this.createLevel();


            easystar = new EasyStar.js();
            easystar.setGrid(levelData);
            easystar.setAcceptableTiles([0]);
            easystar.enableDiagonals();// we want path to have diagonals
            easystar.disableCornerCutting();// no diagonal path when walking at wall corners
            
            game.input.activePointer.leftButton.onUp.add(this.findPath);

    		wKey.onDown.add(this.changeVisibleTiles);
            game.add.existing(sorcerer);
       
     },

    changeVisibleTiles:function(){
        visibleTiles.x=Math.min(visibleTiles.x+1,levelData[0].length);
        visibleTiles.y=Math.min(visibleTiles.y+1,levelData.length);
        
    },

    update: function () {
    			this.aiWalk(); 


    		    //if no key is pressed then stop else play walking animation
    		    if (dY == 0 && dX == 0)
    		    {
    		        sorcerer.animations.stop();
    		        sorcerer.animations.currentAnim.frame=0;
    		    }else{
    		        if(sorcerer.animations.currentAnim!=facing){
    		            sorcerer.animations.play(facing);
    		        }
    		    }
    		    //check if we are walking into a wall else move hero in 2D
    	        heroMapPos.x +=  heroSpeed * dX;
    	        heroMapPos.y +=  heroSpeed * dY;
    		        
    		    //move the corner in opposite direction
    		    cornerMapPos.x -=  heroSpeed * dX;
    		    cornerMapPos.y -=  heroSpeed * dY;
    		    cornerMapTile=this.getTileCoordinates(cornerMapPos,tileWidth);
    		    //get the new hero map tile
    		    heroMapTile=this.getTileCoordinates(heroMapPos,tileWidth);     
    				
    },

    createLevel:function(){//create minimap
        this.level = new Level();
        this.sorcerer = new Sorcerer();
        heroMapPos=new Phaser.Point(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth);
        heroMapPos.x+=(tileWidth/2);
        heroMapPos.y+=(tileWidth/2);
        //heroMapTile=this.getTileCoordinates(heroMapPos,tileWidth);
    },

    findPath:function(){
        if(isFindingPath || isWalking)return;
        var pos=game.input.activePointer.position;
        var isoPt= new Phaser.Point(pos.x-borderOffset.x,pos.y-borderOffset.y);
        console.log(isoPt);
        // console.log(tapPos);
        tapPos=this.isometricToCartesian(isoPt);

        console.log(tapPos);

        tapPos.x-=tileWidth/2;//adjustment to find the right tile for error due to rounding off
        tapPos.y+=tileWidth/2;
        tapPos=this.getTileCoordinates(tapPos,tileWidth);
        
        // tapPos = function(tapPos,tileWidth){
        //     var tempPt=new Phaser.Point();
        //     tempPt.x=Math.floor(cartPt.x/tileHeight);
        //     tempPt.y=Math.floor(cartPt.y/tileHeight);
        //     return(tempPt);
        // }; //<=== Ne fonctionne pas
        
        if(tapPos.x>-1&&tapPos.y>-1&&tapPos.x<levelData.length&&tapPos.y<levelData.length){//tapped within grid
            if(levelData[tapPos.y][tapPos.x]!=1){//not wall tileh
                isFindingPath=true;
                //let the algorithm do the magic
                easystar.findPath(heroMapTile.x, heroMapTile.y, tapPos.x, tapPos.y, plotAndMove);

                easystar.calculate();
            }
        }
    },

    // plotAndMove:function(newPath){
    //     destination=heroMapTile;
    //     path=newPath;
    //     isFindingPath=false;

    //     if (path === null) {
    //         console.log("No Path was found.");
    //     }else{
    //         path.push(tapPos);
    //         path.reverse();
    //         path.pop();
    //         console.log("p "+path[i].x+":"+path[i].y);
    //     }
    // },

    aiWalk:function(){
        if(path.length==0){//path has ended
            if(heroMapTile.x == destination.x && heroMapTile.y == destination.y){
                // console.log(destination.x+":"+destination.y);
                dX=0;
                dY=0;
                isWalking=false;
                return;
            }
        }

        isWalking=true;
        if(heroMapTile.x==destination.x&&heroMapTile.y==destination.y){//reached current destination, set new, change direction
            //wait till we are few steps into the tile before we turn
            console.log("coucou");
            stepsTaken++;
            if(stepsTaken<stepsTillTurn){
                return;
            }
            console.log("at "+heroMapTile.x+" ; "+heroMapTile.y);
            //centralise the hero on the tile    
            heroMapSprite.x=(heroMapTile.x * tileWidth)+(tileWidth/2)-(heroMapSprite.width/2);
            heroMapSprite.y=(heroMapTile.y * tileWidth)+(tileWidth/2)-(heroMapSprite.height/2);
            heroMapPos.x=heroMapSprite.x+heroMapSprite.width/2;
            heroMapPos.y=heroMapSprite.y+heroMapSprite.height/2;
             
            stepsTaken=0;
            destination=path.pop();//whats next tile in path
            if(heroMapTile.x<destination.x){
                dX = 1;
            }else if(heroMapTile.x>destination.x){
                dX = -1;
            }else {
                dX=0;
            }
            if(heroMapTile.y<destination.y){
                dY = 1;
            }else if(heroMapTile.y>destination.y){
                dY = -1;
            }else {
                dY=0;
            }
            if(heroMapTile.x==destination.x){
                dX=0;
            }else if(heroMapTile.y==destination.y){
                dY=0;
            }
            //figure out which direction to face
            if (dX==1)
            {
                if (dY == 0)
                {
                    facing = "east";
                }
                else if (dY==1)
                {
                    facing = "southeast";
                    dX = dY=halfSpeed;
                }
                else
                {
                    facing = "northeast";
                    dX=halfSpeed;
                    dY=-1*halfSpeed;
                }
            }
            else if (dX==-1)
            {
                dX = -1;
                if (dY == 0)
                {
                    facing = "west";
                }
                else if (dY==1)
                {
                    facing = "southwest";
                    dY=halfSpeed;
                    dX=-1*halfSpeed;
                }
                else
                {
                    facing = "northwest";
                    dX = dY=-1*halfSpeed;
                }
            }
            else
            {
                dX = 0;
                if (dY == 0)
                {
                    //facing="west";
                }
                else if (dY==1)
                {
                    facing = "south";
                }
                else
                {
                    facing = "north";
                }
            }
        }
        console.log(facing);
    },
    /*
    lvl2 : function (){
    	game.state.start('game2');
    },*/
			   
 
};




>>>>>>> 39aa879b9b2721ef6137fbce7400909b5bef8406
