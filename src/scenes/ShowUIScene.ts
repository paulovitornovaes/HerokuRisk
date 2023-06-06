import { WarMatch } from "../game/WarMatch";
import { Card } from "../model/Card";
import { playerCOLORS } from "../model/GamePlayer";
import eventsCenter from "../services/EventsCenter";
export default class ShowUIScene extends Phaser.Scene {
    public warMatch: WarMatch;
    public isOpen: boolean = false;
    public INITIALX: number = 20;
    public INITIALY: number = 450;
    finishPhaseButton: Phaser.GameObjects.Text;
    displayPhase: Phaser.GameObjects.Text;
    displayMessage: Phaser.GameObjects.Text;
    displayObjective: Phaser.GameObjects.Text;
    cards: Card[];
    startButton: any;
    changeCardsButton: Phaser.GameObjects.Arc;
    changeCardsText: Phaser.GameObjects.Text;


    constructor() {
        super("ShowUIScene")
    }

    preload(){
        this.load.html('show-ui' , 'assets/html/show-ui.html');
    }

    init(data: { warMatch: WarMatch; }){
        let {warMatch} = data;
        this.warMatch = warMatch;
    }

    destroyUI(){
        if(this.cards){
            this.cards.forEach(card => {
                card.destroy()
            });
        }
        if(this.displayMessage){
            this.displayMessage.destroy()
        }

        if(this.displayPhase){
            this.displayPhase.destroy()
        }

        if(this.displayObjective){
            this.displayObjective.destroy()
        }

        if(this.finishPhaseButton){
            this.finishPhaseButton.destroy()
        }

    }

    refresh(){
        this.destroyUI()

        let currentPlayer = this.warMatch.getCurrentPlayer()
        
        // this.displayMessage.destroy()
        let counter = 0;
        this.warMatch.turn.playersOrders.forEach(playerId => {
            let player = this.warMatch.getPlayerById(playerId);
            if(player && player.playerText){
                player.destroyPlayerText()
            }
            
            let currentPlayerId = this.warMatch.turn.getCurrentPlayerId();
            this.warMatch.setPlayerTotalArmies(player)
            this.warMatch.setPlayerTotalTerritories(player)
            player.showGamePlayer(this.INITIALX, this.INITIALY + (counter * 20),currentPlayerId,this)
            counter++;
        })

        this.finishPhaseButton = this.add.text(this.INITIALX, this.INITIALY + (counter * 20), "Finalizar")
        .setOrigin(0).setInteractive({ useHandCursor: true  }).setBackgroundColor("#fcefse")

        this.displayPhase = this.add.text(this.INITIALX, this.INITIALY + (++counter * 20), 
        `Fase Atual: ${this.warMatch.turn.getCurrentPhaseName()}`).setColor("#000")

        this.displayMessage = this.add.text(this.INITIALX, this.INITIALY + (++counter * 20),
        ``)
        .setColor("#000")
        this.updateArmies()

        this.displayObjective = this.add.text(this.INITIALX + 970, this.INITIALY +100, 
            this.warMatch.board.getObjectiveText(currentPlayer),
            {wordWrap: { width: 230, useAdvancedWrap: true }, backgroundColor: "black"}).setPadding(10)

        this.changeCardsButton = this.add.circle(450, 570 , 30, 0x000, 10).setInteractive({ useHandCursor: true })
        this.changeCardsText = this.add.text(450, 570, "Trocar", {fontSize:"12px", color:"#fff"}).setOrigin(0.5)

        this.changeCardsButton.on("pointerover", ()=>{
            this.changeCardsButton.setStrokeStyle( 3, 0xf0f0f0)
        })

        this.changeCardsButton.on("pointerout", ()=>{
            this.changeCardsButton.setStrokeStyle( 3, 0x000)
        })

        this.changeCardsButton.on("pointerdown", ()=>{
            if(this.warMatch.turn.getCurrentPhaseName()==="Mobilizar"){
                let playerCardsToExchange = this.cards.filter(c=>c.isSelected).map(c=>c.territory)
                this.warMatch.board.exchangeCards(currentPlayer, playerCardsToExchange )
                this.updateArmies()
                // this.displayMessage.destroy()
                // this.displayPhase.destroy()
                this.refresh()
            }
        })

        //Eventos
        this.finishPhaseButton.on("pointerdown", () =>{
            if(this.warMatch.hasConditionToNextPhase()){
                eventsCenter.emit("next-phase",currentPlayer)
                this.nextPhase()
            }
            // this.nextPhase()
        })

        this.finishPhaseButton.on("pointerover", () =>{
            this.finishPhaseButton.setAlpha(0.5)
        })
        this.finishPhaseButton.on("pointerout", () =>{
            this.finishPhaseButton.setAlpha(1)
        })

        eventsCenter.on("player-destroyed", (player) =>{
            this.refresh()
        })
        eventsCenter.on("game-finished", (player)=>{
            this.refresh()
        })

        
        this.cards = this.warMatch.board.showHand(350, 380  , currentPlayer, this)

    }

    updateArmies(){
        let player = this.warMatch.getCurrentPlayer()

        // console.log(this.warMatch.getCurrentPlayer())
        this.displayMessage.setText("")

        Object.keys(this.warMatch.getCurrentPlayer()?.placeble).forEach(key =>{
            this.displayMessage.text += key + ': ' + player?.placeble[key] + ' - '
        })
               
    }

    create(){
        this.input.keyboard.on("keydown-Q",()=>{
            this.scene.stop("ShowUIScene");
        })

        this.input.keyboard.on("keydown-F",()=>{
            if(this.warMatch.hasConditionToNextPhase()){
                eventsCenter.emit("next-phase",this.warMatch.getCurrentPlayer())
                this.nextPhase()
            }
            // this.scene.stop("ShowUIScene");
        })

        eventsCenter.on("territory-clicked", ()=>{
            // this.displayPhase.destroy()
            // this.displayMessage.destroy()
            // this.destroyUI()
            this.refresh()
        })
        this.refresh();
    }

    nextPhase(){
        this.warMatch.turn.nextPhase()
        // this.displayPhase.destroy()
        // this.displayMessage.destroy()
        this.refresh()
    }
}