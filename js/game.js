var upKey;
var downKey;
var leftKey;
var rightKey;



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
    [1, 0,0,0,0,0,0,0,0, 1]
];



//x & y values of the direction vector for character movement
var dX=0;
var dY=0;
var tileWidth=64;// the width of a tile

var borderOffset = new Phaser.Point(250,50);//to centralise the isometric level display


var wallGraphicHeight=128;

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
var bmpText;//title text
var normText;//text to display hero coordinates
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
   			// upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
   			// downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    		// leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    		// rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);	
	    	// set the Background color of our game
	    	this.game.stage.backgroundColor = "#2ed1a0";

			gameScene=game.add.renderTexture(game.width,game.height);
		    game.add.sprite(0, 0, gameScene);
		    floorSprite= game.make.sprite(0, 0, 'floor');
		    wallSprite = game.make.sprite(0, 0, 'wall');
		    wallSprite2= game.make.sprite(0, 0, 'wall2');
		    sorcererShadow=game.make.sprite(0,0,'heroShadow');
		    sorcererShadow.scale= new Phaser.Point(0.5,0.6);
		    sorcererShadow.alpha=0.4;

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

       
     },

    changeVisibleTiles:function(){
        visibleTiles.x=Math.min(visibleTiles.x+1,levelData[0].length);
        visibleTiles.y=Math.min(visibleTiles.y+1,levelData.length);
        
    },

    update: function () {

    			
    			/*if (game.time.now - timeCheck > 3000 && sorcerer.overlap(exitMarker)){//3 seconds have elapsed, so safe to do something
    			this.lvl2();
    			}*/

    				     /*	game.physics.isoArcade.overlap(exitMarker, sorcerer ,function(){

                	        game.state.start('game2');
    	        	
    	        	
    	        });*/

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
    		    if (this.isWalkable())
    		    {
    		        heroMapPos.x +=  heroSpeed * dX;
    		        heroMapPos.y +=  heroSpeed * dY;
    		        
    		        //move the corner in opposite direction
    		        cornerMapPos.x -=  heroSpeed * dX;
    		        cornerMapPos.y -=  heroSpeed * dY;
    		        cornerMapTile=this.getTileCoordinates(cornerMapPos,tileWidth);
    		        //get the new hero map tile
    		        heroMapTile=this.getTileCoordinates(heroMapPos,tileWidth);
    		        //depthsort & draw new scene
    		        this.renderScene();
        }
    				
    },

    createLevel:function(){//create minimap
        this.addHero();
        heroMapPos=new Phaser.Point(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth);
        heroMapPos.x+=(tileWidth/2);
        heroMapPos.y+=(tileWidth/2);
        heroMapTile=this.getTileCoordinates(heroMapPos,tileWidth);
        this.renderScene();//draw once the initial state
    },

    addHero:function(){
        // création du perso
        sorcerer = game.add.sprite(-50, 0, 'hero', 'Nord7');// keep him out side screen area
       
       
        // animation
        sorcerer.animations.add('southeast',
        								['SudEst1','SudEst2','SudEst3','SudEst4','SudEst5','SudEst6',
                                        'SudEst7','SudEst8','SudEst9','SudEst10','SudEst11','SudEst12','SudEst13',
                                        'SudEst14','SudEst15','SudEst16','SudEst17','SudEst18','SudEst19','SudEst20',
                                        'SudEst21','SudEst22','SudEst23','SudEst24','SudEst25','SudEst26','SudEst27',
                                        'SudEst28','SudEst29','SudEst30'], 25, true);


        sorcerer.animations.add('south',
        								['Sud1','Sud2','Sud3','Sud4','Sud5','Sud6','Sud7','Sud8','Sud9',
                                        'Sud10','Sud11','Sud12','Sud13','Sud14','Sud15','Sud16','Sud17','Sud18',
                                        'Sud19','Sud20','Sud21','Sud22','Sud23','Sud24','Sud25','Sud26','Sud27',
                                        'Sud28','Sud29','Sud30'], 25, true);


        sorcerer.animations.add('southwest',
        								 ['SudOuest1','SudOuest2','SudOuest3','SudOuest4','SudOuest5','SudOuest6',
                                          'SudOuest7','SudOuest8','SudOuest9','SudOuest10','SudOuest11','SudOuest12',
                                          'SudOuest13','SudOuest14','SudOuest15','SudOuest16','SudOuest17','SudOuest18',
                                          'SudOuest19','SudOuest20','SudOuest21','SudOuest22','SudOuest23','SudOuest24',
                                          'SudOuest25','SudOuest26','SudOuest27','SudOuest28','SudOuest29',
                                          'SudOuest30'], 25, true);


        sorcerer.animations.add('west',
        								['Ouest1','Ouest2','Ouest3','Ouest4','Ouest5','Ouest6','Ouest7',
                                        'Ouest8','Ouest9','Ouest10','Ouest11','Ouest12','Ouest13','Ouest14',
                                        'Ouest15','Ouest16','Ouest17','Ouest18','Ouest19','Ouest20','Ouest21',
                                        'Ouest22','Ouest23','Ouest24','Ouest25','Ouest26','Ouest27','Ouest28',
                                        'Ouest29','Ouest30'], 25, true);


        sorcerer.animations.add('northwest',
    		    						['NordOuest1','NordOuest2','NordOuest3','NordOuest4','NordOuest5',
    		                            'NordOuest6','NordOuest7','NordOuest8','NordOuest9','NordOuest10','NordOuest11',
    		                            'NordOuest12','NordOuest13','NordOuest14','NordOuest15','NordOuest16','NordOuest17',
    		                            'NordOuest18','NordOuest19', 'NordOuest20','NordOuest21','NordOuest22','NordOuest23',
    		                            'NordOuest24','NordOuest25','NordOuest26', 'NordOuest27','NordOuest28','NordOuest29',
    		                            'NordOuest30'], 25, true);

        sorcerer.animations.add('north',
    		    						['Nord1','Nord2','Nord3','Nord4','Nord5','Nord6','Nord7',
    		                            'Nord8','Nord9','Nord10','Nord11','Nord12','Nord13','Nord14','Nord15',
    		                            'Nord16','Nord17','Nord18','Nord19','Nord20','Nord21','Nord22','Nord23',
    		                            'Nord24','Nord25','Nord26','Nord27','Nord28','Nord29','Nord30'], 25, true);

        sorcerer.animations.add('northeast', 
    		    						['NordEst1','NordEst2','NordEst3','NordEst4','NordEst5','NordEst6',
    		                            'NordEst7','NordEst8','NordEst9','NordEst10','NordEst11','NordEst12','NordEst13',
    		                            'NordEst14','NordEst15','NordEst16','NordEst17','NordEst18','NordEst19','NordEst20',
    		                            'NordEst21','NordEst22','NordEst23','NordEst24','NordEst25','NordEst26','NordEst27',
    		                            'NordEst28','NordEst29','NordEst30'], 25, true);

        sorcerer.animations.add('east', 
    		    						['Est1','Est2','Est3','Est4','Est5','Est6','Est7','Est8','Est9','Est10','Est11',
    		                            'Est12','Est13','Est14','Est15','Est16','Est17','Est18','Est19','Est20','Est21',
    		                            'Est22','Est23','Est24','Est25','Est26','Est27','Est28','Est29','Est30'], 25, true);
    },




    renderScene:function(){
        gameScene.clear();//clear the previous frame then draw again
        var tileType=0;
        //let us limit the loops within visible area
        var startTileX=Math.max(0,0-cornerMapTile.x);
        var startTileY=Math.max(0,0-cornerMapTile.y);
        var endTileX=Math.min(levelData[0].length,startTileX+visibleTiles.x);
        var endTileY=Math.min(levelData.length,startTileY+visibleTiles.y);
        startTileX=Math.max(0,endTileX-visibleTiles.x);
        startTileY=Math.max(0,endTileY-visibleTiles.y);
        //check for border condition
        for (var i = startTileY; i < endTileY; i++)
        {
            for (var j = startTileX; j < endTileX; j++)
            {
                tileType=levelData[i][j];
                this.drawTileIso(tileType,i,j);
                if(i==heroMapTile.y&&j==heroMapTile.x){
                    this.drawHeroIso();
                }
            }
        }
    },


    drawHeroIso:function(){

        var isoPt= new Phaser.Point();//It is not advisable to create points in update loop
        var heroCornerPt=new Phaser.Point(heroMapPos.x-hero2DVolume.x/2+cornerMapPos.x,heroMapPos.y-hero2DVolume.y/2+cornerMapPos.y);
        isoPt=this.cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position
        gameScene.renderXY(sorcererShadow,isoPt.x+borderOffset.x+shadowOffset.x, isoPt.y+borderOffset.y+shadowOffset.y, false);//draw shadow to render texture
        gameScene.renderXY(sorcerer,isoPt.x+borderOffset.x+heroWidth, isoPt.y+borderOffset.y-heroHeight, false);//draw hero to render texture
    },


    drawTileIso:function(tileType,i,j){//place isometric level tiles

        var isoPt= new Phaser.Point();//It is not advisable to create point in update loop
        var cartPt=new Phaser.Point();//This is here for better code readability.

        cartPt.x=j*tileWidth+cornerMapPos.x;
        cartPt.y=i*tileWidth+cornerMapPos.y;
        isoPt=this.cartesianToIsometric(cartPt);

        //we could further optimise by not drawing if tile is outside screen.
        if(tileType==1){
            gameScene.renderXY(wallSprite, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y-wallHeight, false);
        }
        if (tileType==2){
            gameScene.renderXY(wallSprite2, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y-wallHeight, false);
        }
        if (tileType==3){
            gameScene.renderXY(exitMarker, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y-wallHeight, false);
        }
       else{
            gameScene.renderXY(floorSprite, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y, false);
        }
    },


    isWalkable:function(){//It is not advisable to create points in update loop, but for code readability.
        var able=true;
        var heroCornerPt=new Phaser.Point(heroMapPos.x-hero2DVolume.x/2,heroMapPos.y-hero2DVolume.y/2);
        var cornerTL =new Phaser.Point();
        cornerTL.x=heroCornerPt.x +  (heroSpeed * dX);
        cornerTL.y=heroCornerPt.y +  (heroSpeed * dY);
        // now we have the top left corner point. we need to find all 4 corners based on the map marker graphics width & height
        //ideally we should just provide the hero a volume instead of using the graphics' width & height
        var cornerTR =new Phaser.Point();
        cornerTR.x=cornerTL.x+hero2DVolume.x;
        cornerTR.y=cornerTL.y;
        var cornerBR =new Phaser.Point();
        cornerBR.x=cornerTR.x;
        cornerBR.y=cornerTL.y+hero2DVolume.y;
        var cornerBL =new Phaser.Point();
        cornerBL.x=cornerTL.x;
        cornerBL.y=cornerBR.y;
        var newTileCorner1;
        var newTileCorner2;
        var newTileCorner3=heroMapPos;
        //let us get which 2 corners to check based on current facing, may be 3
        switch (facing){
            case "north":
                newTileCorner1=cornerTL;
                newTileCorner2=cornerTR;
            break;
            case "south":
                newTileCorner1=cornerBL;
                newTileCorner2=cornerBR;
            break;
            case "east":
                newTileCorner1=cornerBR;
                newTileCorner2=cornerTR;
            break;
            case "west":
                newTileCorner1=cornerTL;
                newTileCorner2=cornerBL;
            break;
            case "northeast":
                newTileCorner1=cornerTR;
                newTileCorner2=cornerBR;
                newTileCorner3=cornerTL;
            break;
            case "southeast":
                newTileCorner1=cornerTR;
                newTileCorner2=cornerBR;
                newTileCorner3=cornerBL;
            break;
            case "northwest":
                newTileCorner1=cornerTR;
                newTileCorner2=cornerBL;
                newTileCorner3=cornerTL;
            break;
            case "southwest":
                newTileCorner1=cornerTL;
                newTileCorner2=cornerBR;
                newTileCorner3=cornerBL;
            break;
        }
        //check if those corners fall inside a wall after moving
        newTileCorner1=this.getTileCoordinates(newTileCorner1,tileWidth);
        if(levelData[newTileCorner1.y][newTileCorner1.x]==1 || levelData[newTileCorner1.y][newTileCorner1.x]==2){
            able=false;
        }
        newTileCorner2=this.getTileCoordinates(newTileCorner2,tileWidth);
        if(levelData[newTileCorner2.y][newTileCorner2.x]==1 || levelData[newTileCorner2.y][newTileCorner2.x]==2 ){
            able=false;
        }
        newTileCorner3=this.getTileCoordinates(newTileCorner3,tileWidth);
        if(levelData[newTileCorner3.y][newTileCorner3.x]==1 || levelData[newTileCorner3.y][newTileCorner3.x]==2 ){
            able=false;
        }
        return able;
    },

    cartesianToIsometric:function(cartPt){
        var tempPt=new Phaser.Point();
        tempPt.x=cartPt.x-cartPt.y;
        tempPt.y=(cartPt.x+cartPt.y)/2;
        return (tempPt);
    },

    isometricToCartesian:function(isoPt){
        var tempPt=new Phaser.Point();
        this.tempPt.x=(2*isoPt.y+isoPt.x)/2;
        this.tempPt.y=(2*isoPt.y-isoPt.x)/2;
        return (tempPt);
    },


    getTileCoordinates:function(cartPt, tileHeight){
        var tempPt=new Phaser.Point();
        tempPt.x=Math.floor(cartPt.x/tileHeight);
        tempPt.y=Math.floor(cartPt.y/tileHeight);
        return(tempPt);
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
                easystar.findPath(heroMapTile.x, heroMapTile.y, tapPos.x, tapPos.y, plotAndMove=function(newpath){ //<= test comme ça
                    destination=heroMapTile;
                    path=newPath;
                    isFindingPath=false;
                    if (path === null) {
                        console.log("Path was not found.");
                    }else{
                        path.push(tapPos);
                        path.reverse();
                        path.pop();
                        console.log("Path was found."+path[0].x+":"+path[0].y);
                    }
                });

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
    // detectKeyInput:function(){//assign direction for character & set x,y speed components
    //     if (upKey.isDown)
    //     {
    //         dY = -1;
    //     }
    //     else if (downKey.isDown)
    //     {
    //         dY = 1;
    //     }
    //     else
    //     {
    //         dY = 0;
    //     }
    //     if (rightKey.isDown)
    //     {
    //         dX = 1;
    //         if (dY == 0)
    //         {
    //             facing = "east";
    //         }
    //         else if (dY==1)
    //         {
    //             facing = "southeast";
    //             dX = dY=halfSpeed;
    //         }
    //         else
    //         {
    //             facing = "northeast";
    //             dX=halfSpeed;
    //             dY=-1*halfSpeed;
    //         }
    //     }
    //     else if (leftKey.isDown)
    //     {
    //         dX = -1;
    //         if (dY == 0)
    //         {
    //             facing = "west";
    //         }
    //         else if (dY==1)
    //         {
    //             facing = "southwest";
    //             dY=halfSpeed;
    //             dX=-1*halfSpeed;
    //         }
    //         else
    //         {
    //             facing = "northwest";
    //             dX = dY=-1*halfSpeed;
    //         }
    //     }
    //     else
    //     {
    //         dX = 0;
    //         if (dY == 0)
    //         {
    //             facing="west";
    //         }
    //         else if (dY==1)
    //         {
    //             facing = "south";
    //         }
    //         else
    //         {
    //             facing = "north";
    //         }
    //     }
    // },


    /*
    lvl2 : function (){
    	game.state.start('game2');
    },*/
			   
 
};




