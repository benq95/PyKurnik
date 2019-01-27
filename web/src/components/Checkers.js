import React, { Component} from 'react';

import Phaser from 'phaser';

const FIELD_SIZE = 100;

const START_CORNER_X = 10;

const START_CORNER_Y = 10;

const BLACK_COLOR = 0x663300

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

    }
    create() {
        this.graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.positions = [];
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
                pos.draw();
                black = !black;
            }
            black = !black;
        }

        // draw pawns
        this.pawns = [];

        // draw whites
        for (var i = 0; i < 3; i++) {
            for (var j = 1; j < 8; j+=2) {
                var pawn = new Pawn(j-(i%2),i,WHITE_PAWN_COLOR,this.graphics);
                this.pawns.push(pawn);
                pawn.draw();
            }
        }

        // draw blacks
        for (var i = 5; i < 8; i++) {
            for (var j = 1; j < 8; j+=2) {
                var pawn = new Pawn(j-(i%2),i,BLACK_PAWN_COLOR,this.graphics);
                this.pawns.push(pawn);
                pawn.draw();
            }
        }
        
    }
    update() {
      // This method is called 60 times per second after create() 
      // It will handle all the game's logic, like movements
    }
}

class Position {
    constructor(x, y, color, graphics) {
        this.graphics = graphics;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        this.graphics.fillStyle(this.color);
        this.graphics.fillRect(START_CORNER_X + this.x*FIELD_SIZE, START_CORNER_Y + this.y*FIELD_SIZE, FIELD_SIZE, FIELD_SIZE);
    }
}

class Pawn {
    constructor(x, y, color, graphics) {
        this.graphics = graphics;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        this.graphics.fillStyle(this.color);
        this.graphics.fillCircle(START_CORNER_X + this.x*FIELD_SIZE + FIELD_SIZE/2, START_CORNER_Y + this.y*FIELD_SIZE + FIELD_SIZE/2, PAWN_R);
    }
}

