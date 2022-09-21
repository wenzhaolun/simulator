import { randomEFA } from '@/myJs/class/commonFunc'
import { _AT, ITEM_BOX } from '@/myJs/static_data'
import type { Player } from '@/myJs/class/actor/player'
import type { ItemFuncData, Item } from '@/myJs/class/item/item'
import type { TextBox } from '@/myJs/class/textBox'

/**玩家或者敌人的道具数据类 */
export class ItemArray {
    private user: Player
    private itemArray: Array<Item> = []
    public getItemAmount () {
        return this.itemArray.length
    }

    /**获取道具列表里可用的道具功能 */
    public getItemFunc () {
        let res: ReturnType<Item['getFuncArray']> = []
        this.itemArray.forEach((ele) => {
            const temp = ele.getFuncArray()
            if (temp.length > 0) {
                res = res.concat(temp)
            }
        })

        return res
    }

    public addItem (item: Item) {
        this.itemArray.splice(0, 0, item)
        this.itemArray[0].setUserAndState({
            user: this.user,
            state: _AT._ITEM_USE_STATE.ADDED
        })
        this.textBox.push(randomEFA(ITEM_BOX[this.itemArray[0].getType()].state[this.itemArray[0].getState()]))
    }

    public removeItem (x: {uuid: string, state: _AT._ITEM_USE_STATE}) {
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === x.uuid
        })
        
        if (index >= 0) {
            const removedItem = this.itemArray.splice(index, 1)[0]
            removedItem.setUserAndState({
                user: this.user,
                state: _AT._ITEM_USE_STATE.REMOVED
            })
            this.textBox.push(randomEFA(ITEM_BOX[this.itemArray[0].getType()].state[removedItem.getState()]))
        } else {
            console.log('removeItem faile, can\'t find item')
        }
    }

    public useItem (uuid: Item['uuid'], funcKey: ItemFuncData['key']) {
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === uuid
        })

        if (index >= 0) {
            this.itemArray[index].use(funcKey)
        } else {
            console.log('useItem faile, can\'t find item')
        }
    }

    private textBox: TextBox

    constructor (
        textBox: TextBox,
        user: Player,
    ) {
        this.textBox = textBox
        this.user = user
    }
}