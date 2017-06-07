var Level = function(){
    var tileType;
    floorSprite= game.make.sprite(0, 0, 'floor');
    wallSprite = game.make.sprite(0, 0, 'wall');
    wallSprite2= game.make.sprite(0, 0, 'wall2');

    renderScene=function(){
        gameScene.clear();//clear the previous frame then draw again
        tileType=0;
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
    };

    drawHeroIso=function(){
        var isoPt= new Phaser.Point();//It is not advisable to create points in update loop
        var heroCornerPt=new Phaser.Point(heroMapPos.x-hero2DVolume.x/2+cornerMapPos.x,heroMapPos.y-hero2DVolume.y/2+cornerMapPos.y);
        isoPt=this.cartesianToIsometric(heroCornerPt);//find new isometric position for hero from 2D map position
        gameScene.renderXY(sorcererShadow,isoPt.x+borderOffset.x+shadowOffset.x, isoPt.y+borderOffset.y+shadowOffset.y, false);//draw shadow to render texture
        gameScene.renderXY(sorcerer,isoPt.x+borderOffset.x+heroWidth, isoPt.y+borderOffset.y-heroHeight, false);//draw hero to render texture
    };

    drawTileIso=function(tileType,i,j){//place isometric level tiles
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
        game.physics.arcade.enable(tileType,Phaser.Physics.ARCADE);
    };

    isWalkable=function(){//It is not advisable to create points in update loop, but for code readability.
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
    };

    getTileCoordinates=function(cartPt, tileHeight){
        var tempPt=new Phaser.Point();
        tempPt.x=Math.floor(cartPt.x/tileHeight);
        tempPt.y=Math.floor(cartPt.y/tileHeight);
        return(tempPt);
    };
    cartesianToIsometric=function(cartPt){
        var tempPt=new Phaser.Point();
        tempPt.x=cartPt.x-cartPt.y;
        tempPt.y=(cartPt.x+cartPt.y)/2;
        return (tempPt);
    };
    getCartesianFromTileCoordinates=function(tilePt, tileHeight){
        var tempPt=new Phaser.Point();
        tempPt.x=tilePt.x*tileHeight;
        tempPt.y=tilePt.y*tileHeight;
        return(tempPt);
    };

    heroMapPos=new Phaser.Point(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth);
    heroMapPos.x+=(tileWidth/2);
    heroMapPos.y+=(tileWidth/2);
    heroMapTile=getTileCoordinates(heroMapPos,tileWidth);
    renderScene();//draw once the initial state
};

Level.prototype = Object.create(Phaser.Sprite.prototype);
Level.prototype.constructor = Level;