import { _AT, ITEM_BOX } from '@/myJs/static_data'
import { Item } from '@/myJs/class/item/item'
import type { EnemyGroup } from '@/myJs/class/actor/enemyGroup'
import type { TextBox } from '@/myJs/class/textBox'

export class Gun extends Item {
    protected type: Item['type'] = _AT._ITEM_TYPE.GUN

    private atk: number = 20
    private enemyGroup: EnemyGroup

    protected whenDurChange: Item['whenDurChange'] = () => {}
    protected _dur: Item['_dur'] = 0
    protected funcBox: Item['funcBox'] = {
        [_AT._GUN_FUNC.SHOOT]: {
            uuid: this.uuid,
            key: _AT._GUN_FUNC.SHOOT,
            ...ITEM_BOX[this.type].func[_AT._GUN_FUNC.SHOOT],
            func: () => {
                if (this.user && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0) {
                    this.textBox.push(ITEM_BOX[this.type].func[_AT._GUN_FUNC.SHOOT].describe)
                    this.enemyGroup.beAttacked({
                        uuid: this.user.getUUID(),
                        val: this.atk
                    })

                    this.dur = this.dur - 1
                }
            }
        }
    }

    public getFuncArray: Item['getFuncArray'] = () => {
        let res: ReturnType<Item['getFuncArray']> = []

        const {func, ...shoot} = this.funcBox[_AT._GUN_FUNC.SHOOT]

        if (this.user && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0 && this.enemyGroup.getIfHaveEnemy()) {
            res.splice(0, 0, shoot)
        }

        return res
    }

    constructor (
        textBox: TextBox,
        enemyGroup: EnemyGroup
    ) {
        super(textBox)
        this.enemyGroup = enemyGroup
    }
}