import { Actor } from "../actor";
import { randomEnumKey } from "../../common";
import { type _ALLITEM_FUNC, _ITEM_TYPE } from "../../item/static";
import type { Playground } from "../../playground";
import { Flashlight } from "../../item/flashlight";
import { Gun } from "../../item/gun";
import { Sword } from "../../item/sword";

/**道具生成和分派员，隐形的。 */
export class ItemCreator extends Actor {
    public getOpponentAmount: () => number = () => {
        const playerAmount = 1
        const enemyAmount = this.affectPlayground().affectEnemyGroup().getEnemyAmount()
        return playerAmount + enemyAmount
    }
    public getAllOpponent: () => { uuid: string; name: string; }[] = () => {
        const player = this.affectPlayground().affectPlayer()
        const enemyGroup = this.affectPlayground().affectEnemyGroup().getEnemyGroup()
        
        let res: Array<{ uuid: string; name: string; }> = []
        res.push({uuid: player.getUUID(), name: 'player'})
        res = res.concat(enemyGroup)

        return res
    }

    /**生成道具 */
    private createItem (type: _ITEM_TYPE) {
        switch (type) {
            case _ITEM_TYPE.FLASHLIGHT: {
                this.itemArray.addItem(new Flashlight(this.itemArray))
                break
            }
            case _ITEM_TYPE.SWORD: {
                this.itemArray.addItem(new Sword(this.itemArray))
                break
            }
            case _ITEM_TYPE.GUN: {
                this.itemArray.addItem(new Gun(this.itemArray))
                break
            }
        }
    }

    public createRandomItem () {
        const type = randomEnumKey(_ITEM_TYPE)
        this.createItem(type)
    }

    constructor (playground: Playground) {
        super(playground, {
            hpMax: 999,
            atk: 0,
            def: 0,
            ifCanUseItem: false
        })
    }
}