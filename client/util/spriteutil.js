var wego = wego || {};

wego.SpriteUtil = (function() {
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

return {
    drawSprite: drawSprite
}
})();