function drawBg(context){
    const bg = new Image();
    bg.src = "img/bg.jpg";
    context.drawImage(bg, 0, 0);

    context.beginPath();
    context.rect(zones.playerOneCards.x, zones.playerOneCards.y, zones.playerOneCards.width, zones.playerOneCards.height);
    context.rect(zones.playerTwoCards.x, zones.playerTwoCards.y, zones.playerTwoCards.width, zones.playerTwoCards.height);
    context.rect(zones.decks.x, zones.decks.y, zones.decks.width, zones.decks.height);
    context.rect(zones.playingField.x, zones.playingField.y, zones.playingField.width, zones.playingField.height);
    context.fillStyle = "gray";
    context.fill();
}