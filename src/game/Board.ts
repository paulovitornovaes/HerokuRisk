import { Card } from "../model/Card";
import { GamePlayer, playerCOLORS } from "../model/GamePlayer";
import Objective from "../model/Objective";
import { Territory } from "../model/Territory";
import eventsCenter from "../services/EventsCenter";
import Util from "../services/Util";
import { Phases } from "./Turn";
import { WarMatch } from "./WarMatch";

const exchangeTable = {
    "1": 4,
    "2": 2,
    "3": 2,
    "4": 2,
    "5": 2,
    "6": 3,
    "all": 5
}

export class Board {
    public territories: Array<Territory> = [];
    public continents = {};
    public cardFigures = {};
    public objectives = {};
    public territoryCards: number[] = [];
    public objectiveCards: number[] = [];
    public deck: number[] = [];
    public discard: number[] = [];
    public exchangeNumber: number = 1;
    public exchangeArmies: number = exchangeTable[this.exchangeNumber];
    

    init(territoryIds: number[], continents, cardFigures, objectives) {
        
        this.setInitialTerritoryCards(territoryIds)
        this.objectives = objectives
        this.setInitialObjectiveCards()
        this.shuffleTerritoryCards();
        this.shuffleObjectiveCards();
        this.continents = continents
        this.cardFigures = cardFigures
    }
    
    getTerritoryById(id: number){
        return this.territories.find(territory => territory.id === id);
    }

    shuffleTerritoryCards() {
        this.territoryCards = Util.shuffle(
            this.territoryCards
        )
    }

    shuffleObjectiveCards() {
        this.objectiveCards = Util.shuffle(
            this.objectiveCards
        )
    }

    shuffleDeck(){
        this.deck = Util.shuffle(
            this.deck
        )
    }

    reshuffleDeck(){
        this.deck = this.discard
        this.discard = []
        this.shuffleDeck()
    }

    drawCard(player: GamePlayer) {
        player.hand.push(this.deck.pop())
        player.gainedTerritory = false
    }

    drawObjective(player: GamePlayer, warMatch: WarMatch) {
        let objectiveCardId = this.objectiveCards.pop()
        let objectiveColor = playerCOLORS[this.objectives[objectiveCardId].condition.color]
        let samePlayerObjective = player.color === objectiveColor
        let withoutColorInPlay = false
        if(objectiveColor){
            withoutColorInPlay = warMatch.players.filter(player => player.color === objectiveColor).length === 0
        }
        if(samePlayerObjective || withoutColorInPlay ){
            objectiveCardId =13
        }
        
        let objective = new Objective(warMatch, player, this.objectives[objectiveCardId])
        if(objective.condition.color){
            warMatch.getPlayerByColor(objective.condition.color).aimer = player
        }
        player.objective = objective
    }

    resetObjective(warMatch:WarMatch, player: GamePlayer){
        console.log(warMatch, player, this.objectives[13])
        player.objective = new Objective(warMatch, player, this.objectives[13])
    }

    getObjectiveText(player: GamePlayer){
        return this.objectives[player.objective.id].description
    }

    showHand(x:number, y:number, player: GamePlayer, scene:Phaser.Scene) {
        let hand = []
        player.hand.forEach((cardId, index) =>{
            let territory = this.getTerritoryById(cardId)
            let card = new Card({
                x: x + (35 * index),
                y,
                scene,
                card: this.cardFigures[territory.card],
                territory,
                // card: this.cardFigures[territory?.card],
                continent: this.continents[territory?.continent]
            })
            hand.push(card);
        })
        return hand
    }

    exchangeCards(currentPlayer: GamePlayer | undefined, cards: Territory[]) {
        //Checar se tem cards selecionados e se são no máximo 3
        if(!cards || cards.length != 3){
            console.log("Devem ser selecionadas três cartas")
            return false
        }else if(this.checkExchangeCondition(cards)){
            currentPlayer?.addPlaceble("all", this.exchangeArmies)
            this.dropCards(currentPlayer, cards)
            this.exchangeNumber++;
            if(exchangeTable[this.exchangeNumber]){
                this.exchangeArmies += exchangeTable[this.exchangeNumber]
            }else{
                this.exchangeArmies += exchangeTable.all
            }
            return true
        }
    }

    checkExchangeCondition(cards: Territory[]):boolean {
        let equalCondition = (cards[0].card === cards[1].card && cards[1].card ===cards[2].card && cards[0].card === cards[2].card)
        let diferentCondition = (cards[0].card !== cards[1].card && cards[1].card !==cards[2].card && cards[0].card !== cards[2].card)
        if(equalCondition || diferentCondition){
            return true
        }
        return false
    }    

    dropCards(player: GamePlayer, cards: Territory[]){
        cards.forEach(card => this.discard.push(card.id));
        // this.discard = cards
        cards.forEach(card => {
            if(card.owner === player){
                card.placeArmies(2)
            }
            player.hand.splice(player.hand.indexOf(card.id),1)            
        })
    }

    public setTerritories(territories: Array<Territory>):void{
        this.territories = territories
    }    

    public hasSelectedTerritory(): boolean{
        const selectedTerritories = this.territories.filter(territory =>{
                return territory.isSelected
            }
        )
        return selectedTerritories.length > 0
    }

    public hasHighlightedTerritory(): boolean{
        const highlightedTerritories = this.territories.filter(territory =>{
                return territory.isHighlighted
            }
        )
        return highlightedTerritories.length > 0
    }

    public clearBoard(): void{
        this.territories.forEach(territory =>{
            territory.isSelected = false
            territory.isHighlighted = false
            territory.updateTint()
            territory.updateText()
        })
    }

    public getSelected(): Territory {
        const selectedTerritories = this.territories.filter(territory =>{
                return territory.isSelected
            }
        )
        return selectedTerritories[0]
    }

    public getHighlighted(): Territory {
        const highlightedTerritories = this.territories.filter(territory =>{
                return territory.isHighlighted
            }
        )
        return highlightedTerritories[0]
    }

    setInitialTerritoryCards(territories: number[]){
        this.territoryCards = territories
    }

    setInitialObjectiveCards() {
        // Setup com um pouco menos de cartas
        // let filter = [13, 1,2,3,4,5,6]
        // let filter = [7,8,9,10,11,12]

        this.objectiveCards = Object.keys(this.objectives).map(key =>{
            // console.log(key)
            return this.objectives[key].id
        })
        // .filter(key => filter.indexOf(key) > -1)
    }

    hasTerritoryWIthoutOwner(){
        const woTerritory = this.territories.filter(territory =>{
            return territory.owner === undefined
        })
        return woTerritory.length > 0
    }

    checkAttackCondition(territory: Territory, player?: GamePlayer) {
        // Checar se é o dono
        if(territory.owner?.id === player?.id){
            this.clearBoard()
            territory.select()
            territory.highlightNeighbours(this.territories)
        }else if(territory.isHighlighted){
            let attacker = this.getSelected()
             this.attack(attacker, territory) 
        }else if(this.hasSelectedTerritory()){
            console.log("Ataque inválido")
        }
    }

    attack(attacker: Territory, defender: Territory){
        let attackQuantity = Math.min(attacker.armies - 1, 3)
        let defenseQuantity = Math.min(defender.armies, 3)
        let attackResult = this.playDices(attackQuantity)
        let defenseResult = this.playDices(defenseQuantity)
        let combatResult = this.checkAttackResults(attackResult, defenseResult)

        attacker.armies -= combatResult[0]
        defender.armies -= combatResult[1]

        if(defender.armies === 0){
            let transfer = attackQuantity - combatResult[0]
            attacker.armies -= transfer
            let conquered = defender.owner
            defender.conquer(attacker.owner, transfer)
            conquered?.updateTotalTerritories()
            attacker.owner.gainedTerritory = true
            eventsCenter.emit("check-victory", {attacker: attacker.owner, defender: conquered, acao: Phases.ATACAR}, )
        }
        this.clearBoard()
    }

    checkAttackResults (attackResult:number[], defenseResult:number[])  {
        let attackLosses = 0
        let defenseLosses = 0
        let comparations = Math.min(attackResult.length, defenseResult.length)
        for (let i = 0; i < comparations; i++) {
            if(attackResult[i] > defenseResult[i]){
                defenseLosses++
            }else{
                attackLosses++
            }
        }
        // console.log([attackLosses, defenseLosses])
        return [attackLosses, defenseLosses]
    }

    playDices(n:number){
        const results = Array.from({length: n}, () => Math.floor(Math.random() * 6) + 1);
        return results.sort((a,b)=> b - a)
    }

    checkFortifyCondition(territory: Territory, player: GamePlayer | undefined) {
        if(territory.isHighlighted){
            let origin = this.getSelected()
            this.fortify(origin, territory)
            eventsCenter.emit("check-victory", {acao: Phases.FORTIFICAR})
        }else if(territory.owner?.id === player?.id){
            this.clearBoard()
            territory.select()
            territory.highlightOwnedNeighbors(this.territories)
        }else if(this.hasSelectedTerritory()){
            console.log("Movimento inválido")
        }
    }

    fortify(origin: Territory, destiny: Territory) {
        if(origin.armies > 1){
            origin.unplaceArmies(1);
            destiny.placeArmies(1);
            this.clearBoard();
        }else{
            console.log("Movimento inválido")
        }
    }

    checkTotality(player: GamePlayer | undefined) {
        Object.keys(this.continents).forEach(key => {
            if(this.hasTotality(player, key)){
                player?.setPlaceble(this.continents[key].slug, this.continents[key].totality)
                console.log(player?.placeble)
            }
        })
    }

    hasTotality(player:GamePlayer, continent: string) {
        let totalTerritoriesInContinent = this.territories.filter(territory =>{
            return territory.continent === parseInt(continent)
        }).length
        let totalPlayerTerritoriesInContinent = this.getPlayerTerritories(player).filter(territory =>{
            return territory.continent === parseInt(continent)
        }).length
        return totalTerritoriesInContinent === totalPlayerTerritoriesInContinent
    }

    getPlayerTerritories(player:GamePlayer){
        
        const territoriesOwned =  this.territories.filter((territory) =>{
            return territory.owner?.id === player.id
        })
        return territoriesOwned
    }    
}