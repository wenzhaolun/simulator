import { ITEM_BOX, _FLASHLIGHT_FUNC, _GUN_FUNC, _ITEM_FUNC_TYPE, _ITEM_TYPE, _ITEM_USE_STATE, _SWORD_FUNC, type _ALLITEM_FUNC, type _ITEM_BOX, type _ITEM_FUNC_DATA } from './static'
import type { ItemArray } from './itemArray'

/**道具里某项功能的基本信息的结构 */
export type ItemFunc = {
    /**检查功能当前是否可用的脚本 */
    checkIfShow: () => boolean,
    /**
     * 在运行前，选择指向对象。
     * @returns 返回ture代表已经选择好对象，false代表没有选好。
     */
    ifNeedOrient: () => boolean,
    /**功能脚本 */
    func: () => void
}

export abstract class Item {
    protected abstract itemType: _ITEM_TYPE
    /**物品的状态 */
    protected state: _ITEM_USE_STATE = _ITEM_USE_STATE.NEW
    public getState () {
        return this.state
    }
    /**道具的uuid */
    protected uuid: string = crypto.randomUUID()
    public getUUID () {
        return this.uuid
    }
    public abstract getName: () => string

    /**道具耐久度 */
    protected abstract _dur: number
    protected set dur (x: number) {
        const newVal = x
        const curVal = this._dur
        this._dur = newVal

        if (newVal <= 0) {
            if (this.affectItemArray().affectUser().getIfCanUseItem()) {
                this.affectItemArray().removeItem({
                    uuid: this.uuid,
                    state: _ITEM_USE_STATE.USED
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
    protected abstract funcBox: {[key: number]: ItemFunc}
    /**
     * 使用道具的某个功能
     * @param key 
     * @returns 0 没有该功能
     * @returns 1 需要指向
     * @returns 2 成功执行
     */
    public use (key: number): 0 | 1 | 2 {
        let res: 0 | 1 | 2
        if (!!this.funcBox[key]) {
            if (this.funcBox[key].ifNeedOrient()) {
                res = 1
            } else {
                this.funcBox[key].func()
                res = 2
            }
        } else {
            console.log('no func, use fail.')
            res = 0
        }
        console.log('res from use ==>', res)
        return res
    }
    /**获取可用道具功能合集 */
    public getFuncArray = () => {
        let res: Array<{type: _ITEM_FUNC_TYPE, uuid: string, key: number, name: string, intro: string}> = []
        if (this.affectItemArray().affectUser().getIfCanUseItem()) {
            const temp: Array<_ITEM_FUNC_DATA> = ITEM_BOX[this.itemType].funcBox
            temp.forEach((ele) => {
                const {type, key, name, intro, describe } = ele
                if (!!this.funcBox[ele.key] && this.funcBox[ele.key].checkIfShow()) {
                    res.push({ type, uuid: this.uuid, key, name, intro})
                }
            })
        }
        return res
    }

    /**该数组内的功能将由index为0开始，由whenDurChange执行 */
    private whenDurChangeFuncArray: Array<(newVal: number, curVal: number) => void> = []
    /**其他可能需要在dur变化时触发的脚本写在这里面 */
    protected whenDurChange (newVal: number, curVal: number): void {
        this.whenDurChangeFuncArray.forEach((ele) => { ele(newVal, curVal) })
    }
    /**
     * 增加在数据变化时要执行的功能（发生在dur被正式赋值前）
     * @param func 需要在数据变化时执行的功能（发生在dur被正式赋值前）
     */
    protected addWDCF (func: (newVal: number, curVal: number) => void) {
        this.whenDurChangeFuncArray.unshift(func)
    }

    /**同时设置道具的使用者和道具的状态 */
    public setState ( state: _ITEM_USE_STATE ) { this.state = state }

    private itemArray: ItemArray
    public setItemArray (itemArray: ItemArray) {
        this.itemArray = itemArray
    }
    public affectItemArray () {
        return this.itemArray
    }

    constructor (itemArray: ItemArray) {
        this.itemArray = itemArray
    }
}