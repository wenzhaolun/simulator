import { randomEFA } from '@/myJs/class/commonFunc'
import { _AT, PLAYER_BOX } from '@/myJs/static_data'
import { BasicData } from '@/myJs/class/basicData'
import type { TextBox } from '@/myJs/class/textBox'
import type { Player } from '@/myJs/class/actor/player'

export class HpForPlayer extends BasicData {
    protected _data: BasicData['_data'] = 0
    protected user: Player
    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    protected whenDataChange: BasicData['whenDataChange'] = (newVal, curVal) => {
        if (curVal > 0) {
            if (newVal > 0) {
                if (newVal > curVal) {
                    this.textBox.push(randomEFA(PLAYER_BOX.data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.INCREASE]))
                }
        
                if (newVal < curVal) {
                    this.textBox.push(randomEFA(PLAYER_BOX.data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.DECREASE]))
                }
            } else {
                this.textBox.push(randomEFA(PLAYER_BOX.data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.ZERO]))
            }
        }

        this.user
    }
    
    constructor (
        textBox: TextBox,
        user: Player,
        x: {
            totalDataMin: BasicData['totalDataMin'],
            totalDataMax: BasicData['totalDataMax'],
        }
    ) {
        super(textBox)
        this.user = user
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
    }
}