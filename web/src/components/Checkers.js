import React, { Component} from 'react';

import Phaser from 'phaser';

const FIELD_SIZE = 100;

const START_CORNER_X = 10;

const START_CORNER_Y = 10;

const BLACK_COLOR = 0x663300

const MARKED_COLOR = 0x00ff00

const BLACK_PAWN_COLOR = 0x000000;

const WHITE_PAWN_COLOR = 0xffff00

const PAWN_R = 30;

export class Checkers extends Component {

    constructor() {
        super();

        new Phaser.Game({
            width: 900, // Width of the game in pixels
            height: 900, // Height of the game in pixels
            backgroundColor: '#000000', // The background color (blue)
            scene: MainScene, // The name of the scene we created
            physics: { default: 'arcade' }, // The physics engine to use
            parent: 'checkers', // Create the game inside the <div id="game"> 
          });
    }

    render() {
        return (
            <div id="checkers"></div>
        );
    }
}

class MainScene {
  
    preload() {
        this.load.image('black', 'black.svg.png');
        this.load.image('white', 'white.svg.png');
    }
    create() {
        this.graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.positions = [];
        this.blacks = [];
        this.whites = [];
        this.beatingPawn = null;
        this.gameStarted = false;

        this.ws = new WebSocket('ws://localhost:8999');
        this.playerName = 'player' + Math.floor(Math.random() * 100).toString();
        var playerName  = this.playerName;

        var webSocket = this.ws;
        this.ws.onopen = function () {
            webSocket.send(playerName);
        };

        var deserialize = this.deserialize;
          
        this.ws.onmessage = function (event) {
            var data = event.data;
            if(data === 'white') {
                this.myMove = true;
                this.gameStarted = true;
                return;
            }
            if(data === 'black') {
                this.myMove = false;
                this.gameStarted = true;
                return;
            }
            if(!this.gameStarted)
            {
                var players = data.trim().split(",");
                players.forEach(s => {
                    if(s !== playerName) {
                        webSocket.send(s);
                        this.gameStarted = true;
                    }
                });
                return;
            }

            
            
            deserialize(data);
            this.myMove = !this.myMove;
        };


        this.myMove = false;
        
        var black = false;

        // draw board
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var color;
                if (black) {
                    color = BLACK_COLOR;
                } else {
                    color = 0xffffff
                }
                var pos = new Position(j,i,color, this.graphics);
                this.positions.push(pos);
                //pos.draw();
                black = !black;
            }
            black = !black;
        }

        // draw pawns
        this.pawns = [];

        // draw whites
        for (var i = 0; i < 3; i++) {
            for (var j = 1; j < 8; j+=2) {
                var pawn = new Pawn(j-(i%2),i,WHITE_PAWN_COLOR,this.graphics, this);
                this.pawns.push(pawn);
                this.whites.push(pawn);
                //pawn.draw();
            }
        }

        // draw blacks
        for (var i = 5; i < 8; i++) {
            for (var j = 1; j < 8; j+=2) {
                var pawn = new Pawn(j-(i%2),i,BLACK_PAWN_COLOR,this.graphics, this);
                this.pawns.push(pawn);
                this.blacks.push(pawn);
                //pawn.draw();
            }
        }

        this.positions.forEach(pos => pos.draw());

        this.pawns.forEach(pawn => pawn.draw());

        this.scoreText = this.add.text(16, 16, 'You have won', { fontSize: '32px', fill: '#ffffff' });
        
    }

    serialize() {
        var data = {
            pawns : this.pawns,
            blacks : this.blacks,
            whites : this.whites
        };
        return JSON.stringify(data, (k,v) => {
            if(k === 'graphics') return undefined;
            if(k === 'scene') return undefined;
            if(k === 'img') return undefined;
        });
    }

    deserialize(data) {
        data = JSON.parse(data);
        this.blacks = [];
        this.whites = []
        data.blacks.forEach(element => {
            var pw = new Pawn(element.x,element.y,element.color,this.graphics,this);
            pw.isDame = element.isDame;
            this.blacks.push(pw);
        });
        data.whites.forEach(element => {
            var pw = new Pawn(element.x,element.y,element.color,this.graphics,this);
            pw.isDame = element.isDame;
            this.whites.push(pw);
        });
        this.pawns = data.pawns;
        this.blacks = data.blacks;
        this.whites = data.whites;
    }

    update() {
        

        //this.button = this.add.sprite(xy.x, xy.y - 96, 'start').setInteractive();

        this.currentState = this.input.activePointer.isDown;

        if (this.currentState && !this.oldState) {
            this.getTilePosition(this.input.activePointer.position);
            this.redraw();
        }

        this.oldState = this.currentState;

    }

    redraw() {
        this.graphics.destroy();
        this.graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });

        this.positions.forEach(pos => {
            pos.graphics = this.graphics;
            pos.draw()
        });

        this.pawns.forEach(pawn => {
            pawn.graphics = this.graphics;
            pawn.draw()
        });
    }

    getTilePosition(pos) {
        console.log(pos);
        var x = pos.x;
        var y = pos.y;

        x -= START_CORNER_X;
        x = Math.trunc(x / FIELD_SIZE);

        y -= START_CORNER_Y;
        y = Math.trunc(y/ FIELD_SIZE);
        console.log(x);
        console.log(y);

        if(!this.myMove) {
            return;
        }

        if(this.beatingPawn === null) {
            this.getCurrentMovePawns().forEach(pawn => {
                if (pawn.x === x && pawn.y === y) {
                    this.positions.forEach(pos => pos.makeMove());
                    var possibleMoves = pawn.calculatePossibleMoves(this.pawns, this.getCurrentOffset());
                    possibleMoves.forEach(m => {
                        this.positions.forEach(p => {
                            if(m.x === p.x && m.y === p.y) {
                                p.markAsPossibleMove(m);
                            }
                        });
                    });
                    return;
                }
            });
        }

        this.positions.forEach(pos => {
            if (pos.x === x && pos.y === y) {
                var move = pos.makeMove();
                if (move !== null) {
                    move.pawn.x = move.x;
                    move.pawn.y = move.y;
                    if(move.pawnToBeat !== null) {
                        for (var i = 0; i < this.pawns.length; i++) {
                            if(this.pawns[i].x === move.pawnToBeat.x && this.pawns[i].y === move.pawnToBeat.y) {
                                this.pawns.splice(i,1);
                            }
                        }

                        for (var i = 0; i < this.getCurrentOppositePawns().length; i++) {
                            if(this.getCurrentOppositePawns()[i].x === move.pawnToBeat.x && this.getCurrentOppositePawns()[i].y === move.pawnToBeat.y) {
                                this.getCurrentOppositePawns().splice(i,1);
                                i--;
                            }
                        }
                        var possibleMoves = move.pawn.calculatePossibleMoves(this.pawns, this.getCurrentOffset());
                        if (possibleMoves.length > 0 && possibleMoves[0].pawnToBeat !== null) {
                            this.beatingPawn = move.pawn;
                            this.positions.forEach(pos => pos.makeMove());
                            var possibleMoves = this.beatingPawn.calculatePossibleMoves(this.pawns, this.getCurrentOffset());
                            possibleMoves.forEach(m => {
                                this.positions.forEach(p => {
                                    if (m.x === p.x && m.y === p.y) {
                                        p.markAsPossibleMove(m);
                                    }
                                });
                            });
                        } else {
                            this.beatingPawn = null;
                        }
                    }
                    if(this.beatingPawn === null) {
                        this.positions.forEach(pos => pos.makeMove());
                        this.myMove = !this.myMove;
                        this.pawns.forEach(pawn => {
                            if (pawn.color === BLACK_PAWN_COLOR && pawn.y === 0) {
                                pawn.isDame = true;
                            }
                            if (pawn.color === WHITE_PAWN_COLOR && pawn.y === 7) {
                                pawn.isDame = true;
                            }
                        });
                        this.ws.send(this.serialize());
                    }
                }
            }
        });
    }

    getCurrentMoveColor() {
        if (this.myMove) {
            return WHITE_PAWN_COLOR;
        }

        return BLACK_PAWN_COLOR;
    }

    getCurrentMovePawns() {
        if (this.myMove) {
            return this.whites;
        }

        return this.blacks;
    }

    getCurrentOffset() {
        if (this.myMove) {
            return 1;
        }

        return -1;
    }

    getCurrentOppositePawns() {
        if (this.myMove) {
            return this.blacks;
        }

        return this.whites;
    }
}

class Position {
    constructor(x, y, color, graphics) {
        this.graphics = graphics;
        this.x = x;
        this.y = y;
        this.color = color;
        this.move = null;
        this.originalColor = color;
        this.graphic = null;
    }

    draw() {
        this.graphics.fillStyle(this.color);
        this.graphic = this.graphics.fillRect(START_CORNER_X + this.x*FIELD_SIZE, START_CORNER_Y + this.y*FIELD_SIZE, FIELD_SIZE, FIELD_SIZE);
    }

    markAsPossibleMove(move) {
        this.move = move;
        this.color = MARKED_COLOR;
    }

    makeMove() {
        this.color = this.originalColor;
        var mv = this.move;
        this.move = null;
        return mv;
    }
}

class Pawn {
    constructor(x, y, color, graphics, scene) {
        this.graphics = graphics;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.color = color;
        this.isDame = false
        this.graphic = null;
        this.img = null;
    }

    draw() {
        this.graphics.fillStyle(this.color);
        
        if(this.isDame) {
            if(this.img !== null) {
                this.img.destroy();
            }
            this.img = this.scene.add.sprite(START_CORNER_X + this.x*FIELD_SIZE + FIELD_SIZE/2, START_CORNER_Y + this.y*FIELD_SIZE + FIELD_SIZE/2,
                    this.color === WHITE_PAWN_COLOR ? 'white' : 'black'
                );
            this.img.displayWidth = FIELD_SIZE*(3/4);
            this.img.displayHeight = FIELD_SIZE*(3/4);
        } else {
            this.graphic = this.graphics.fillCircle(START_CORNER_X + this.x*FIELD_SIZE + FIELD_SIZE/2, START_CORNER_Y + this.y*FIELD_SIZE + FIELD_SIZE/2, PAWN_R);
        }
    }

    calculatePossibleMoves(pawns, offset) {
        var possibleMoves = [];

        var move1 = {
            x: this.x + 1,
            y: this.y + offset,
            pawn: this,
            pawnToBeat: null
        }

        var move2 = {
            x: this.x - 1,
            y: this.y + offset,
            pawn: this,
            pawnToBeat: null
        }

        var isPawn = false;
        pawns.forEach(p => {
            if (p.x === move1.x && p.y === move1.y) {
                isPawn = true;
                if (p.color !== this.color) {
                    move1 = {
                        x: this.x + 2,
                        y: this.y + offset + offset,
                        pawn: this,
                        pawnToBeat: p
                    }
                    var isPawnOnSecondPos = false;
                    pawns.forEach(sP => {
                        if (sP.x === move1.x && sP.y === move1.y) {
                            isPawnOnSecondPos = true;
                        }
                    });
                    if (!isPawnOnSecondPos) {
                        possibleMoves.push(move1);
                    }
                }
            }
        });
        if(!isPawn) {
            possibleMoves.push(move1);
        }

        isPawn = false;
        pawns.forEach(p => {
            if (p.x === move2.x && p.y === move2.y) {
                isPawn = true;
                if (p.color !== this.color) {
                    move2 = {
                        x: this.x - 2,
                        y: this.y + offset + offset,
                        pawn: this,
                        pawnToBeat: p
                    }
                    var isPawnOnSecondPos = false;
                    pawns.forEach(sP => {
                        if (sP.x === move2.x && sP.y === move2.y) {
                            isPawnOnSecondPos = true;
                        }
                    });
                    if (!isPawnOnSecondPos) {
                        possibleMoves.push(move2);
                    }
                }
            }
        });
        if(!isPawn) {
            possibleMoves.push(move2);
        }

        if(this.isDame)
        {
            var move1 = {
                x: this.x + 1,
                y: this.y - offset,
                pawn: this,
                pawnToBeat: null
            }
    
            var move2 = {
                x: this.x - 1,
                y: this.y - offset,
                pawn: this,
                pawnToBeat: null
            }
    
            var isPawn = false;
            pawns.forEach(p => {
                if (p.x === move1.x && p.y === move1.y) {
                    isPawn = true;
                    if (p.color !== this.color) {
                        move1 = {
                            x: this.x + 2,
                            y: this.y - offset - offset,
                            pawn: this,
                            pawnToBeat: p
                        }
                        var isPawnOnSecondPos = false;
                        pawns.forEach(sP => {
                            if (sP.x === move1.x && sP.y === move1.y) {
                                isPawnOnSecondPos = true;
                            }
                        });
                        if (!isPawnOnSecondPos) {
                            possibleMoves.push(move1);
                        }
                    }
                }
            });
            if(!isPawn) {
                possibleMoves.push(move1);
            }
    
            isPawn = false;
            pawns.forEach(p => {
                if (p.x === move2.x && p.y === move2.y) {
                    isPawn = true;
                    if (p.color !== this.color) {
                        move2 = {
                            x: this.x - 2,
                            y: this.y - offset - offset,
                            pawn: this,
                            pawnToBeat: p
                        }
                        var isPawnOnSecondPos = false;
                        pawns.forEach(sP => {
                            if (sP.x === move2.x && sP.y === move2.y) {
                                isPawnOnSecondPos = true;
                            }
                        });
                        if (!isPawnOnSecondPos) {
                            possibleMoves.push(move2);
                        }
                    }
                }
            });
            if(!isPawn) {
                possibleMoves.push(move2);
            }
        }

        for(var i = 0; i < possibleMoves.length; i++) {
            if(possibleMoves[i].x > 7 || possibleMoves[i].x < 0 || possibleMoves[i].y > 7 || possibleMoves[i].y < 0) {
                possibleMoves.splice(i,1);
                i--;
            }
        }

        var beat = false;
        for(var i = 0; i < possibleMoves.length; i++) {
            if(possibleMoves[i].pawnToBeat !== null) {
                beat = true;
            }
        }

        for(var i = 0; i < possibleMoves.length; i++) {
            if(possibleMoves[i].pawnToBeat === null && beat) {
                possibleMoves.splice(i,1);
                i--;
            }
        }  

        return possibleMoves;
    }
}

