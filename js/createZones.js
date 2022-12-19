function createZones(){
    const indentPlayersZone = 50;
    const heightPlayersZone = 150;

    const _zones = {
        playerOneCards: {
            x: indentPlayersZone,
            y: indentPlayersZone,
            width: canvas.width - indentPlayersZone*2,
            height: heightPlayersZone,
        },
        playerTwoCards: {
            x: indentPlayersZone,
            y: canvas.height-indentPlayersZone-heightPlayersZone,
            width: canvas.width - indentPlayersZone*2,
            height: heightPlayersZone,
        },
        decks: {
            x: indentPlayersZone,
            y: indentPlayersZone*2+heightPlayersZone,
            width: 110,
            height: canvas.height - heightPlayersZone*2 - indentPlayersZone*4,
        },
        playingField: {
            x: indentPlayersZone*2 + 110,
            y: indentPlayersZone*2+heightPlayersZone,
            width: canvas.width - 110 - indentPlayersZone*3,
            height: canvas.height - heightPlayersZone*2 - indentPlayersZone*4,
        },
    };
    return _zones;
};