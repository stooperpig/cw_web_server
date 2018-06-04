var wego = wego || {};

wego.ImageScale = 1.25;

wego.SpriteUtil = (function() {

 var stackSpriteIndices = {
    union: [66, 68, 72, 80],
    confederate: [36, 38, 42, 50]
 };

 var milSymbolSpriteIndices = {
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

 var sprites = {};

 sprites.Icons2d = {
    columns: 12,
    rows: 20,
    width: 32 * wego.ImageScale,
    height: 32 * wego.ImageScale,
 }

 sprites.UnitBox = {
    columns: 3,
    rows: 2,
    width: 101 * wego.ImageScale,
    height: 109 * wego.ImageScale
 }

 unitBoxHeight = sprites.UnitBox.height;

 sprites.Units = {
    columns: 10,
    rows: 5,
    width: 66 * wego.ImageScale,
    height: 74 * wego.ImageScale
 }

 sprites.Leaders = {
    columns: 12,
    rows: 4,
    width: 47 * wego.ImageScale,
    height: 52 * wego.ImageScale,
    protraitWidth: 33,
    protraitHeight: 48
 }

 leaderBoxHeight = sprites.Leaders.height;
 leaderBoxWidth = sprites.Leaders.width;

 var routedSpriteIndex = 152;
 var disruptedSpriteIndex = 154;
 var fixedSpriteIndex = 138;
 var blockedSpriteIndex = 26;

 function drawSprite(context, sheetName, spriteNumber, x, y) {
        var sprite = sprites[sheetName];
        var spriteSheet = wego.ImageCache[sheetName].image;


        var spriteRow = Math.floor(spriteNumber / sprite.columns);
        var spriteColumn = spriteNumber % sprite.columns;

        var spriteX = (spriteColumn * sprite.width);
        var spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
 }

 function drawLeaderSprite(context, spriteNumber, side, selected, x, y) {
    var sprite = sprites["Leaders"];
    var spriteSheet = wego.ImageCache["Leaders"].image;

    if (selected) {
        var boxNumber = 15;
        if (side === "Union") {
            ++boxNumber;
        }

        var spriteRow = Math.floor(boxNumber / sprite.columns);
        var spriteColumn = boxNumber % sprite.columns;
    
        var spriteX = (spriteColumn * sprite.width);
        var spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);

        var spriteRow = Math.floor(spriteNumber / sprite.columns);
        var spriteColumn = spriteNumber % sprite.columns;
    
        var spriteX = (spriteColumn * sprite.width);
        var spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprites.Leaders.protraitWidth, sprites.Leaders.protraitHeight, x + 1, y + 1, sprites.Leaders.protraitWidth,
            sprites.Leaders.protraitHeight);
    } else {
        var spriteRow = Math.floor(spriteNumber / sprite.columns);
        var spriteColumn = spriteNumber % sprite.columns;

        var spriteX = (spriteColumn * sprite.width);
        var spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);    
    }
 }

 function getMilSymbolSpriteIndex(type, formation, facing) {
    var index = 0;
    switch(type) {
        case "I":
            if (formation == wego.Formation.LINE) {
                index = milSymbolSpriteIndices.infantry_line;
            } else {
                index = milSymbolSpriteIndices.infantry_column;
            }
            index += facing;
        break;
        case "C":
            if (formation == wego.Formation.LINE) {
                index = milSymbolSpriteIndices.cavalry_line;
            } else {
                index = milSymbolSpriteIndices.cavalry_column;
            }
            index += facing;
        break;
        case "A":
            if (formation == wego.Formation.LINE) {
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
    var index = 0;

    if(side === "Union") {
        index = (count > 4) ? stackSpriteIndices.union[3] : stackSpriteIndices.union[count - 1];
    } else {
        index = (count > 4) ? stackSpriteIndices.confederate[3] : stackSpriteIndices.confederate[count - 1];
    }

    return index;
 }

 function getUnitBoxSpriteIndex(side, selected, known) {
    var index = 0;
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
     var index = 0;
     if(side === "Union") {
         index = 3;
     } else {
         index = 0;
     }

     return index;
  }

  function getFormationSpriteIndex(formation, facing) {
    var index = 0;
    if (formation == wego.Formation.LINE) {
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
    unitBoxHeight: unitBoxHeight,
    leaderBoxHeight: leaderBoxHeight,
    leaderBoxWidth : leaderBoxWidth
}
})();