import { GamePlayer, playerCOLORS } from "../model/GamePlayer";
import PlayerType, { Player } from "../model/Player";
import { Territory } from "../model/Territory";
import eventsCenter from "../services/EventsCenter";
import { TerritoryFactory } from "../services/territory-factory";
import { Board } from "./Board";
import { Phases, Turn } from "./Turn";

enum Status {
    SETUP = 0,
    STARTED = 1,
    FINISHED = 2
}
export class WarMatch{
    

    public scene: Phaser.Scene;
    public players: Array<GamePlayer> = [];
    public turn: Turn;
    public board: Board;
    public status: number = Status.SETUP
    constructor(board: Board,  turn: Turn, scene: Phaser.Scene) {
        this.turn = turn;
        this.board = board;
        this.scene = scene;
    }

    getTotalPlayers(): number {
        return this.players.length;
    }

    addPlayer(player: GamePlayer): void {
        this.players.push(player);
    }

    removePlayerFromMatch(defender: GamePlayer) {
        let indexPlayers = this.players.findIndex(player =>{
            return player.id === defender.id
        })
        let indexOrder = this.turn.playersOrders.findIndex(playerId => {
            return playerId === defender.id
        })
        this.players.splice(indexPlayers, 1);
        this.turn.playersOrders.splice(indexOrder, 1);
        this.turn.setTotalPlayers()
        defender.destroyPlayerText()
        console.log(this.players)
        console.log(this.turn.playersOrders)
    }

    getPlayerById(id: number): GamePlayer {
        return this.players.find(player => player.id === id)
    }

    getPlayerByColor(color: number | string){
        if(typeof color === 'string'){
            color = playerCOLORS[color]
        }
        return this.players.find(player => player.color === color);        
    }

    shufflePlayerInBoard(): void {
        this.board.territoryCards.forEach((territoryCard) =>{
            let territory = this.board.getTerritoryById(territoryCard)
            this.board.discard.push(territoryCard)
            let player = this.getPlayerById(this.turn.getCurrentPlayerId())
            territory?.setOwner(player)
            territory?.setInitialArmies()
            territory?.updateText()
            this.turn.nextPlayer()
        })
    }

    setPlayerTotalTerritories(player:GamePlayer){
        const territoriesOwned =  this.board.territories.filter((territory) =>{
            return territory.owner?.id === player.id
        })
        player.totalTerritories = territoriesOwned.length
    }   

    getPlayerTerritories(player:GamePlayer):Array<Territory> {
        const territoriesOwned =  this.board.territories.filter((territory) =>{
            return territory.owner?.id === player.id
        })
        return territoriesOwned
    }

    //Está com erro no reduce !!!!!!!!!
    setPlayerTotalArmies(player:GamePlayer){
        const totalArmies = this.getPlayerTerritories(player).reduce(
            function(previousValue, currentValue:Territory){
                return previousValue + currentValue.armies
            },0
        )
        player.totalArmies = totalArmies;
    }

    init(players: PlayerType[]):boolean {

        if(players.length < 3){
            let msg = "Deve haver pelo menos três jogadores"
            eventsCenter.emit('restart', msg)
            eventsCenter.emit('showModal', msg)
            return false
        }
        
        players.forEach((player: PlayerType) =>{
            this.addPlayer(new GamePlayer(player, playerCOLORS[player.color], this))
        })
        
        let playersIds = players.map(player => {
            return player.id
        })

        this.turn.init(playersIds);

        let territoryIds = this.scene.cache.json.get('territories').territories

        .map((territory:Territory) => {
            return territory.id;
        })
        this.board.setTerritories(TerritoryFactory.loadCountries(this.scene))
        this.board.init(territoryIds, this.scene.continentsData, this.scene.cardsData, this.scene.objectiveCardsData)

        this.shufflePlayerInBoard()
        this.drawPlayersObjectives()
        this.board.reshuffleDeck()
        // this.getCurrentPlayer()?.hand.push(Math.round(Math.random()*41)+1)
        // this.getCurrentPlayer()?.hand.push(Math.round(Math.random()*41)+1)
        // this.getCurrentPlayer()?.hand.push(Math.round(Math.random()*41)+1)
        // this.getCurrentPlayer()?.hand.push(Math.round(Math.random()*41)+1)
        // this.getCurrentPlayer()?.hand.push(Math.round(Math.random()*41)+1)

        eventsCenter.emit(this.turn.phasesNames[Phases.MOBILIZAR],this.turn.phasesNames[Phases.MOBILIZAR])
        return true
    }

    drawPlayersObjectives() {
        this.players.forEach(player =>{
            this.board.drawObjective(player, this);
        })
    }

    getTotalArmiesToPlace() {
        let player = this.getCurrentPlayer()
        this.setPlayerTotalTerritories(player)
        player?.setPlaceble("all", Math.max(Math.floor(player.totalTerritories/2), 3))
        this.board.checkTotality(player)


        // let general = game.getPlayerTerritoriesCount(player)
        // player.placeble.all = Math.max(Math.floor(general/2), 3)
    }

    getCurrentPlayer(){
        return this.turn.getCurrentPlayer(this.players)
    }

    hasConditionToNextPhase() :boolean{
        //Mobilizar
        switch (this.turn.currentPhase) {
            case Phases.MOBILIZAR:
                return true
                 //Mao maior que 5
                let handSize = this.getCurrentPlayer().hand.length === 5
                //Existe exercito para alocar
                let hasArmiesToPlace = this.getCurrentPlayer()?.hasArmiesToPlace()
                if(handSize || hasArmiesToPlace){
                    return false
                }else{
                    return true
                }
                break;
            case Phases.ATACAR:
                console.log(this.turn.getCurrentPhaseName())
                return true
                break;
            case Phases.FORTIFICAR:
                console.log(this.turn.getCurrentPhaseName())
                return true
                break;
            default:
                break;
        }

    }
}