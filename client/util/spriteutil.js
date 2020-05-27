import {ImageCache} from '../model/imagecache.js';
import {Formation} from '../model/enum.js';

var SpriteUtil = (function() {
 let imageScale = 1.25;

 let stackSpriteIndices = {
    union: [66, 68, 72, 80],
    confederate: [36, 38, 42, 50]
 };

 let milSymbolSpriteIndices = {
    "infantry_line": 96,
    "infantry_column": 102,
    "cavalry_line": 108,
    "cavalry_column": 114,
    "artillery_limbered": 120,
    "artillery_unlimbered": 126,
    "leader": 132,
    "supply": 134,
    "routed": 135

 };

 let sprites = {};

 sprites.Icons2d = {
    columns: 12,
    rows: 20,
    width: 32 * imageScale,
    height: 32 * imageScale,
 }

 sprites.UnitBox = {
    columns: 3,
    rows: 2,
    width: 101 * imageScale,
    height: 109 * imageScale
 }

 let unitBoxHeight = sprites.UnitBox.height;

 sprites.Units = {
    columns: 10,
    rows: 5,
    width: 66 * imageScale,
    height: 74 * imageScale
 }

 sprites.Leaders = {
    columns: 12,
    rows: 4,
    width: 47 * imageScale,
    height: 52 * imageScale,
    protraitWidth: 33,
    protraitHeight: 48
 }

 let leaderBoxHeight = sprites.Leaders.height;
 let leaderBoxWidth = sprites.Leaders.width;

 let routedSpriteIndex = 152;
 let disruptedSpriteIndex = 154;
 let fixedSpriteIndex = 138;
 let blockedSpriteIndex = 26;
 let firstArrowIndex = 27;

 function drawSprite(context, sheetName, spriteNumber, x, y) {
        let sprite = sprites[sheetName];
        let spriteSheet = ImageCache[sheetName].image;


        let spriteRow = Math.floor(spriteNumber / sprite.columns);
        let spriteColumn = spriteNumber % sprite.columns;

        let spriteX = (spriteColumn * sprite.width);
        let spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
 }

 function drawLeaderSprite(context, spriteNumber, side, selected, x, y) {
    let sprite = sprites["Leaders"];
    let spriteSheet = ImageCache["Leaders"].image;

    if (selected) {
        let boxNumber = 15;
        if (side === "Union") {
            ++boxNumber;
        }

        let spriteRow = Math.floor(boxNumber / sprite.columns);
        let spriteColumn = boxNumber % sprite.columns;
    
        let spriteX = (spriteColumn * sprite.width);
        let spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);

        spriteRow = Math.floor(spriteNumber / sprite.columns);
        spriteColumn = spriteNumber % sprite.columns;
    
        spriteX = (spriteColumn * sprite.width);
        spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprites.Leaders.protraitWidth, sprites.Leaders.protraitHeight, x + 1, y + 1, sprites.Leaders.protraitWidth,
            sprites.Leaders.protraitHeight);
    } else {
        let spriteRow = Math.floor(spriteNumber / sprite.columns);
        let spriteColumn = spriteNumber % sprite.columns;

        let spriteX = (spriteColumn * sprite.width);
        let spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);    
    }
 }

 function getMilSymbolSpriteIndex(type, formation, facing) {
    let index = 0;
    switch(type) {
        case "I":
            if (formation == Formation.LINE) {
                index = milSymbolSpriteIndices.infantry_line;
            } else {
                index = milSymbolSpriteIndices.infantry_column;
            }
            index += facing;
        break;
        case "C":
            if (formation == Formation.LINE) {
                index = milSymbolSpriteIndices.cavalry_line;
            } else {
                index = milSymbolSpriteIndices.cavalry_column;
            }
            index += facing;
        break;
        case "A":
            if (formation == Formation.LINE) {
               index = milSymbolSpriteIndices.artillery_limbered;
            } else {
                index = milSymbolSpriteIndices.artillery_unlimbered;
            }
            index += facing;
        break;
        case "L":
            index = milSymbolSpriteIndices.leader;
        break;
        case "S":
            index = milSymbolSpriteIndices.supply;
        break;
        case "R":
            index = milSymbolSpriteIndices.routed;
        break;
    }

    return index;
 }

 function getStackSpriteIndex(side, count) {
    let index = 0;

    if(side === "Union") {
        index = (count > 4) ? stackSpriteIndices.union[3] : stackSpriteIndices.union[count - 1];
    } else {
        index = (count > 4) ? stackSpriteIndices.confederate[3] : stackSpriteIndices.confederate[count - 1];
    }

    return index;
 }

 function getUnitBoxSpriteIndex(side, selected, known) {
    let index = 0;
    if(side === "Union") {
        index = 3;
    } else {
        index = 0;
    }

    if (selected) {
        ++index;
    }

    return index;
 }

  function getUnitSpriteIndex(side, baseIndex) {
     let index = 0;
     if(side === "Union") {
         index = 3;
     } else {
         index = 0;
     }

     return index;
  }

  function getFormationSpriteIndex(formation, facing) {
    let index = 0;
    if (formation == Formation.LINE) {
        index = 204 + facing;
    } else {
        index = 210 + facing;
    }

    return index;
  }

return {
    drawSprite: drawSprite,
    drawLeaderSprite: drawLeaderSprite,
    getStackSpriteIndex: getStackSpriteIndex,
    getMilSymbolSpriteIndex: getMilSymbolSpriteIndex,
    getUnitBoxSpriteIndex: getUnitBoxSpriteIndex,
    getUnitSpriteIndex: getUnitSpriteIndex,
    getFormationSpriteIndex: getFormationSpriteIndex,
    routedSpriteIndex: routedSpriteIndex,
    fixedSpriteIndex: fixedSpriteIndex,
    blockedSpriteIndex: blockedSpriteIndex,
    firstArrowIndex: firstArrowIndex,
    unitBoxHeight: unitBoxHeight,
    leaderBoxHeight: leaderBoxHeight,
    leaderBoxWidth : leaderBoxWidth
}
})();

export default {};
export {SpriteUtil};