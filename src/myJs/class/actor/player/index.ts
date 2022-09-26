import { ItemArray } from '@/myJs/class/item/itemArray'
import type { Playground } from '@/myJs/class/playground'
import { PLAYER_BOX, calAndWriteForHp, _PLAYER_CONTROL } from '@/myJs/class/actor/player/static'
import { type _ITEM_USE_STATE, _ITEM_FUNC_TYPE } from '@/myJs/class/item/static'
import { Actor } from '../actor'

export class Player extends Actor {
    private sans: number

    /**被攻击的处理方法
     * @param x 受到的攻击，包含发出攻击对象的uuid和攻击的val。
    */
    public attack (x: {uuid: string, val: number}): void {
        /**敌人攻击减玩家的防御的值 */
        const atkMinusDef = x.val - this.def
        if (atkMinusDef > 0) {
            this.hp.set(x.uuid, atkMinusDef)
        }
    }
    /**玩家死亡 */
    public die () {}

    /**玩家自带控制选项 */
    private controlBox = {
        [_PLAYER_CONTROL.SEARCH]: () => { this.affectPlayground().affectStage()?.addProgress(this.uuid) }
    }
    /**获取玩家自带控制选项 */
    public getControl () {
        const array = Object.entries(PLAYER_BOX.control)
        let playerControl: Array<{key: _PLAYER_CONTROL, name: string, intro: string}> = []
        for (let i = 0; i < array.length; i++) {
            const [key, val] = array[i]
            playerControl.push({
                key: Number(key),
                ...val
            })
        }

        const itemFuncArray = this.itemArray.getItemFunc()
        let itemControl: {[key in _ITEM_FUNC_TYPE]: ReturnType<ItemArray['getItemFunc']>} = {
            [_ITEM_FUNC_TYPE.A]: [],
            [_ITEM_FUNC_TYPE.B]: []
        }
        itemFuncArray.forEach((ele) => {
            if (ele.type === _ITEM_FUNC_TYPE.A) {
                itemControl[_ITEM_FUNC_TYPE.A].splice(0, 0, ele)
            }
            if (ele.type === _ITEM_FUNC_TYPE.B) {
                itemControl[_ITEM_FUNC_TYPE.B].splice(0, 0, ele)
            }
        })

        return {playerControl, itemControl}
    }
    /**触发玩家的控制选项 */
    public activateControl (key: _PLAYER_CONTROL) {
        this.controlBox[key]()
    }

    public getOpponentAmount = () => {
        return this.affectPlayground().affectEnemyGroup().getEnemyAmount()
    }
    public getAllOpponent = () => {
        return this.affectPlayground().affectEnemyGroup().getEnemyGroup()
    }



    public init (
        initialValue: number
    ) {
        this.hp.set(this.uuid, initialValue)
    }

    constructor (
        playground: Playground,
        x: {
            hp: number,
            atk: Player['atk'],
            def: Player['def'],
            sans: Player['sans']
        }
    ) {
        const {sans, ...params} = x
        super(playground, {...params, ifCanUseItem: true})

        const pushText = (text: string) => { this.affectPlayground().affectViewBox().pushText(text) }
        this.hp.addWDCF((newVal, curVal) => {
            calAndWriteForHp({pushText, newVal, curVal})
        })
        this.hp.addWDCF((newVal) => { if (newVal <= 0) { this.die() } })

        this.sans = sans
        this.itemArray = new ItemArray(this)
    }
}