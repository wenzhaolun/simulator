import type { Actor } from '../actor'
import type { Item } from './item'
import { _ITEM_USE_STATE, ITEM_BOX, type _ALLITEM_FUNC } from './static'

/**玩家或者敌人的道具数据类 */
export class ItemArray {
    private user: Actor
    public affectUser () {
        return this.user
    }
    private itemArray: Array<Item> = []
    public getItemAmount () {
        return this.itemArray.length
    }
    public getItem (uuid: string) {
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === uuid
        })
        if (index >= 0) {
            return this.itemArray[index]
        } else {
            console.log('no item')
        }
    }

    /**获取可拾取道具列表 */
    public getItemArray () {
        let res: Array<{uuid: string, name: string}> = []
        this.itemArray.forEach((ele) => {
            res.push({
                uuid: ele.getUUID(),
                name: ele.getName()
            })
        })
        return res
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

    /**获取道具（注意：获取道具的动作里已经包含道具主动让其itemArray移除item，并解除其原itemArray的绑定。） */
    public addItem (item: Item) {
        // 道具主动让其原itemArray移除自己
        item.affectItemArray().removeItem({uuid: item.getUUID(), state: _ITEM_USE_STATE.REMOVED})
        // 道具主动绑定新的itemArray
        item.setItemArray(this)
        this.itemArray.splice(0, 0, item)
        this.itemArray[0].setState(_ITEM_USE_STATE.ADDED)

        this.user.affectPlayground().affectGame().affectViewBox().callControlObjectUpdate()
        this.user.affectPlayground().affectGame().affectViewBox().callStageItemArrayUpdate()
    }

    public removeItem (x: {uuid: string, state: _ITEM_USE_STATE}) {
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === x.uuid
        })
        
        if (index >= 0) {
            const removedItem = this.itemArray.splice(index, 1)[0]
        } else {
            console.log('removeItem faile, can\'t find item')
        }
    }

    /**
     * 使用道具的某个功能
     * @param uuid 道具的uuid
     * @param funcKey 功能的key
     * @returns 0 没有该功能
     * @returns 1 需要指向
     * @returns 2 成功执行
     * @returns 3 没有该道具
     */
    public useItem (uuid: Item['uuid'], funcKey: _ALLITEM_FUNC): 0 | 1 | 2| 3 {
        let res: 0 | 1 | 2| 3
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === uuid
        })
        if (index >= 0) {
            res = this.itemArray[index].use(funcKey)
        } else {
            console.log('useItem faile, can\'t find item')
            res = 3
        }
        return res
    }

    constructor (
        user: Actor
    ) {
        this.user = user
    }
}