/*
 * Classe Level qui gère le décore du jeu
 */

/*
 * Variable de classe
 */
var borderOffset = new Phaser.Point(250,50);
var cornerMapPos=new Phaser.Point(0,0);
var wallHeight=128; 

Level = function(game) {
	console.log("Level");
	this.oGame = game;
};

/*
 * Définition des méthodes de la classe player
 */
Level.prototype =
{
	/*
	* Définition des méthode de la classe Level
	*/
	preload: function()
	{
		this.oGame.stage.backgroundColor = "balck";
		this.oGame.load.image('exit', 'images/exit.png');
		this.oGame.load.image('wall','images/assets/murG.png');
		this.oGame.load.image('wall2','images/assets/murD.png');
		this.oGame.load.image('floor','images/assets/sol3.png');
	},

	/*
	* Création de la scène du jeu,
	* mise en place des graphismes...
	*/
	create: function()
	{
		floorSprite= this.oGame.make.sprite(0, 0, 'floor');
    	wallSprite = this.oGame.make.sprite(0, 0, 'wall');
    	wallSprite2= this.oGame.make.sprite(0, 0, 'wall2');
    	gameScene  = this.oGame.add.renderTexture(this.oGame.width,this.oGame.height);
		this.oGame.add.sprite(0, 0, gameScene);
	},

	renderScene:function(){
		var cornerMapTile=new Phaser.Point(0,0);
		var visibleTiles=new Phaser.Point(6,6);
        gameScene.clear();//nettoyer la frame avant d'en faire une autre
        var tileType=0;
        //Limites les boucles dans la zone visible
        var startTileX=Math.max(0,0-cornerMapTile.x);
        var startTileY=Math.max(0,0-cornerMapTile.y);
        var endTileX=Math.min(levelData[0].length,startTileX+visibleTiles.x);
        var endTileY=Math.min(levelData.length,startTileY+visibleTiles.y);
        startTileX=Math.max(0,endTileX-visibleTiles.x);
        startTileY=Math.max(0,endTileY-visibleTiles.y);
        //check les conditions de bordure
        for (var i = startTileY; i < endTileY; i++)
        {
            for (var j = startTileX; j < endTileX; j++)
            {
                tileType=levelData[i][j];
                this.drawTileIso(tileType,i,j);
                if(i==heroMapTile.y&&j==heroMapTile.x){
                    oPlayer.drawHeroIso();
                }
            }
        }
    },
    
    drawTileIso:function(tileType,i,j){//placer l'isometric level tiles
        var isoPt= new Phaser.Point();
        var cartPt=new Phaser.Point();
        cartPt.x=j*tileWidth+cornerMapPos.x;
        cartPt.y=i*tileWidth+cornerMapPos.y;
        isoPt=this.cartesianToIsometric(cartPt);

        // Nous pourrions encore optimiser en ne dessinant pas si la mosaïque est en dehors de l'écran, /!\ A faire /!\
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
    cartesianToIsometric:function(cartPt){
        var tempPt=new Phaser.Point();
        tempPt.x=cartPt.x-cartPt.y;
        tempPt.y=(cartPt.x+cartPt.y)/2;
        return (tempPt);
    },

	/*
	* Appelée en continu pendant le jeu
	*/
	update: function()
	{
		this.renderScene();
	}
};