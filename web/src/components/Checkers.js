import React, { Component} from 'react';

import Phaser from 'phaser';

export class Checkers extends Component {

    constructor() {
        super();

        new Phaser.Game({
            width: 700, // Width of the game in pixels
            height: 400, // Height of the game in pixels
            backgroundColor: '#3498db', // The background color (blue)
            scene: mainScene, // The name of the scene we created
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

class mainScene {
    // The 3 methods currenlty empty
  
    preload() {
      // This method is called once at the beginning
      // It will load all the assets, like sprites and sounds  
    }
    create() {
        this.floor = new Phaser.Geom.Rectangle(100, 550, 800, 50);
        this.graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.graphics.fillRectShape(this.floor);
        this.graphics.setInteractive(this.floor).on('pointerdown', () => this.event('Click') );;
      // This method is called once, just after preload()
      // It will initialize our scene, like the positions of the sprites
    }
    update() {
      // This method is called 60 times per second after create() 
      // It will handle all the game's logic, like movements
    }

    event(e) {
        console.log('Click')
        console.log(e)
    }
}