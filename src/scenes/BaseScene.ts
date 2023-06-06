export default class BaseScene extends Phaser.Scene{
    config: any
    constructor(key:string, config:any) {
        super(key)
        this.config = config
    }
}