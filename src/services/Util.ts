import { WarMatch } from "../game/WarMatch"

export default class Util{

    static shuffle(items:number[]){
        const shuffledItems = items.map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(function (value) {
            return value.value
        })
        return shuffledItems
    }    
}