/*
 * Les variables du jeu
 * Les instances des classes
 */
var dX=0;
var dY=0;
var facing;
var oPlayer = null;
var oLevel = null;
var oGame = null;
var heroMapTile=new Phaser.Point(2,3);
var heroMapPos;
var destination=heroMapTile;
var height = window.innerHeight;
var width = window.innerWidth;
var halfSpeed=0.5; //vitesse du hero
var tileWidth=32;
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

document.addEventListener("DOMContentLoaded", Main, false);

/*
 * fonction principale
 * Appelée au chargement de la page
 */
function Main()
{
	console.log("Main");
	// création de la zone de jeu - API Canvas
	oGame = new Phaser.Game(width, height, Phaser.AUTO,'idGameDiv', {preload :preload, create: create, update: update});
}

/*
 *Préchargement des éléments du jeu
 */
function preload()
{
	oLevel = new Level(oGame);
	oLevel.preload();

	oPlayer = new Player(oGame);
	oPlayer.preload();

    oPathfinding = new Pathfinding(oGame);
}

/*
 * Création de la scène du jeu,
 * mise en place des graphismes...
 */
function create()
{
	oLevel.create();
	oPlayer.create();
    oPathfinding.create();
    // console.log("heroMapPos= "+heroMapPos.x+" ; "+heroMapPos.y);
}

/*
 * Appelée en continu pendant le jeu
 */
function update()
{
    oPathfinding.update();
	oPlayer.update();
    oLevel.update();
}