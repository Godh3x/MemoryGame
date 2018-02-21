/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
    this.gs = gs;
    this.cards = [];
    this.state = 'idle';
    this.message;
    this.proggres = 0;

    var flippedcard;

    this.initGame = function () {
        var missingc = 0;
        while(missingc < 8) {
            var pos1, pos2;
            var tiles = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"];

            do {
                pos1 = Math.floor(Math.random() * 16);
            } while(typeof this.cards[pos1] !== 'undefined');
            this.cards[pos1] = new MemoryGameCard(tiles[missingc]);

            do {
                pos2 = Math.floor(Math.random() * 16);
            } while(typeof this.cards[pos2] !== 'undefined');

            this.cards[pos2] = new MemoryGameCard(tiles[missingc]);

            missingc++;
        }

        this.message='MemoryGame';

        this.loop();
    }

    this.draw = function () {
        this.gs.drawMessage(this.message);

        for(c in this.cards) {
            this.cards[c].draw(gs,c);
        }
    }

    this.loop = function () {
        var self = this;
        setInterval(function () {
            self.draw();
        }, 16);
    }

    this.onClick = function (cardId) {
        if(this.state === 'no-clicks' || this.cards[cardId].state==='found') {
            return;
        }
        else if(this.state === 'idle') {
            this.state = 'one';
            this.cards[cardId].flip();
            flippedcard = cardId;
        }
        else if(this.state === 'one' && flippedcard !== cardId) {
            this.state = 'idle';
            this.cards[cardId].flip();
            if(this.cards[cardId].compareTo(this.cards[flippedcard])) {
                this.message = 'Match found!!';
                this.cards[cardId].found();
                this.cards[flippedcard].found();
                this.proggres++;
                if(this.proggres === 8){
                    this.state = 'no-clicks';
                    this.message = 'You win!!';
                }
            }
            else {
                this.message = 'Try again';
                this.state = 'no-clicks';
                var self = this;
                setTimeout(function() {
                    self.state = 'idle';
                    self.cards[cardId].flip();
                    self.cards[flippedcard].flip();
                    }, 1000);
            }
        }
    }
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
    this.id = id;
    this.state = 'down';

    this.flip = function () {
        if(this.state === 'found') return;

        if(this.state === 'up')
            this.state = 'down';
        else
            this.state = 'up';
    }

    this.found = function () {
        this.state = 'found';
    }

    this.compareTo = function (otherCard) {
        return otherCard.id === this.id;
    }

    this.draw = function (gs, pos) {
        gs.draw(this.state === 'down' ? 'back' : this.id, pos);
    }
};
