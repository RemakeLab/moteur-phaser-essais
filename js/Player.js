/*
 * Classe Player qui gère le héros du jeu, le joueur.
 */

/*
 * Variable de classe
 */
var wallGraphicHeight=128;
var floorGraphicWidth=64;
var floorGraphicHeight=32;
var heroGraphicWidth=64;
var heroGraphicHeight=50;
var heroHeight=(floorGraphicHeight/2)+(heroGraphicHeight-floorGraphicHeight)+6;//adjustments to make the legs hit the middle of the tile for initial load
var heroWidth= (floorGraphicWidth/2)-(heroGraphicWidth/2);
var heroMapPos;
var heroSpeed=3;
var hero2DVolume = new Phaser.Point(30,30);
var shadowOffset=new Phaser.Point(heroWidth+7,11);

Player = function(game)
{
	console.log("Player");
	this.oGame = game;
	this.spritePlayer = null;
};

/*
 *Définition des méthodes de la classe Player
 */
Player.prototype =
{
	/*
	 * Préchargement des éléments de la classe Player
	 */
	preload: function()
	{
		this.oGame.load.image('heroShadow', 'https://dl.dropboxusercontent.com/s/sq6deec9ddm2635/ball_shadow.png?dl=0');
		this.oGame.load.atlasJSONArray('hero', 'images/assets/spritesheet.png', 'images/assets/sprites.json');
	},

	/*
	 * Création de la scène du jeu,
	 * mise en place des graphismes..
	 */
	create: function()
	{
		heroShadow = this.oGame.make.sprite(0,0,'heroShadow');
		heroShadow.scale = new Phaser.Point(0.2,0.6);
		heroShadow.alpha=0.4;
		this.createLevel();
	},


	/*
	 * Appelée en continu pendant le jeu
	 */
	update: function()
	{
		if (dY == 0 && dX == 00) {
			sorcerer.animations.stop();
			sorcerer.animations.currentAnim.frame=0;
		}else{
			if (sorcerer.animations.currentAnim!= facing) {
				sorcerer.animations.play(facing);
			}
		}
		heroMapPos.x += heroSpeed * dX;
		heroMapPos.y += heroSpeed * dY;

		heroMapTile=this.getTileCoordinates(heroMapPos, tileWidth);
	},
	drawHeroIso:function(){
        var isoPt= new Phaser.Point();
        var heroCornerPt=new Phaser.Point(heroMapPos.x-hero2DVolume.x/2+cornerMapPos.x,heroMapPos.y-hero2DVolume.y/2+cornerMapPos.y);
        isoPt=oLevel.cartesianToIsometric(heroCornerPt);//donne une nouvelle position iso pour le hero
        gameScene.renderXY(sorcerer,isoPt.x+borderOffset.x+heroWidth, isoPt.y+borderOffset.y-heroHeight, false);// dessine le hero
        // gameScene.renderXY(heroShadow,isoPt.x+borderOffset.x+shadowOffset.x, isoPt.y+borderOffset.y+shadowOffset.y, false);// dessine l'ombre
    },

	addHero:function(){
	    // création du perso
	    sorcerer = this.oGame.add.sprite(-50, 0, 'hero', 'Nord7');
	   
	   
	    // animations, les noms sont tirés du JSON 
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

	getTileCoordinates:function(cartPt, tileHeight){
	    var tempPt=new Phaser.Point();
	    tempPt.x=Math.floor(cartPt.x/tileHeight);
	    tempPt.y=Math.floor(cartPt.y/tileHeight);
	    return(tempPt);
	},
	createLevel:function(){
		this.addHero();
		heroMapPos = new Phaser.Point(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth);
		heroMapPos.x+=(tileWidth/2);
		heroMapPos.y+=(tileWidth/2);
		heroMapTile=this.getTileCoordinates(heroMapPos, tileWidth);
		oLevel.renderScene();
	}

};