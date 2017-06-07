pathfinding = function(game, findPath()){
    
}

function findPath(){
        if(isFindingPath || isWalking)return;
        var pos=game.input.activePointer.position;
        var isoPt= new Phaser.Point(pos.x-borderOffset.x,pos.y-borderOffset.y);
        console.log(isoPt);
        // console.log(tapPos);
        tapPos=isometricToCartesian(isoPt);

        console.log(tapPos);

        tapPos.x-=tileWidth/2;//adjustment to find the right tile for error due to rounding off
        tapPos.y+=tileWidth/2;
        tapPos=getTileCoordinates(tapPos,tileWidth);
        
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
    }


    function isometricToCartesian(isoPt){
        var tempPt=new Phaser.Point();
        tempPt.x=(2*isoPt.y+isoPt.x)/2;
        tempPt.y=(2*isoPt.y-isoPt.x)/2;
        return (tempPt);
    },