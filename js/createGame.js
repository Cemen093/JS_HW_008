function createGame() {
    const indentCard = 5;
    const widthCard = 100;
    const heightCard = 140;

    const deckBack = new Image();
    deckBack.src = "img/card/deckBack.png";
    let cards = [];
    for( let i of [...Array(52).keys()]){
        let tmpCard = new Image();
        tmpCard.src = "img/card/"+i+".png";
        cards.push({
            id: i,
            x: 0,
            y: 0,
            width: widthCard,
            height: heightCard,
            weight: Math.floor(i%13+2),
            suit: Math.floor(i/13),
            player: 0,
            onTable: false,
            id_card_that_beats: -1,
            beat: false,
            discard_pile: false,
            img: tmpCard,
            show: false,
        });
    }
    let trump;

    let playerIsWalking = 2;

    let get_player_is_walking = function (){
        return playerIsWalking;
    }

    let get_player_is_defender = function (){
        return playerIsWalking === 1 ? 2 : 1;
    }

    let get_trump = function (){
        return trump;
    }

    let get_card_by_id = function (id){
        for (let card of cards){
            if (card.id === id){
                return card;
            }
        }
        return null;
    }

    let get_cards_player = function (player){
        let arr = [];
        for (let card of cards){
            if (card.player === player){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_deck = function (){
        let arr = [];
        for (let card of cards){
            if (card.player === 0){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_beat = function (){
        let arr = [];
        for (let card of cards){
            if (card.player === 3){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_on_the_table = function (){
        let arr = [];
        for (let card of cards){
            if (card.onTable){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_player_not_on_the_table = function (player){
        let arr = [];
        for (let card of get_cards_player(player)){
            if (!card.onTable){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_attacking_on_the_table = function (){
        let arr = [];
        for (let card of get_cards_on_the_table()){
            if (card.onTable && (card.id_card_that_beats === -1)){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_defender_on_the_table = function (){
        let arr = [];
        for (let card of get_cards_on_the_table()){
            if (card.onTable && (card.id_card_that_beats !== -1)){
                arr.push(card);
            }
        }
        return arr;
    }

    let get_cards_attacking_and_not_beat_on_the_table = function (){
        let arr = [];
        for (let attacking_card of get_cards_attacking_on_the_table()){
            let card_beat = false;
            for (let defender_card of get_cards_defender_on_the_table()){
                if (attacking_card.id === defender_card.id_card_that_beats){
                    card_beat = true;
                    break;
                }
            }
            if (!card_beat){
                arr.push(attacking_card);
            }
        }
        return arr;
    }

    let get_cards_player_can_put_on_the_table = function (player){
        let arr = [];
        for (let card_player of get_cards_player_not_on_the_table(player)){
            for (let card_on_table of get_cards_on_the_table()){
                if (card_player.weight === card_on_table.weight){
                    arr.push(card_player);
                    break;
                }
            }
        }
        return arr;
    }

    let change_player_is_walking = function (){
        playerIsWalking = playerIsWalking === 1 ? 2 : 1;
    }

    let shuffle_deck = function (){
        cards.sort(() => Math.random() - 0.5);
        trump = cards[51].suit;
    }

    let deal_cards = function () {
        for (let i of [...Array(6).keys()]){
            cards[i*2].player = 1;
            cards[i*2+1].player = 2;
        }
    }

    let is_possible_put_the_card_on_the_table = function (_card, player){
        //ходит атакующий игрок?
        let sequence_check = playerIsWalking === player;

        //стол пустой?
        let tableIsEmpty = true;
        for (let card of cards){
            if (card.onTable){
                tableIsEmpty = false;
                break;
            }
        }
        //номинал такой карты есть на столе?
        let checkWeight = false;
        for (let card of cards){
            if (card.onTable && card.weight === _card.weight){
                checkWeight = true;
                break;
            }
        }
        return sequence_check && (tableIsEmpty || checkWeight);
    }

    let is_possible_put_the_card_on_the_card = function (player_card, defender_card, player){
        if (defender_card.onTable &&
            !(defender_card.id_card_that_beats !== -1) &&
            (defender_card.player === get_player_is_walking()) &&
            player === get_player_is_defender()
        ){
            if (player_card.suit === defender_card.suit){
                return player_card.weight > defender_card.weight;
            } else {
                return player_card.suit === trump
            }
        } else {
            return false;
        }
    }

    let player_put_card_on_table = function (player_card, player){
        if (is_possible_put_the_card_on_the_table(player_card, player)){
            player_card.onTable = true;
        }
    }

    let player_put_card_on_card = function (player_card, defender_card, player){
        if (is_possible_put_the_card_on_the_card(player_card, defender_card, player)){
            beat_card(player_card, defender_card);
        }
    }

    let player_draw_cards = function (player){
        let count_card_player = get_cards_player(player).length;
        let cards_deck = get_cards_deck();
        if (count_card_player < 6){
            let count_draw_player = Math.min(6 - get_cards_player(player).length, cards_deck.length);
            for (let i of [...Array(count_draw_player).keys()]){
                cards_deck[i].player = player;
            }
        }
    }

    let players_draws_cards = function (){
        player_draw_cards(1);
        player_draw_cards(2);
    }

    let is_show_abandon_the_defense_button = function (player){
        console.log()
        return (get_player_is_defender() === player) && (get_cards_attacking_and_not_beat_on_the_table().length > 0);
    }

    let is_show_beat_button = function (){
        return (playerIsWalking === 2 &&
                get_cards_on_the_table().length !== 0) &&
            (get_cards_attacking_and_not_beat_on_the_table().length === 0);
    }

    let beat = function (){
        for (let card of get_cards_on_the_table()){
            card.onTable = false;
            card.id_card_that_beats = -1;
            card.player = 3;
            card.beat = true;
        }
        change_player_is_walking();
        players_draws_cards();
    }

    let abandon_the_defense = function (){
        for (let card of cards){
            if (card.onTable){
                card.onTable = false;
                card.id_card_that_beats = -1;
                card.player = get_player_is_defender();
            }
        }
        players_draws_cards();
    }

    let filter_cards_by_suit = function (_cards, _suit){
        let arr = [];
        for (let card of _cards){
            if (card.suit === _suit){
                arr.push(card);
            }
        }
        return arr;
    }

    let filter_cards_no_trump = function (_cards) {
        let arr = [];
        for (let card of _cards){
            if (card.suit !== trump){
                arr.push(card);
            }
        }
        return arr;
    }

    let sort_cards = function (_cards) {
        let arr = filter_cards_no_trump(_cards);
        arr = sort_cards_by_weight(arr);

        let arr2 = filter_cards_by_suit(_cards, trump);
        arr2 = sort_cards_by_weight(arr2);

        return arr.concat(arr2);
    }

    let sort_cards_by_weight = function (_cards){
        return _cards.sort((a, b) => a.weight < b.weight ? -1 : 1);
    }

    let beat_card = function (attacking_card, attacked_card){
        attacking_card.onTable = true;
        attacking_card.id_card_that_beats = attacked_card.id;
    }

    shuffle_deck();
    deal_cards();

    return {
        indentCard: indentCard,
        widthCard: widthCard,
        heightCard: heightCard,
        deckBack: deckBack,
        cards: cards,
        shuffle_deck: shuffle_deck,
        deal_cards: deal_cards,
        get_trump: get_trump,
        player_put_card_on_card: player_put_card_on_card,
        player_put_card_on_table: player_put_card_on_table,
        is_show_beat_button: is_show_beat_button,
        beat: beat,
        is_show_abandon_the_defense_button: is_show_abandon_the_defense_button,
        abandon_the_defense: abandon_the_defense,
        get_player_is_walking: get_player_is_walking,
        get_cards_player: get_cards_player,
        get_cards_deck: get_cards_deck,
        get_cards_beat: get_cards_beat,
        get_cards_on_the_table: get_cards_on_the_table,
        get_cards_attacking_on_the_table: get_cards_attacking_on_the_table,
        get_cards_defender_on_the_table: get_cards_defender_on_the_table,
        get_cards_attacking_and_not_beat_on_the_table: get_cards_attacking_and_not_beat_on_the_table,
        get_card_by_id: get_card_by_id,
        filter_cards_by_suit: filter_cards_by_suit,
        get_cards_player_not_on_the_table: get_cards_player_not_on_the_table,
        get_cards_player_can_put_on_the_table: get_cards_player_can_put_on_the_table,
        sort_cards: sort_cards,
        sort_cards_by_weight: sort_cards_by_weight,
        beat_card: beat_card,
    };
}