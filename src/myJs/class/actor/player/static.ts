import { randomEFA } from '@/myJs/class/common/commonFunc'
import type { ViewBox } from '../../viewBox'

/**玩家、敌人需要文字描述的属性的变化状态 */
export enum _DATA_STATE {
    INCREASE,
    DECREASE,
    ZERO
}

/**玩家的属性枚举 */
export enum _PLAYER_DATA {
    /**生命值 */
    HP,
    /**耐力值 */
    STAM,
    /**理智值 */
    SANS
}

export enum _PLAYER_CONTROL {
    /**搜查 */
    SEARCH
}

/**玩家属性的描述文字的样本库的结构 */
export type _PLAYER_BOX = {
    data: {
        [key in _PLAYER_DATA]: {
            [key in _DATA_STATE]: Array<string>
        }
    },
    control: {
        [key in _PLAYER_CONTROL]: {
            name: string,
            intro: string
        }
    }
}

/**玩家属性的描述文字的样本库 */
export const PLAYER_BOX: _PLAYER_BOX = {
    data: {
        [_PLAYER_DATA.HP]: {
            [_DATA_STATE.INCREASE]: [
                '你感觉身体状况变好了',
                '你的伤势得到了缓和'
            ],
            [_DATA_STATE.DECREASE]: [
                '你感觉到剧烈疼痛',
                '你的受伤了',
                '你的伤势更严重了'
            ],
            [_DATA_STATE.ZERO]: [
                '你死了',
                '你倒下了'
            ]
        },
        [_PLAYER_DATA.SANS]: {
            [_DATA_STATE.INCREASE]: [
                '你感觉清醒了一些',
                '你的恢复了一点理智'
            ],
            [_DATA_STATE.DECREASE]: [
                '你越来越感觉害怕',
                '你感觉自己有点疯狂',
            ],
            [_DATA_STATE.ZERO]: [
                '你陷入了疯狂'
            ]
        },
        [_PLAYER_DATA.STAM]: {
            [_DATA_STATE.INCREASE]: [
                '你感觉更有力气了',
                '你恢复了一些体力'
            ],
            [_DATA_STATE.DECREASE]: [
                '你觉得有点累',
                '你感受到自己体力的流失',
            ],
            [_DATA_STATE.ZERO]: [
                '你觉得全身乏力',
                '你似乎已经没有任何力气了'
            ]
        }
    },
    control: {
        [_PLAYER_CONTROL.SEARCH]: {
            name: '调查线索',
            intro: '快想想办法吧'
        }
    }
}

export interface _PLAYER_PARAMS {
    hp: number,
    atk: number,
    def: number,
    sans: number
}

export const PLAYER_LIMIT = {
    totalPoints: {
        min: 0,
        max: 10
    },
    playerData: {
        hp: {
            min: 1
        },
        atk: {
            min: 0
        },
        def: {
            min: 0
        },
        sans: {
            min: 0
        }
    },
    itemAmount: 2,
    findItem: 0.75
}


interface PARAMS_FOR_CAWFH {
    pushText: ViewBox['pushText'],
    newVal: number,
    curVal: number
}

export const calAndWriteForHp = ({pushText, newVal, curVal}: PARAMS_FOR_CAWFH) => {
    if (curVal > 0) {
        if (newVal > 0) {
            if (newVal > curVal) {
                pushText(randomEFA(PLAYER_BOX.data[_PLAYER_DATA.HP][_DATA_STATE.INCREASE]))
            }
    
            if (newVal < curVal) {
                pushText(randomEFA(PLAYER_BOX.data[_PLAYER_DATA.HP][_DATA_STATE.DECREASE]))
            }
        } else {
            pushText(randomEFA(PLAYER_BOX.data[_PLAYER_DATA.HP][_DATA_STATE.ZERO]))
        }
    }

}
