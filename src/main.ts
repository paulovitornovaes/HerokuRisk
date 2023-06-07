import Phaser from 'phaser';
import './style.css';
import PreloadScene from './scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
    width: 1227,
    height: 628,
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#B4CDFF',
    dom: {
      createContainer: true,
    },
    scene: [PreloadScene]
  };

export class WarGame extends Phaser.Game{
    constructor(config:Phaser.Types.Core.GameConfig) {
      super(config); 
    }
}

new WarGame(config);



