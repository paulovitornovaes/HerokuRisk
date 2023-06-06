import { GamePlayer } from "../model/GamePlayer";
import eventsCenter from "../services/EventsCenter";
import Util from "../services/Util";

export enum Phases{
    MOBILIZAR = 0,
    ATACAR = 1,
    FORTIFICAR = 2
}
export class Turn{
    public totalPlayers: number = 0;
    public currentPlayer: number = 0;
    public moves: number = 0;
    public playersOrders: number[] = [];
    public currentPhase: number = -1;
    public phasesNames: string[] = ["Mobilizar","Atacar","Fortificar"];
    
    setTotalPlayers(){
        this.totalPlayers = this.playersOrders.length;
    }


    shufflePlayerOrder(players:number[]){
        this.playersOrders = Util.shuffle(players);
    }
    
    init(players:number[]) {
        this.shufflePlayerOrder(players);
        // this.currentPhase = Phases.MOBILIZAR;
        this.nextPhase();
        this.setTotalPlayers();
    }

    nextPlayer(): void{
        this.currentPlayer++;
        this.currentPlayer %= this.totalPlayers;
    }

    getCurrentPlayerId(){
        return this.playersOrders[this.currentPlayer]
    }

    getCurrentPlayer(players:GamePlayer[]){
        return players.find(player =>{
            return player.id === this.getCurrentPlayerId()
        })
    }

    getCurrentPhaseName(){
        return this.phasesNames[this.currentPhase]
    }

    nextPhase(){
        this.currentPhase++;
        if(!(this.currentPhase < this.phasesNames.length)){
            this.nextTurn();
        }
        this.currentPhase %= this.phasesNames.length
        eventsCenter.emit(this.getCurrentPhaseName(), this.getCurrentPhaseName())
    }

    nextTurn(){
        eventsCenter.emit("next-turn")
        this.nextPlayer();
    }
}