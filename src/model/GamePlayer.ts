import { WarMatch } from "../game/WarMatch";
import Objective from "./Objective";
import PlayerType, { Player } from "./Player";
import { Territory } from "./Territory";

export enum playerCOLORS  {
    'black' = 0x4f4f4d,
    'green' = 0x13a95b,
    'yellow' = 0xe9ae02,
    'blue' = 0x1a54a5,
    'pink' = 0xde2587,
    'red' = 0xec3829,
}

export interface Placeble{
    "all": number,
    "south-america": number,
    "asia": number,
    "oceania": number,
    "africa": number,
    "north-america": number,
    "europe": number
}

// export interface Placed {
//     "all": number
// }

export class GamePlayer extends Player{
    
    // public cards: Array<Car
    public color: number;
    public totalArmies: number;
    public totalTerritories: number;
    public playerText: Phaser.GameObjects.Text;
    public armies;
    public destroyed = false;
    public placed: Placeble = {
        "all":0, "south-america":0,    
        "asia": 0,
        "oceania": 0,
        "africa": 0,
        "north-america": 0,
        "europe": 0
    }
    public placeble: Placeble = {
        "all":0, 
        "south-america":0,    
        "asia": 0,
        "oceania": 0,
        "africa": 0,
        "north-america": 0,
        "europe": 0
    }
    public gainedTerritory = false;
    public hand: number[] = []
    public warMatch: WarMatch;
    public objective: Objective;
    public aimer: GamePlayer;

    // public ia: boolean;
    constructor(data:PlayerType, color: number, warMatch: WarMatch) {
        super(data);
        this.color = color;
        this.warMatch = warMatch;
    }

    destroyPlayerText(){
        this.playerText.destroy()
    }

    showGamePlayer(x: number, y: number, currentPlayerId:number, scene:Phaser.Scene) {
        let isCurrentPlayer = currentPlayerId === this.id;
        this.playerText = scene.add.text(x,y,`${this.name} ⚒: ${this.totalArmies} ⦻: ${this.totalTerritories}`)
        .setColor(`#${this.color.toString(16)}`)
        if(isCurrentPlayer){
            this.playerText.setBackgroundColor("#ffffff55")
        }
        this.playerText.setInteractive( { useHandCursor: true  } );

        this.playerText.on("pointerdown",()=>{
            //Mostrar os dados do jog, etc
        })
    }

    isCurrentPlayer(){
        return this.id === this.warMatch.turn.getCurrentPlayerId()
    }

    setPlaceble(type:string, quantity:number){
        this.placeble[type] = quantity;
    }

    addPlaceble(type:string, quantity:number){
        this.placeble[type] += quantity;
    }

    placeArmie(type:string, quantity:number){
        if(this.hasArmiesToPlace()){
            this.placeble[type] -= quantity;
            this.placed[type] += quantity;
        }
    }

    updateTotalTerritories(){
        this.totalTerritories = this.warMatch.getPlayerTerritories(this).length;
    }

    unplaceArmie(type:string, quantity:number){
        // if(this.placeble)
        this.placeble[type] += quantity;
        this.placed[type] -= quantity;
    }

    clearPlaced() {
        Object.keys(this.placed).forEach(key =>{
            this.placeble[key] = 0;
            this.placed[key] = 0;
        })
    }

    hasArmiesToPlace(){
        let placesToPlace = Object.keys(this.placeble).filter(key => {
            return this.placeble[key] > 0
        }).length
        
        return placesToPlace > 0
    }

    isOwner(territory: Territory){
        return this.id === territory.owner?.id
    }

    hasBeenDestroyed(){
        return this.totalTerritories === 0
    }

    // resetPlaced(){
    //     this.placed.all = 0
    // }

    resetPlaces(){
        
    }
}