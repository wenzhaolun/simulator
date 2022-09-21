import { _AT, ITEM_BOX } from '@/myJs/static_data'
import { Item } from '@/myJs/class/item/item'
import type { Stage } from '@/myJs/class/stage/stage'
import type { TextBox } from '@/myJs/class/textBox'

export class Flashlight extends Item {
    protected type: Item['type'] = _AT._ITEM_TYPE.FLASHLIGHT
    protected _dur: Item['_dur'] = 5
    protected whenDurChange: Item['whenDurChange'] = (newVal: Item['_dur'], curVal: Item['_dur']) => {}
    private ifOn: boolean = false

    /**在手电打开的情况下每回合 */
    public reduceDurPerRound () {
        if (this.ifOn) {
            this.dur = this.dur - 1
        }
    }

    private stage: Stage

    protected funcBox: Item['funcBox'] = {
        [_AT._FLASHLIGHT_FUNC.ON]: {
            uuid: this.uuid,
            key: _AT._FLASHLIGHT_FUNC.ON,
            ...ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.ON],
            func: () => {
                this.textBox.push(ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.ON].describe)
                this.stage.setLight({
                    uuid: this.uuid,
                    val: 6
                })
                this.ifOn = true
            }
        },
        [_AT._FLASHLIGHT_FUNC.OFF]: {
            uuid: this.uuid,
            key: _AT._FLASHLIGHT_FUNC.OFF,
            ...ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.OFF],
            func: () => {
                this.textBox.push(ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.OFF].describe)
                this.stage.removeLight(this.uuid)
                this.ifOn = false
            }
        }
    }
    public getFuncArray: Item['getFuncArray'] = () => {
        let res: ReturnType<Item['getFuncArray']> = []

        const {func: a, ...on} = this.funcBox[_AT._FLASHLIGHT_FUNC.ON]
        const {func: b, ...off} = this.funcBox[_AT._FLASHLIGHT_FUNC.OFF]

        if (this.state === _AT._ITEM_USE_STATE.ADDED) {
            this.ifOn ? res.splice(0, 0, off) : res.splice(0, 0, on)
        }

        return res
    }

    constructor (
        textBox: TextBox,
        stage: Stage,
    ) {
        super(textBox)
        this.stage = stage
    }
}