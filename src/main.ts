// import { FirstGameScene } from './first-scene';
import Phaser from 'phaser';
// import './reset.css';
import './style.css';
import { MainGameScene } from './main-scene';
// import { GamePlayer } from './model/GamePlayer';
import PreloadScene from './scenes/PreloadScene';
import TurnControllerScene from './scenes/TurnControllerScene';
import InitGameScene from "./scenes/InitGameScene"
import ShowUIScene from './scenes/ShowUIScene';

const config: Phaser.Types.Core.GameConfig = {
    width: 1227,
    height: 628,
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#B4CDFF',
    dom: {
      createContainer: true,
    },
    scene: [PreloadScene, MainGameScene,TurnControllerScene, InitGameScene, ShowUIScene]
  };

export class WarGame extends Phaser.Game{
    constructor(config:Phaser.Types.Core.GameConfig) {
      super(config); 
    }
}

new WarGame(config);



