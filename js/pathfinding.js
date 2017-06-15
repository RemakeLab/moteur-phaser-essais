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
	    easystar.enableDiagonals();//  chemain en diagonale
	    easystar.disableCornerCutting();// Pas de trajectoire diagonale en marchant aux angles des murs

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
	    tapPos.x-=tileWidth/2;//ajustement pour trouver la position de la tuile
	    tapPos.y+=tileWidth/2;
	    tapPos=oPlayer.getTileCoordinates(tapPos,tileWidth);
	    if(tapPos.x>-1&&tapPos.y>-1&&tapPos.x<13&&tapPos.y<13){//clic dans la grille
	        if(levelData[tapPos.y][tapPos.x]!=1){//pas un tile "mur"
	            isFindingPath=true;
	            //C'est partie pour l'ago magique
	            this.easystar.findPath(heroMapTile.x, heroMapTile.y, tapPos.x, tapPos.y, oPathfinding.plotAndMove);
	            this.easystar.calculate();
	            // console.log("Point"+pos+";"+"tapPos"+tapPos);
	        }
	    }
	},
	/*
	 * fonction pour placer un point et lancer le mouvement
	 */
	plotAndMove:function(newPath){
	    destination=heroMapTile;
	    path=newPath;
	    isFindingPath=false;
	    if (path === null) {
	        console.log("No Path was found.");
	    }else{
	        path.push(tapPos);
	        path.reverse();
	        path.pop();
	        for (var i =0; i<path.length; i++ ) {
	        	path[i].y;
	        	path[i].x;
	        	// console.log("le chemain a été trouvé. Le premier point est: " + path[0].x + " " + path[0].y);
	        }
	    }
	},
	/*
	 * Fonction qui gère le mouvement
	 */
	aiWalk: function(){
		if(path.length==0){
			if (heroMapTile.x==destination.x&&heroMapTile.y==destination.y) {
				dX=0;
				dY=0;
				// console.log("ret"+destination.x+" ; "+destination.y+"-"+heroMapTile.x+" ; "+heroMapTile.y);
				return;
			}
		}
		if (heroMapTile.x==destination.x&&heroMapTile.y==destination.y) { //rechercher la destination, mettre la nouvelle, changer la direction
			// attendre un peu dans la tuile avant de lancer
			stepsTaken++;
			if (stepsTaken<stepsTillTurn) {
				return;
			}
			console.log("at "+heroMapTile.x+" ; "+heroMapTile.y);
			stepsTaken=0;
			destination=path.pop();// quel est la prochaine tile
			if (heroMapTile.x<destination.x) {
				// console.log("je bouge vers +x");
				dX = 1;
			}else if (heroMapTile.x>destination.x) {
				// console.log("je bouge vers -x");
				dX = -1;
			}else{
				dX = 0;
			}
			if (heroMapTile.y<destination.y) {
				// console.log("je bouge vers +y");
				dY = 1;
			}else if (heroMapTile.y>destination.y) {
				// console.log("je bouge vers -y");
				dY = -1;
			}else{
				dY = 0;
			}
			if (heroMapTile.x==destination.x) { //haut ou bas
				dX= 0;
				// console.log("Est arriver a destination x");
			}else if (heroMapTile.y==destination.y) { //droite ou gauche
				dY= 0;
				// console.log("Est arriver a destination y");
			}
			//quelle direction par rapport a la "face" du hero
			if (dX==1) {
				if (dY==0) {
					facing = "east";
				}else if (dY==1) {
					facing = "south";
					dX=dY=halfSpeed;
				}else{
					facing = "east";
					dX=halfSpeed;
					dY=-1*halfSpeed;
				}
			}
			else if (dX==-1) {
				if (dY==0) {
					facing="west";
				}else if(dY==1){
					facing="west";
					dY=halfSpeed;
					dX=-1*halfSpeed;
				}else{
					facing="north";
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
			// console.log(facing);
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