export class Card extends Phaser.GameObjects.Container {
    public isSelected: boolean = false;
    public cardRectangle: Phaser.GameObjects.Rectangle;
    public territory: any;
    public id: number;

    constructor(data: any) {
        let {x,y, scene, card, territory, continent} = data
        
        
        // let cardText = new Phaser.GameObjects.BitmapText(x , y, scene, "pressstart", territory.name, 12, Phaser.GameObjects.BitmapText.ALIGN_CENTER)
        let cardRectangle = new Phaser.GameObjects.Rectangle(scene, x, y, 100, 150, 0x000).setOrigin(0.5)            

        let figureText = new Phaser.GameObjects.Text(scene, x , y, card.symbol, {color: "black", align:"center", fontSize: "32px"}).setOrigin(0.5)
        .setColor(continent.color).setStroke("#ccc", 1)

        let continentText = new Phaser.GameObjects.Text(scene, x , y + 40, continent.name.replace(" ", "\n") , {color: "black", align:"center"}).setOrigin(0.5)
        .setColor(continent.color).setStroke("#ccc", 1)

        let territoryText = new Phaser.GameObjects.Text(scene, x , y - 40, territory.name.replace(" ", "\n") , {color: "black", fontSize: "14px", align:"center"}).setOrigin(0.5)
        .setColor(continent.color).setStroke("#ccc", 1)

        super(scene, x, y, [cardRectangle, continentText, figureText, territoryText,])
        this.setScale(0.5)
        this.cardRectangle = cardRectangle
        this.territory = territory
        this.id = territory.id

        cardRectangle.setInteractive({ useHandCursor: true  })
        cardRectangle.on("pointerover",(pointer, object)=>{
            this.scene.tweens.add({
                targets: this,
                props: {
                    scale: 1,
                    x: x - 120 - 50,
                    y: y - 250,
                    depth: 10
                },
                duration: 500,
                ease: 'Power3'
            })
        })
        cardRectangle.on("pointerout",()=>{
            this.scene.tweens.add({
                targets: this,
                props: {
                    scale: 0.5,
                    x: x,
                    y: y,
                    depth: 1
                },
                duration: 500,
                ease: 'Power3'
            })
        })
        cardRectangle.on("pointerdown", ()=>{
            this.select()
        })

        this.scene.add.existing(this)
    }

    select(){
        if(this.isSelected){
            this.cardRectangle.setStrokeStyle(0, 0xFFFFFFFF)
        }else{
            this.cardRectangle.setStrokeStyle(5, 0xFFFFFFFF)
        }
        this.isSelected = !this.isSelected
    }
}