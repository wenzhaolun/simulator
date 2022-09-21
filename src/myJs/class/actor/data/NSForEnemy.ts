import { randomEFA } from '@/myJs/class/commonFunc'
import { _AT, ENEMY_BOX } from '@/myJs/static_data'
import { BasicData } from '@/myJs/class/basicData'
import type { TextBox } from '@/myJs/class/textBox'

/**BasicDataForEnemyNoise&Smell 敌人的噪声、气味属性专用的基础属性 */
export class NSForEnemy extends BasicData {
    protected enemyType: _AT._ENEMY_TYPE
    protected enemyDataType: _AT._ENEMY_DATA
    protected enemyUUID: string
    protected _data: number = 0
    protected totalDataMin: number
    protected totalDataMax: number

    protected whenDataChange: BasicData['whenDataChange'] = (newVal, curVal) => {
        const sample = ENEMY_BOX[this.enemyType].data[this.enemyDataType]
        if (newVal > 0) {
            if (newVal > curVal) {
                this.textBox.push(randomEFA(sample[_AT._DATA_STATE.INCREASE]))
            }
    
            if (newVal < curVal) {
                this.textBox.push(randomEFA(sample[_AT._DATA_STATE.DECREASE]))
            }
        } else {
            this.textBox.push(randomEFA(sample[_AT._DATA_STATE.ZERO]))
        }
    }

    constructor (
        textBox: TextBox,
        x: {
            enemyType: NSForEnemy['enemyType'],
            enemyDataType: NSForEnemy['enemyDataType'],
            enemyUUID: string,
            totalDataMin: NSForEnemy['totalDataMin'],
            totalDataMax: NSForEnemy['totalDataMax'],
        }
    ) {
        super(textBox)
        this.enemyType = x.enemyType
        this.enemyDataType = x.enemyDataType
        this.enemyUUID = x.enemyUUID
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
    }
}