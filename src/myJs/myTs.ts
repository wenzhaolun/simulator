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
    move(a: number) {

    }
    constructor(a: UserProfile, b: Array<Item>) {
        this.profile = a
        this.itemArray = this.itemArray.concat(b)
    }
}

class Item {
    public use: Function
    constructor(name: string) {
        this.use = (user: User) => {
            
        }
}
