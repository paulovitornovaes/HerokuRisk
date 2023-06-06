import PlayerType from "../model/Player";
import eventsCenter from "../services/EventsCenter"

export default class InitGameScene extends Phaser.Scene{

    constructor() {
        super("InitGameScene")
    }

    preload(){
        this.load.html('init-game', 'assets/html/init-game.html')
    }

    create(){
        const form = this.add.dom(30,1000).createFromCache('init-game').setOrigin(0);
        form.addListener('submit')
        form.on('submit', (e: { preventDefault: () => void; target: HTMLFormElement | undefined }) => {
            e.preventDefault()
            let formData = new FormData(e.target)
            let players: PlayerType[] = [];
            
            for(let i = 1; i < 7; i++) {
                if(formData.get(`player${i}.name`) !== "") {
                    let player:PlayerType = {
                        id: i,
                        name: formData.get(`player${i}.name`),
                        ia: false || formData.get(`player${i}.ia`),
                        color: formData.get(`player${i}.color`)
                    }
                    players.push(player)
                }
            }
            eventsCenter.emit('init', players);
            this.scene.stop();
        })

        this.tweens.add({
            targets: form,
            y: 300,
            duration: 500,
            ease: 'Power3'
        })

        
    }

}
