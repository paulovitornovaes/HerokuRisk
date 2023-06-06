import Phaser from "phaser";
import { TerritoryFactory } from './services/territory-factory'
import { WarMatch } from "./game/WarMatch";
import { Phases, Turn } from "./game/Turn";
import { GamePlayer } from "./model/GamePlayer";
import { Territory } from "./model/Territory";
import { Board } from "./game/Board";
import eventsCenter from "./services/EventsCenter";
import PlayerType from "./model/Player";
import InitGameScene from "./scenes/InitGameScene";
import Util from "./services/Util";
import Objective from "./model/Objective";



const COLORS = {
    'black': 0x4f4f4d,
    'green': 0x03a95e,
    'yellow': 0xe9ae02,
    'blue': 0x1a54a5,
    'pink': 0xde2587,
    'red': 0xec3829,
}

export class MainGameScene extends Phaser.Scene {

    public warMatch!: WarMatch;
    public inputKeys: object;
    continentsData: any;
    cardsData: any;
    objectiveCardsData: any;
    constructor() {
        super('MainGameScene');
        
    }
    
    create(): void {
        this.continentsData = this.cache.json.get('continents').continents;
        this.cardsData = this.cache.json.get('cards').cards;
        this.objectiveCardsData = this.cache.json.get('objectives').objectives
  
        this.warMatch = new WarMatch(new Board(), new Turn(), this);
       
        this.add.bitmapText(10,10,'pressstart','WAR')


      
        //Eventos
        eventsCenter.on("init", (players: PlayerType[]) => {
            if(this.warMatch.init(players)){
                this.scene.stop("InitGameScene")
                this.scene.run("ShowUIScene",{warMatch: this.warMatch})
            }else{
                this.scene.launch("InitGameScene")
            }
        })

        eventsCenter.on("restart", (msg:string) => {
            this.scene.restart()
        })

        eventsCenter.on("showModal", (msg:string) => {
            console.log(msg)
        })

        this.input.keyboard.on("keydown-Q",()=>{
            this.scene.launch("ShowUIScene",{warMatch: this.warMatch})
        })

        eventsCenter.on(this.warMatch.turn.phasesNames[Phases.MOBILIZAR],(msg: any)=>{
            //Calcular total de exercitos
            this.warMatch.getTotalArmiesToPlace()

                                    
        })

        eventsCenter.on(this.warMatch.turn.phasesNames[Phases.ATACAR],(msg: any)=>{
            
        })

        eventsCenter.on(this.warMatch.turn.phasesNames[Phases.FORTIFICAR],(msg: any)=>{
            
        })

        eventsCenter.on("territory-clicked", (territory:Territory) =>{
            if(this.warMatch.turn.currentPhase === Phases.MOBILIZAR){

                territory.mobilize(this.warMatch.board.continents)

            }else if(this.warMatch.turn.currentPhase === Phases.ATACAR){

                this.warMatch.board.checkAttackCondition(
                    territory, this.warMatch.getCurrentPlayer()
                )
            }else if(this.warMatch.turn.currentPhase === Phases.FORTIFICAR){

                this.warMatch.board.checkFortifyCondition(
                    territory, this.warMatch.getCurrentPlayer()
                )
            }
        })

        eventsCenter.on("next-phase", (player:GamePlayer) =>{
            player.clearPlaced();
        })

        eventsCenter.on("next-turn" , () =>{
            if(this.warMatch.getCurrentPlayer()?.gainedTerritory){
                this.warMatch.board.drawCard(this.warMatch.getCurrentPlayer())
            }
        })

        eventsCenter.on("check-victory", (data)=>{
            Objective.checkVictoryCondition(this.warMatch, data)
        })

        eventsCenter.on("game-finished", (player)=>{
            // if(this.warMatch.getCurrentPlayer()){
            this.add.bitmapText(this.game.config.width/2,this.game.config.height/2,"pressstart", `Fim de Jogo \n o player ${player.name} venceu`).setDepth(1000).setOrigin(0.5)
            // }
        })
        

    
        let players = [
            {id: 1, name: 'Tiago', ia: 'false', color: 'black'},
            {id: 2, name: 'Paulo', ia: 'false', color: 'blue'},
            {id: 3, name: 'Rafa', ia: 'false', color: 'red'},
            {id: 4,name: "Ygor",ia: false,color: 'green'},
            {id: 5,name: "Thali",ia: false,color: 'yellow'},
            {id: 6,name: "Edu",ia: false,color: 'pink'}
        ]

        // this.scene.run("InitGameScene")
        // eventsCenter.emit('init', players);

        if(this.warMatch.init(players)){
            this.scene.run("ShowUIScene",{warMatch: this.warMatch})
        }
        
    }

    update(): void {

    }
}