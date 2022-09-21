import { _AT, ITEM_BOX } from '@/myJs/static_data'
import { Item } from '@/myJs/class/item/item'
import type { Player } from '@/myJs/class/actor/player'
import type { EnemyGroup } from '@/myJs/class/actor/enemyGroup'
import type { TextBox } from '@/myJs/class/textBox'

export class Sword extends Item {
    protected type: Item['type'] = _AT._ITEM_TYPE.SWORD
    private atk: number = 6

    private enemyGroup: EnemyGroup

    protected whenDurChange: Item['whenDurChange'] = () => {}
    protected _dur: Item['_dur'] = 6
    protected funcBox: Item['funcBox'] = {
        [_AT._SWORD_FUNC.ATTACK]: {
            uuid: this.uuid,
            key: _AT._SWORD_FUNC.ATTACK,
            ...ITEM_BOX[this.type].func[_AT._SWORD_FUNC.ATTACK],
            func: (val: Player['atk']) => {
                if (this.user && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0) {
                    this.textBox.push(ITEM_BOX[this.type].func[_AT._SWORD_FUNC.ATTACK].describe)
                    this.enemyGroup.beAttacked({
                        uuid: this.user.getUUID(),
                        val: val + this.atk
                    })

                    this.dur = this.dur - 1
                }
            }
        }
    }
    public getFuncArray: Item['getFuncArray'] = () => {
        let res: ReturnType<Item['getFuncArray']> = []

        const {func, ...attack} = this.funcBox[_AT._SWORD_FUNC.ATTACK]

        if (this.user && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0 && this.enemyGroup.getIfHaveEnemy()) {
            res.splice(0, 0, attack)
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