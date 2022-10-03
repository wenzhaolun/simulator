import { Item } from './item'
import type { ItemArray } from './itemArray'
import { _ITEM_TYPE, _FLASHLIGHT_FUNC, ITEM_BOX, _ITEM_USE_STATE, type _ITEM_FUNC_DATA } from './static'

export class Flashlight extends Item {
    protected itemType: _ITEM_TYPE = _ITEM_TYPE.FLASHLIGHT
    public getName: () => string = () => {
        return ITEM_BOX[_ITEM_TYPE.FLASHLIGHT].name
    }
    protected _dur: number = 5
    protected funcBox = {
        [_FLASHLIGHT_FUNC.ON]: {
            checkIfShow: () => { return !this.ifOn },
            ifNeedOrient: () => { return false },
            func: () => {
                this.affectItemArray().affectUser().affectPlayground().affectGame().affectViewBox().pushText(ITEM_BOX[_ITEM_TYPE.FLASHLIGHT].funcBox[_FLASHLIGHT_FUNC.ON].describe)
                this.affectItemArray().affectUser().affectPlayground().affectStage()?.affectLight().plus(this.uuid, 6)
                this.ifOn = true
            }
        },
        [_FLASHLIGHT_FUNC.OFF]: {
            checkIfShow: () => { return this.ifOn },
            ifNeedOrient: () => { return false },
            func: async () => {
                this.affectItemArray().affectUser().affectPlayground().affectGame().affectViewBox().pushText(ITEM_BOX[_ITEM_TYPE.FLASHLIGHT].funcBox[_FLASHLIGHT_FUNC.OFF].describe)
                this.affectItemArray().affectUser().affectPlayground().affectStage()?.affectLight().remove(this.uuid)
                this.ifOn = false
            }
        }
    }

    /**是否开了灯 */
    private ifOn: boolean = false

    /**在手电打开的情况下每回合 */
    public reduceDurPerRound () {
        if (this.ifOn) {
            this.dur = this.dur - 1
        }
    }

    constructor (
        itemArray: ItemArray
    ) {
        super(itemArray)
    }
}