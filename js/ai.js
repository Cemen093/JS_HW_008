let get_defender_card = function (defending_card){
    let cards = game.get_cards_player_not_on_the_table(1);
    cards = game.filter_cards_by_suit(cards, defending_card.suit);
    cards = game.sort_cards_by_weight(cards);
    for (let card of cards){
        if (card.weight > defending_card.weight){
            return card;
        }
    }

    if (defending_card.suit !== game.get_trump()){
        let _cards = game.get_cards_player_not_on_the_table(1);
        _cards = game.filter_cards_by_suit(_cards, game.get_trump());
        _cards = game.sort_cards_by_weight(_cards);
        if (_cards.length > 0){
            return _cards[0];
        }
    }
    return null;
}

function ai(deck) {
    if (deck.get_player_is_walking() === 2){
        for (let card of deck.get_cards_attacking_and_not_beat_on_the_table()){
            let defender_card = get_defender_card(card);
            if (defender_card !== null){
                console.log("ИИ: Карта "+defender_card.id+" покрывает карту "+card.id)
                deck.player_put_card_on_card(defender_card, card, 1);
            } else {
                console.log("ИИ: Беру");
                deck.abandon_the_defense();
            }
        }
    } else {
        let cards = deck.sort_cards(deck.get_cards_player(1));
        if (deck.get_cards_on_the_table().length === 0){
            let attacking_card = cards[0];
            console.log("ИИ: Кладу на стол карту "+attacking_card.id);
            deck.player_put_card_on_table(attacking_card, 1)
        } else {
            // подкидывать карты пока можем
            let cards_to_put = deck.sort_cards(deck.get_cards_player_can_put_on_the_table(1));
            if (cards_to_put.length > 0){
                console.log("ИИ: Кладу на стол карту "+cards_to_put[0].id);
                deck.player_put_card_on_table(cards_to_put[0], 1);
            } else if (deck.get_cards_attacking_and_not_beat_on_the_table().length === 0) {
                console.log("ИИ: Бито");
                deck.beat();
            }
        }

    }
}