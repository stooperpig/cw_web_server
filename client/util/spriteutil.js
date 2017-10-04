var wego = wego || {};

wego.SpriteUtil = (function() {

 var stackSpriteIndices = {
    union: [66, 68, 72, 80],
    confederate: [36,38,42,50]
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
    width: 32,
    height: 32,
 }

 sprites.UnitBox = {
    columns: 3,
    rows: 2,
    width: 101,
    height: 109
 }

 sprites.Units = {
    columns: 10,
    rows: 5,
    width: 66,
    height: 74
 }

 function drawSprite(context, sheetName, spriteNumber, x, y) {
        var sprite = sprites[sheetName];
        var spriteSheet = wego.ImageCache[sheetName].image;


        var spriteRow = Math.floor(spriteNumber / sprite.columns);
        var spriteColumn = spriteNumber % sprite.columns;

        var spriteX = (spriteColumn * sprite.width);
        var spriteY = (spriteRow * sprite.height);
        context.drawImage(spriteSheet, spriteX, spriteY, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
 }

 function getMilSymbolSpriteIndex(type, formation, facing) {
    var index = 0;
    switch(type) {
        case "I":
            if (formation == 0) {
                index = milSymbolSpriteIndices.infantry_line;
            } else {
                index = milSymbolSpriteIndices.infantry_column;
            }
            index += facing;
        break;
        case "C":
            if (formation == 0) {
                index = milSymbolSpriteIndices.cavalry_line;
            } else {
                index = milSymbolSpriteIndices.cavalry_column;
            }
            index += facing;
        break;
        case "A":
            if (formation == 0) {
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

    if(side == 1) {
        index = (count > 4) ? stackSpriteIndices.union[3] : stackSpriteIndices.union[count - 1];
    } else {
        index = (count > 4) ? stackSpriteIndices.confederate[3] : stackSpriteIndices.confederate[count - 1];
    }

    return index;
 }

return {
    drawSprite: drawSprite,
    getStackSpriteIndex: getStackSpriteIndex,
    getMilSymbolSpriteIndex: getMilSymbolSpriteIndex
}
})();