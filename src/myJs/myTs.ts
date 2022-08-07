export function myTestFunction(x: string): number {
    console.log(x)
    return 1
}

const userBasic = {
    sight: 40
}

class User{
    public profile: {
        strength: number,
        agility: number,
        intelligence: number,
        sans: number,
        sight: number
    }
    public itemArray: Array<Item> = []
    pickItem(x: Item) {
        this.itemArray = this.itemArray.concat(x)
    }
    dropItem(x: Item) {
        const id = x.profile.id
        const index = this.itemArray.findIndex((ele) => {
            ele.profile.id === id
        })
        if (index >= 0) {
            this.itemArray.splice(index, 1)
        }
    }
    useItem(x: Item) {
        const id = x.profile.id
    }
    constructor(strength, agility, intelligence, sans, b: Array<Item>) {
        this.profile.strength = strength
        this.profile.agility = agility
        this.profile.intelligence = intelligence
        this.profile.sans = sans
        this.profile.sight = userBasic.sight
        this.itemArray = b.concat(this.itemArray)
    }
}

interface ItemProfile{
    id: string,
    uuid: string | undefined,
    name: string,
    intro: string,
    atk: number,
    def: number,
    hp: number,
    life: number, // 道具可使用时间
    weight: number
}

class Item {
    public profile: ItemProfile
    constructor(a: ItemProfile) {
        this.profile = a
        this.profile.uuid = crypto.randomUUID(8)
    }
}

class Flashlight extends Item {
    public light: 0
    private addLight: 0
    on() {
        this.light = this.addLight
    }
    off() {
        this.light = 0
    }
}

const test = new Flashlight()