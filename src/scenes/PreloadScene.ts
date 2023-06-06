export default class PreloadScene extends Phaser.Scene{
    constructor() {
        super('PreloadScene')
    }

    preload(){
        //Carregando os territórios
        // let territorios = this.load.aseprite('territorios', 
        // '../assets/images/mapa_war.png',
        // '../assets/images/mapa_war.json')
         //Carregando os territórios
         let territorios = this.load.aseprite('territorios', 
         '../assets/images/mapa_war.png',
         '../assets/images/mapa_war.json')    

        //Carregando a fonte
        this.load.bitmapFont('pressstart', 'assets/fonts/pressstart.png','assets/fonts/pressstart.fnt') 
        
        // //Carregando dados do mapa
        this.load.json('frame', 'assets/images/mapa_war.json');
        this.load.json('territories', 'assets/data/territories.json');
        this.load.json('continents', 'assets/data/continents.json');
        this.load.json('cards', 'assets/data/cards.json');
        this.load.json('objectives', 'assets/data/objectives.json');
    }

    create(){
        this.scene.start('MainGameScene')
    }
}