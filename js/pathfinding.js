/*
 * Classe PathFinding qui gère le déplacement du hero, le joueur.
 */

/*
 * Variable de classe
 */
var easystar;
var path=[];
var isFindingPath=false;
var stepsTaken=0;
var stepsTillTurn=10;// test pour voir si c'est suffisant

 Pathfinding = function(game)
{
	console.log("PathFinding");
	this.oGame = game;
};

/*
 * Définition des méthodes de la classe Pathfinding
 */
 Pathfinding.prototype =
{
	/*
	 * Préchargement des éléments de la classe PathFinding
	 */
	preload: function()
	{
		//rien pour le moment
	},

	/*
	 * Création de la scène du jeu,
	 * mise en place des graphismes..
	 */
	create: function()
	{
		easystar = new EasyStar.js();
	    easystar.setGrid(levelData);
	    easystar.setAcceptableTiles([0]);
	    easystar.enableDiagonals();// we want path to have diagonals
	    easystar.disableCornerCutting();// no diagonal path when walking at wall corners

   		Lclic =this.oGame.input.activePointer.leftButton.onUp.add(this.findPath);
	},
	/*
	 * fonction pour calculer de l'iso a l'état tableau
	 */
	isometricToCartesian:function(isoPt){
	    var tempPt=new Phaser.Point();
	    tempPt.x=(2*isoPt.y+isoPt.x)/2;
	    tempPt.y=(2*isoPt.y-isoPt.x)/2;
	    return (tempPt);
	},
	/*
	 * fonction de calcul pour le pathfinding
	 */
	findPath: function(){
    	// if(isFindingPath || isWalking)return;
	    var pos=oGame.input.activePointer.position;
	    var isoPt= new Phaser.Point(pos.x-borderOffset.x,pos.y-borderOffset.y);
	    tapPos=oPathfinding.isometricToCartesian(isoPt);
	    tapPos.x-=tileWidth/2;//adjustment to find the right tile for error due to rounding off
	    tapPos.y+=tileWidth/2;
	    tapPos=oPlayer.getTileCoordinates(tapPos,tileWidth);
	    if(tapPos.x>-1&&tapPos.y>-1&&tapPos.x<13&&tapPos.y<13){//tapped within grid
	        if(levelData[tapPos.y][tapPos.x]!=1){//not wall tile
	            isFindingPath=true;
	            //let the algorithm do the magic
	            this.easystar.findPath(heroMapTile.x, heroMapTile.y, tapPos.x, tapPos.y, oPathfinding.plotAndMove);
	            this.easystar.calculate();
	            // console.log("Point"+pos+";"+"tapPos"+tapPos);
	        }
	    }
	},
	/*
	 * fonction pour placer un point et lancer le movement
	 */
	plotAndMove:function(newPath){
	    destination=heroMapTile;
	    path=newPath;
	    isFindingPath=false;
	    if (path === null) {
	        console.log("No Path was found.");
	    }else{
	    	// console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);
	        path.push(tapPos);
	        path.reverse();
	        path.pop();
	    }
	},
	/*
	 * Fonction qui gère le movement
	 */
	aiWalk: function(){
		// console.log("je ne marche pas encore :p");
		if(path.length==0){
			if (heroMapTile.x==destination.x&&heroMapTile.y==destination.y) {
				dX=0;
				dY=0;
				// console.log("ret"+destination.x+" ; "+destination.y+"-"+heroMapTile.x+" ; "+heroMapTile.y);
				return;
			}
		}
		if (heroMapTile.x==destination.x&&heroMapTile.y==destination.y) { //rechercher la destion, mettre la nouvelle, changer la direction
			// attendre un peu dans la tuile avant de lancer
			stepsTaken++;
			if (stepsTaken<stepsTillTurn) {
				return;
			}
			console.log("at "+heroMapTile.x+" ; "+heroMapTile.y);
			stepsTaken=0;
			destination=path.pop();//quel est la prochaine tile
			if (heroMapTile.x<destination.x) {
				dX = 1;
			}else if (heroMapTile.x>destination.x) {
				dX = -1;
			}else{
				dX = 0;
			}
			if (heroMapTile.y<destination.y) {
				dY = 1;
			}else if (heroMapTile.y>destination.y) {
				dY = -1;
			}else{
				dY = 0;
			}
			if (heroMapTile.x==destination.x) { //haut ou bas
				dX= 0;
			}else if (heroMapTile.y==destination.y) { //droite ou gauche
				dY= 0;
			}
			//quelle direction par rapport a la "face" du hero
			if (dX==1) {
				if (dY==0) {
					facing = "east";
				}else if (dY==1) {
					facing = "southeast";
					dX=dY=halfSpeed;
				}else{
					facing = "northeast";
					dX=halfSpeed;
					dY=-1*halfSpeed;
				}
			}
			else if (dX==-1) {
				if (dY==0) {
					facing="west";
				}else if(dY==1){
					facing="soutwest";
					dY=halfSpeed;
					dX=-1*halfSpeed;
				}else{
					facing="nortwest";
					dX=dY=-1*halfSpeed;
				}
			}
			else{
				if (dY == 0) {
					facing="west";
				}else if (dY==1) {
					facing ="south";
				}else{
					facing="north";
				}
			}
			console.log(facing);
		}
	},

	/*
	 * Appelée en continu pendant le jeu
	 */
	update: function()
	{
		this.aiWalk();
	}
};