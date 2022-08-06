export function myTestFunction(x: string): number {
    console.log(x)
    return 1
}

interface UserProfile{
    strength: number,
    agility: number,
    intelligence: number,
    sans: number,
    sight: number
}

class User{
    public profile: UserProfile
    public itemArray: Array<Item> = []
    pickItem(x: Item) {
        this.itemArray = this.itemArray.concat(x)
    }
    dropItem(x: Item) {
        const id = x.profile.id
        this.itemArray.indexOf((ele: Item) => {
            if (ele.profile.id === id) {
            }
        })
    }
    constructor(a: UserProfile, b: Array<Item>) {
        this.profile = a
        this.itemArray = b.concat(this.itemArray)
    }
}

interface ItemProfile{
    id: number,
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
    }
}
