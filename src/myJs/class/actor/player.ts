import { _AT, PLAYER_BOX } from '@/myJs/static_data'
import { HpForPlayer } from '@/myJs/class/actor/data/hpForPlayer'
import type { ItemFuncData, Item } from '@/myJs/class/item/item'
import { ItemArray } from '@/myJs/class/actor/itemArray'
import type { Stage } from '@/myJs/class/stage/stage'
import type { TextBox } from '@/myJs/class/textBox'

export class Player {
    private uuid: string = crypto.randomUUID()
    public getUUID () {
        return this.uuid
    }

    private hp: HpForPlayer
    private atk: number
    private def: number
    private sans: number

    private itemArray: ItemArray

    /** 获取玩家拥有的物品数量 */
    public getPlayerItemAmount () {
        return this.itemArray.getItemAmount()
    }

    /** 玩家拿起物品 */
    public addItem(item: Item) {
        this.itemArray.addItem(item)
    }

    /**玩家丢掉物品 */
    public removeItem (x: {uuid: Item['uuid'], state: _AT._ITEM_USE_STATE}) {
        this.itemArray.removeItem({
            uuid: x.uuid,
            state: x.state
        })
    }

    /**玩家使用物品 */
    public useItem (uuid: Item['uuid'], funcKey: ItemFuncData['key']) {
        this.itemArray.useItem(uuid, funcKey)
    }

    /**被攻击的处理方法
     * @param x 受到的攻击，包含发出攻击对象的uuid和攻击的val。
    */
    public beAttacked (x: {uuid: string, val: number}): void {
        /**敌人攻击减玩家的防御的值 */
        const atkMinusDef = x.val - this.def
        if (atkMinusDef > 0) {
            this.hp.setExtendData({
                uuid: x.uuid,
                val: 0 - atkMinusDef
            })
        }
    }
    /**玩家死亡 */
    public die () {}

    /**玩家自带控制选项 */
    private controlBox = {
        [_AT._PLAYER_CONTROL.SEARCH]: {
            key: _AT._PLAYER_CONTROL.SEARCH,
            ...PLAYER_BOX.control[_AT._PLAYER_CONTROL.SEARCH],
            func: () => {
                if (this.stage) {
                    this.stage.addProgress(this.uuid)
                } else {
                    console.log('no stage, can\'t search.')
                }
            }
        }
    }
    /**获取玩家自带控制选项 */
    public getControl () {
        const {func: a, ...search} = this.controlBox[_AT._PLAYER_CONTROL.SEARCH]

        let res: {
            playerControl: Array<{
                name: string,
                intro: string,
                key: _AT._PLAYER_CONTROL
            }>,
            itemControl: {
                [_AT._ITEM_FUNC_TYPE.A]: Array<ItemFuncData>,
                [_AT._ITEM_FUNC_TYPE.B]: Array<ItemFuncData>
            }
        } = {
            playerControl: [search],
            itemControl: {
                [_AT._ITEM_FUNC_TYPE.A]: [],
                [_AT._ITEM_FUNC_TYPE.B]: []
            }
        }

        const itemControl = this.itemArray.getItemFunc()
        itemControl.forEach((ele) => {
            if (ele.type === _AT._ITEM_FUNC_TYPE.A) {
                res.itemControl[_AT._ITEM_FUNC_TYPE.A].splice(0, 0, ele)
            }
            if (ele.type === _AT._ITEM_FUNC_TYPE.B) {
                res.itemControl[_AT._ITEM_FUNC_TYPE.B].splice(0, 0, ele)
            }
        })

        return res
    }
    /**触发玩家的控制选项 */
    public activateControl (key: _AT._PLAYER_CONTROL) {
        this.controlBox[key].func()
    }

    private textBox: TextBox
    private stage: Stage | undefined
    public bindStage (stage: Stage) {
        this.stage = stage
    }
    public setStageLight ({uuid, val}: {uuid: string, val: number}) {
        if (this.stage) {
            this.stage.setLight({
                uuid,
                val
            })
        } else {
            console.log('no stage')
        }
    }
    public removeStageLight (uuid: string) {
        if (this.stage) {
            this.stage.removeLight(uuid)
        } else {
            console.log('no stage')
        }
    }

    public init (
        initialValue: Player['hp']['_data']
    ) {
        this.hp.setVal(initialValue)
    }

    constructor (
        textBox: TextBox,
        x: {
            hp: number,
            atk: Player['atk'],
            def: Player['def'],
            sans: Player['sans']
        }
    ) {
        this.textBox = textBox

        this.hp = new HpForPlayer(
            textBox,
            this,
            {
                totalDataMin: 0,
                totalDataMax: 20
            }
        )
        this.atk = x.atk
        this.def = x.def
        this.sans = x.sans
        this.itemArray = new ItemArray(textBox, this)
    }
}