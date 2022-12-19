const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = 1400;
canvas.height = 900;

let startMouseX;
let startMouseY;
let startCardX;
let startCardY;
let offset_x;
let offset_y;

const zones = createZones();
let game = createGame();

let get_offset = function (){
    let canvas_offsets = canvas.getBoundingClientRect();
    offset_x = canvas_offsets.left;
    offset_y = canvas_offsets.top;
}
get_offset();
window.onscroll = function () {get_offset();}
window.onresize = function () {get_offset();}
canvas.onresize = function () {get_offset();}

let current_card_id;
let is_dragging = false;
let is_mouse_in_shape = function (x, y, shape) {
    let card_left = shape.x;
    let card_right = shape.x + shape.width;
    let card_top = shape.y;
    let card_bottom = shape.y + shape.height;

    if (x > card_left && x < card_right && y > card_top && y < card_bottom){
        return true;
    }
    return false;
}
let is_shape_in_shape = function (shapeOne, shapeTwo){
    let x = shapeOne.x + shapeOne.width/2;
    let y = shapeOne.y + shapeOne.height/2;

    let shape_two_left = shapeTwo.x;
    let shape_two_right = shapeTwo.x + shapeTwo.width;
    let shape_two_top = shapeTwo.y;
    let shape_two_bottom = shapeTwo.y + shapeTwo.height;

    if (x > shape_two_left && x < shape_two_right && y > shape_two_top && y < shape_two_bottom){
        return true;
    }
    return false;
}

let mouse_down = function (event){
    event.preventDefault();
    startMouseX = parseInt(event.clientX) - offset_x;
    startMouseY = parseInt(event.clientY) - offset_y;

    if (abandon_the_defense.show && is_mouse_in_shape(startMouseX, startMouseY, abandon_the_defense)){
        game.abandon_the_defense();
        return;
    }

    if (beat.show && is_mouse_in_shape(startMouseX, startMouseY, beat)){
        game.beat();
        return;
    }

    for (let card of game.cards){
        if (is_mouse_in_shape(startMouseX, startMouseY, card) && card.player === 2 && !card.onTable){
            current_card_id = card.id;
            startCardX = card.x;
            startCardY = card.y;
            is_dragging=true;
            return;
        }
    }
}

let mouse_up = function (event){
    if (!is_dragging){
        return;
    }
    event.preventDefault();

    let current_card = game.get_card_by_id(current_card_id);
    if (is_shape_in_shape(current_card, zones.playingField)){
        for (let card of game.get_cards_on_the_table()) {
            if (is_shape_in_shape(current_card, card)) {
                game.player_put_card_on_card(current_card, card, 2);
                is_dragging = false;
                return;
            }
        }
        game.player_put_card_on_table(current_card, 2);
    }
    is_dragging = false;
}

let mouse_out = function (event){}

let mouse_move = function (event){
    if (!is_dragging){
        return;
    } else {
        event.preventDefault();
        let mouseX = parseInt(event.clientX) - offset_x;
        let mouseY = parseInt(event.clientY) - offset_y;
        let dx = mouseX - startMouseX;
        let dy = mouseY - startMouseY;
        let current_card = game.get_card_by_id(current_card_id);
        current_card.x = startCardX + dx;
        current_card.y = startCardY + dy;
    }
}

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;

let create_beat = function (){
    const img = new Image();
    img.src = "img/beat.png";
    let height = 30;
    let width = 75;
    return {
        img: img,
        x: zones.playingField.x + zones.playingField.width/2 - width/2,
        y: zones.playingField.y + zones.playingField.height + 10,
        height: height,
        width: width,
        show: false,
    }
}

let create_abandon_the_defense = function (){
    const img = new Image();
    img.src = "img/abandon_the_defense.png";
    let height = 30;
    let width = 75;
    return {
        img: img,
        x: zones.playingField.x + zones.playingField.width/2 - width/2,
        y: zones.playingField.y + zones.playingField.height + 10,
        height: height,
        width: width,
        show: false,
    }
}

let create_let_him_take = function (){
    const img = new Image();
    img.src = "img/let_him_take.png";
    let height = 30;
    let width = 100;
    return {
        img: img,
        x: zones.playingField.x + zones.playingField.width/2 - width/2,
        y: zones.playingField.y + zones.playingField.height + 10,
        height: height,
        width: width,
        show: false,
    }
}

let beat = create_beat();
let abandon_the_defense = create_abandon_the_defense();
let let_him_take = create_let_him_take();
let check_win = false;
let player_win = 0;

animation({
    clear(){
        drawBg(context);
    },
    update(){
        for (let player = 1; player < 3; player++) {
            if (game.get_player_is_walking() === player){
                if (game.get_cards_deck().length === 0){
                    if (game.get_cards_player_not_on_the_table(player).length === 0){
                        player_win = player;
                        check_win = true;
                    }
                }
            }
        }

        if (!check_win) {
            beat.show = game.is_show_beat_button();
            abandon_the_defense.show = game.is_show_abandon_the_defense_button(2);
            if (!is_dragging) {
                let indentDesk = 0;
                for (let card of game.get_cards_deck().reverse()){
                    card.x = zones.decks.x + (zones.decks.width - game.deckBack.width) / 2 + indentDesk;
                    card.y = zones.decks.y + 30 - indentDesk;
                    indentDesk = indentDesk + 0.2;
                }

                let xPlayerZone = [(zones.playerOneCards.x + 5), (zones.playerTwoCards.x + 5)];
                let yPlayerZone = [(zones.playerOneCards.y + 5), (zones.playerTwoCards.y + 5)];
                for (let i = 0; i < 2; i++) {
                    for (let card of game.sort_cards(game.get_cards_player_not_on_the_table(i+1))){
                        card.x = xPlayerZone[i];
                        card.y = yPlayerZone[i];
                        xPlayerZone[i] += game.widthCard + 5 * 2;

                    }
                }

                let xPlayFieldZone = zones.playingField.x + 5;
                for (let card of game.get_cards_on_the_table()){
                    if (card.id_card_that_beats === -1) {
                        card.x = xPlayFieldZone;
                        card.y = zones.playingField.y + 5;
                        xPlayFieldZone += game.widthCard + 5 * 2;
                    } else {
                        card.x = game.get_card_by_id(card.id_card_that_beats).x + 25;
                        card.y = game.get_card_by_id(card.id_card_that_beats).y + 25;
                    }

                }
            }

            ai(game);
        }
    },
    render(){
        if (check_win){
            context.font = "48px serif";
            context.strokeText("Player "+player_win+" win", canvas.width/2, canvas.height/2);
        } else {
            context.drawImage(game.cards[game.cards.length - 1].img,
                zones.decks.x + (zones.decks.width - game.deckBack.width) / 2,
                zones.decks.y + zones.decks.height - game.heightCard - 30);

            for (let card of game.get_cards_deck()) {
                context.drawImage(game.deckBack, card.x, card.y, game.widthCard, game.heightCard);
            }
            for (let card of game.get_cards_player_not_on_the_table(1)) {
                context.drawImage(game.deckBack, card.x, card.y, game.widthCard, game.heightCard);
            }
            for (let card of game.get_cards_player_not_on_the_table(2)) {
                context.drawImage(card.img, card.x, card.y, game.widthCard, game.heightCard);
            }
            for (let card of game.get_cards_attacking_on_the_table()) {
                context.drawImage(card.img, card.x, card.y, game.widthCard, game.heightCard);
            }
            for (let card of game.get_cards_defender_on_the_table()) {
                context.drawImage(card.img, card.x, card.y, game.widthCard, game.heightCard);
            }
            if (is_dragging) {
                let current_card = game.get_card_by_id(current_card_id);
                context.drawImage(current_card.img, current_card.x, current_card.y, game.widthCard, game.heightCard);
            }

            if (beat.show) {
                context.drawImage(beat.img, beat.x, beat.y, beat.width, beat.height);
            }
            if (abandon_the_defense.show) {
                context.drawImage(abandon_the_defense.img, abandon_the_defense.x, abandon_the_defense.y, abandon_the_defense.width, abandon_the_defense.height);
            }
        }
    },
})

