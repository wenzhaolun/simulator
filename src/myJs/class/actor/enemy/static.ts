import { randomEFA } from "../../common/commonFunc"
import type { ViewBox } from "../../viewBox"

enum _DATA_STATE {
    INCREASE,
    DECREASE,
    ZERO
}

/**敌人的类型的枚举 */
export enum _ENEMY_TYPE {
    HUMAN_BODY_MONSTER,
    DOG_HEAD,
    DARK_PLATE,
    BLUE_TENTACLES
}

/**敌人的属性枚举 */
export enum _ENEMY_DATA {
    /**生命值 */
    HP,
    /**气味 */
    SMELL,
    /**噪声 */
    NOISE
}

/**所有敌人信息的结构 */
export type _ENEMY_BOX = {
    [key in _ENEMY_TYPE]: {
        name: string,
        appear: string,
        attack: Array<string>,
        data: {
            [key in _ENEMY_DATA]: {
                [key in _DATA_STATE]: Array<string>
            }
        }
    }
}

/**所有敌人的基本信息 */
export const ENEMY_BOX: _ENEMY_BOX = {
    [_ENEMY_TYPE.HUMAN_BODY_MONSTER]: {
        name: '全身都是眼睛的人形怪物',
        appear: '一个人形怪物出现了，全身都长着眼睛。',
        attack: ['人形怪物向你射出眼睛', '人形怪物张开长满牙齿的眼睛扑向你'],
        data: {
            [_ENEMY_DATA.HP]: {
                [_DATA_STATE.INCREASE]: [],
                [_DATA_STATE.DECREASE]: [
                    '人形怪物似乎受到了伤害',
                    '怪物的眼睛掉到了地上'
                ],
                [_DATA_STATE.ZERO]: [
                    '怪物炸开了',
                    '怪物的眼睛全都融化了'
                ]
            },
            [_ENEMY_DATA.NOISE]: {
                [_DATA_STATE.INCREASE]: [
                    '人形怪物张开了口对着你大吼',
                    '人形怪物发出了奇怪的尖叫声'
                ],
                [_DATA_STATE.DECREASE]: [
                    '一阵奇怪的低吼由怪物的腹部传出',
                    '人形怪物发出奇怪的抽泣声'
                ],
                [_DATA_STATE.ZERO]: [
                    '怪物变安静了'
                ]
            },
            [_ENEMY_DATA.SMELL]: {
                [_DATA_STATE.INCREASE]: [
                    '怪物的身上散发出越来越浓烈的刺激气味',
                    '一股恶心的味道由怪物身上散发出来'
                ],
                [_DATA_STATE.DECREASE]: [
                    '怪物的怪味似乎变淡了',
                    '来自怪物的气味似乎变少了'
                ],
                [_DATA_STATE.ZERO]: [
                    '人形怪物散发出的气味消失了'
                ]
            }
        }
    },
    [_ENEMY_TYPE.DOG_HEAD]: {
        name: '由狗头混成一团的肉泥',
        appear: '一团恶心的肉泥出现了',
        attack: ['狗头突然向你撞去'],
        data: {
            [_ENEMY_DATA.HP]: {
                [_DATA_STATE.INCREASE]: [],
                [_DATA_STATE.DECREASE]: [
                    '狗头发出悲惨的叫声',
                    '狗头的皮肤逐渐裂开'
                ],
                [_DATA_STATE.ZERO]: [
                    '狗头的全部眼睛都闭上了',
                    '全部狗头都不动了'
                ]
            },
            [_ENEMY_DATA.NOISE]: {
                [_DATA_STATE.INCREASE]: [
                    '肉泥中的几个狗头在狂吠',
                    '狗头的口里传来人在快速朗诵的声音'
                ],
                [_DATA_STATE.DECREASE]: [
                    '狗头发出了像人一样的低吟声',
                    '狗头的皮肤开始裂开了'
                ],
                [_DATA_STATE.ZERO]: [
                    '肉泥变安静了下来'
                ]
            },
            [_ENEMY_DATA.SMELL]: {
                [_DATA_STATE.INCREASE]: [
                    '狗头的口流出了恶心的唾液，散发出恶心的臭味。',
                    '肉泥的臭味越来越浓烈'
                ],
                [_DATA_STATE.DECREASE]: [
                    '肉泥的臭味似乎变淡了',
                    '由狗头传出的气味似乎慢慢变少了'
                ],
                [_DATA_STATE.ZERO]: [
                    '狗头肉泥的气味消失了'
                ]
            }
        }
    },
    [_ENEMY_TYPE.DARK_PLATE]: {
        name: '怪异的黑色碟状物',
        appear: '一个黑色碟状物凭空出现了',
        attack: ['碟状物向你喷射出一团烟雾', '碟状物向你高速撞来'],
        data: {
            [_ENEMY_DATA.HP]: {
                [_DATA_STATE.INCREASE]: [],
                [_DATA_STATE.DECREASE]: [
                    '碟状物表面出现裂痕',
                    '碟状物掉落了一些碎块'
                ],
                [_DATA_STATE.ZERO]: [
                    '碟状物化成了粉末',
                    '碟状物粉碎了'
                ]
            },
            [_ENEMY_DATA.NOISE]: {
                [_DATA_STATE.INCREASE]: [
                    '碟状物发出一阵刺耳的声波',
                    '碟状物连续发出了几段急促的声波'
                ],
                [_DATA_STATE.DECREASE]: [
                    '碟状物的声波音量降低了',
                    '碟状物的声波变得断断续续'
                ],
                [_DATA_STATE.ZERO]: [
                    '完全听不到碟状物的声波了'
                ]
            },
            [_ENEMY_DATA.SMELL]: {
                [_DATA_STATE.INCREASE]: [
                    '碟状物散发出一阵阵硫磺的味道',
                    '碟状物散发出一股类似烧焦塑料的味道'
                ],
                [_DATA_STATE.DECREASE]: [
                    '碟状物的气味变成了淡淡的药水气味',
                    '似乎有一股墨水味从碟状物散发开来'
                ],
                [_DATA_STATE.ZERO]: [
                    '似乎闻不到碟状物的气味了',
                ]
            }
        }
    },
    [_ENEMY_TYPE.BLUE_TENTACLES]: {
        name: '巨大的蓝色触手',
        appear: '一条巨大的触手从地上窜出。',
        attack: ['触手把你绊倒了', '触手攻击了你'],
        data: {
            [_ENEMY_DATA.HP]: {
                [_DATA_STATE.INCREASE]: [],
                [_DATA_STATE.DECREASE]: [
                    '触手上出现了伤痕',
                    '触手暴露出了里面的奇怪血管',
                    '一些奇怪的蓝色液体从触手溅出'
                ],
                [_DATA_STATE.ZERO]: [
                    '触手断成了两段',
                    '触手化成了一滩灰色液体'
                ]
            },
            [_ENEMY_DATA.NOISE]: {
                [_DATA_STATE.INCREASE]: [
                    '一阵阵肌肉破裂的声音从触手的内部传出'
                ],
                [_DATA_STATE.DECREASE]: [
                    '触手发出一些像是海豚的叫声'
                ],
                [_DATA_STATE.ZERO]: [
                    '触手发出的声音消失了'
                ]
            },
            [_ENEMY_DATA.SMELL]: {
                [_DATA_STATE.INCREASE]: [
                    '触手散发出一股恶心的腥臭味'
                ],
                [_DATA_STATE.DECREASE]: [
                    '触手散的腥臭味变淡了'
                ],
                [_DATA_STATE.ZERO]: [
                    '来自触手的腥臭味消失了'
                ]
            }
        }
    }
}

export const ENEMY_LIMIT = {
    amount: {
        max: 2
    },
    rate: {
        min: 0,
        max: 10,
        /**初始敌人刷新进度条的保底百分比 */
        percent: 0.1,
        /**每次敌人刷新进度条的保底百分比 */
        eachPercent: 0.2
    },
    hp: {
        min: 4,
        max: 16,
        percent: 0.3,
        eachPercent: 0.1
    },
    noise: {
        min: 0,
        max: 8,
        percent: 0.3,
        eachPercent: 0.1
    },
    smell: {
        min: 0,
        max: 8,
        percent: 0.3,
        eachPercent: 0.1
    },
    atk: {
        min: 1,
        max: 8,
        percent: 0.2
    },
    def: {
        min: 1,
        max: 8,
        percent: 0.2
    }
}

/**所需基本参数（计算数据的等级并根据等级得出描述文字的功能） */
interface PARAMS_FOR_ENEMY_CAW {
    /**推送文字所需 */
    pushText: ViewBox['pushText'],
    /**敌人种类 */
    enemyType: _ENEMY_TYPE,
    /**需要生成描述文字的数据的类型 */
    dataType: _ENEMY_DATA,
    /**数据的新值 */
    newVal: number,
    /**数据的当前值 */
    curVal: number
}

export const calAndWriteForEnemy = ({pushText, enemyType, dataType, newVal, curVal}: PARAMS_FOR_ENEMY_CAW) => {
    if (newVal > 0) {
        if (newVal > curVal) {
            pushText(randomEFA(ENEMY_BOX[enemyType].data[dataType][_DATA_STATE.INCREASE]))
        }

        if (newVal < curVal) {
            pushText(randomEFA(ENEMY_BOX[enemyType].data[dataType][_DATA_STATE.DECREASE]))
        }
    } else {
        pushText(randomEFA(ENEMY_BOX[enemyType].data[dataType][_DATA_STATE.ZERO]))
    }
}
