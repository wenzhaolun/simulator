import { randomEFA } from '@/myJs/class/commonFunc'
import { _AT, ENEMY_BOX } from '@/myJs/static_data'
import { BasicData } from '@/myJs/class/basicData'
import type { TextBox } from '@/myJs/class/textBox'
import type { Enemy } from '@/myJs/class/actor/enemy'

export class HpForEnemy extends BasicData {
    private enemyType: Enemy['enemyType']
    protected _data: BasicData['_data'] = 0
    protected user: Enemy
    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    protected whenDataChange: BasicData['whenDataChange'] = (newVal, curVal) => {
        if (newVal > 0) {
            if (newVal > curVal) {
                this.textBox.push(randomEFA(ENEMY_BOX[this.enemyType].data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.INCREASE]))
            }
    
            if (newVal < curVal) {
                this.textBox.push(randomEFA(ENEMY_BOX[this.enemyType].data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.DECREASE]))
            }
        } else {
            this.textBox.push(randomEFA(ENEMY_BOX[this.enemyType].data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.ZERO]))
        }
    }
    
    constructor (
        textBox: TextBox,
        user: Enemy,
        x: {
            enemyType: HpForEnemy['enemyType'],
            totalDataMin: BasicData['totalDataMin'],
            totalDataMax: BasicData['totalDataMax']
        }
    ) {
        super(textBox)
        this.user = user
        this.enemyType = x.enemyType
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
    }
}