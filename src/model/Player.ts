export default interface PlayerType{
    id: number,
    name: string,
    ia: boolean,
    color: string
}

export class Player {
    public id: number;
    public name: string;
    
    constructor(data:Player) {
        {
            this.id = data.id,
            this.name = data.name
        }

    }
}

