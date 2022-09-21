import { _AT } from '@/myJs/static_data'
import type { TextBox } from '@/myJs/class/textBox'
import type { Player } from '@/myJs/class/actor/player'

/**道具里某项功能的基本信息的结构 */
export interface ItemFuncData {
    /**道具的id */
    uuid: Item['uuid'],
    /**道具的功能类型 */
    type: _AT._ITEM_FUNC_TYPE,
    /**道具里某项功能的key */
    key: number,
    /**道具里某项功能的名称 */
    name: string,
    /**道具里某项功能的简介 */
    intro: string,
    /**道具里某项功能触发后的文字描述 */
    describe: string
}

/**道具里某项功能的基本信息加上实际功能function的结构 */
export interface ItemFuncDataWithFunc extends ItemFuncData {
    /**道具的某项功能 */
    func: (x?: any) => void
}

export abstract class Item {
    /**物品的种类 */
    protected abstract type: _AT._ITEM_TYPE
    public getType () {
        return this.type
    }

    /**物品的状态 */
    protected state: _AT._ITEM_USE_STATE = _AT._ITEM_USE_STATE.NEW
    public getState () {
        return this.state
    }
    /**道具的uuid */
    protected uuid: string = crypto.randomUUID()
    public getUUID () {
        return this.uuid
    }

    /**道具耐久度 */
    protected abstract _dur: number
    protected set dur (x: Item['_dur']) {
        const newVal = x
        const curVal = this._dur
        this._dur = newVal

        if (newVal <= 0) {
            if (this.user) {
                this.user.removeItem({
                    uuid: this.uuid,
                    state: _AT._ITEM_USE_STATE.USED
                })
            } else {
                console.log('no user, can\'t be used')
            }
        }
        
        this.whenDurChange(newVal, curVal)
    }
    protected get dur () {
        return this._dur
    }
    /**道具功能合集 */
    protected abstract funcBox: {
        [index: number]: ItemFuncDataWithFunc
    }
    /**使用道具的某个功能 */
    public use (funcKey: number) {
        this.funcBox[funcKey].func()
    }
    /**获取可用道具功能合集 */
    public abstract getFuncArray: () => Array<ItemFuncData>

    /**推送文字的方法 */
    protected textBox: TextBox
    /**其他可能需要在dur变化时触发的脚本写在这里面 */
    protected abstract whenDurChange: (newVal: Item['_dur'], curVal: Item['_dur']) => void

    protected user: Player | undefined
    public bindUser (user: Player) {
        this.user = user
    }
    /**同时设置道具的使用者和道具的状态 */
    public setUserAndState (x: {
        user: Player | undefined,
        state: Item['state']
    }) {
        this.user = x.user
        this.state = x.state
    }

    constructor (textBox: TextBox) {
        this.textBox = textBox
    }
}