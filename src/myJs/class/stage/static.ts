import { randomEFA } from '@/myJs/class/common/commonFunc'
import type { ViewBox } from '../viewBox'

/**场景类型枚举 */
export enum _STAGE_TYPE {
    ROOM,
    DUNGEON,
    CHURCH,
    TOMB,
    VALUT
}

/**场景属性枚举 */
export enum _STAGE_DATA {
    LIGHT,
    SMELL,
    NOISE
}

/**场景状态枚举 */
export enum _STAGE_STATE {
    START,
    HALFWAY,
    END
}

/**场景光、气味、噪声等数据状态枚举 */
export enum _STAGE_DATA_STATE{
    NEW,
    INCREASE,
    DECREASE
}

/**场景光、气味、噪声等数据等级枚举 */
export enum _STAGE_DATA_LEVEL {
    A,
    B,
    C,
    D
}

/**场景的侦查事件类型 */
export enum _DETECT_TYPE {
    CANDLE,
    CIRCLE
}

/**场景的侦查事件状态 */
export enum _DETECT_STATE {
    START,
    HALFWAY,
    END,
    CONTINUE
}

/**存放所有场景所有信息的object的结构 */
export type _STAGE_BOX = {
    [key in _STAGE_TYPE]: {
        /**场景名称 */
        name: string,
        /**场景在整个游戏里的不同状态的文字描述 */
        state: {
            [key in _STAGE_STATE]: Array<string>
        },
        /**基础属性的变动的文字描述 */
        data: {
            [key in _STAGE_DATA]: {
                [key in _STAGE_DATA_STATE]: {
                    [key in _STAGE_DATA_LEVEL]: Array<string>
                }
            }
        }
        /**存放场景探索过程的描述文字的静态object的结构 */
        detect: {
            [key in _DETECT_TYPE]: {
                [_key in _DETECT_STATE]: Array<string>
            }
        }
    }
}

/**
 * 计算光、气味、噪声数据的等级
 * @param val 需要被计算等级的数据的值
 * @param diff 需要被计算等级的数据最大值和最小值的差
 * @returns 数据等级
 */
export function calLevel (val: number, diff: number): _STAGE_DATA_LEVEL {
    let res
    switch (true) { // 根据总数值计算级别
        case val <= diff / 4:
            res = _STAGE_DATA_LEVEL.A
            break
        case val <= diff / 4 * 2:
            res = _STAGE_DATA_LEVEL.B
            break
        case val <= diff / 4 * 3:
            res = _STAGE_DATA_LEVEL.C
            break
        case val <= diff:
            res = _STAGE_DATA_LEVEL.D
            break
        default:
            res = _STAGE_DATA_LEVEL.D
            break
    }
    return res
}

/**
 * 计算场景调查进度条的进度等级
 * @param val 调查进度值
 * @param min 进度的最小值（进度条的初始值）
 * @param max 进度的最大值（进度条的终结值）
 * @returns 进度等级
 */
export function calStateForProgress (val: number, min: number, max: number): _DETECT_STATE {
    let res: _DETECT_STATE
        switch (true) { // 根据总数值计算级别
            case val <= (max - min) / 2:
                res = _DETECT_STATE.START
                break
            case val < max:
                res = _DETECT_STATE.HALFWAY
                break
            case val >= max:
                res = _DETECT_STATE.END
                break
            default:
                res = _DETECT_STATE.START
                break
        }
    return res
}

/**所需基本参数（计算数据的等级并根据等级得出描述文字的功能） */
interface PARAMS_FOR_CAW {
    /**推送文字所需 */
    pushText: ViewBox['pushText']
    /**场景类型 */
    stageType: _STAGE_TYPE,
    /**数据的新值 */
    newVal: number,
    /**数据的当前值 */
    curVal: number,
    /**数据的最小值 */
    min: number,
    /**数据的最大值 */
    max: number
}

/**所需基本参数（计算数据的等级并根据等级得出描述文字的功能）（用于场景的光、气味、噪声） */
interface PARAMS_FOR_CAWFLSN extends PARAMS_FOR_CAW {
    /**场景是否经过第一轮文字描述 */
    getIfStageWrited: () => Boolean,
    /**数据类型 */
    dataType: _STAGE_DATA
}

/**所需基本参数（计算数据的等级并根据等级得出描述文字的功能）（用于场景的调查进度） */
interface PARAMS_FOR_CAWFP extends PARAMS_FOR_CAW {
    /**数据类型 */
    detectType: _DETECT_TYPE
}

/**计算数据的等级并根据等级得出描述文字 */
export function calAndWriteForLSN ({pushText, getIfStageWrited, stageType, dataType, newVal, curVal, min, max}: PARAMS_FOR_CAWFLSN) {
    const diff = max - min
    let newLevel: _STAGE_DATA_LEVEL = calLevel(newVal, diff)
    let currentLevel: _STAGE_DATA_LEVEL = calLevel(curVal, diff)
    if (getIfStageWrited()) { // 检查是否是已经经过第一轮描述的场景，如果不是，使用完整描述句式。
        if (newLevel > currentLevel) {
            pushText(randomEFA(STAGE_BOX[stageType].data[dataType][_STAGE_DATA_STATE.INCREASE][newLevel]))
        }
        if (newLevel < currentLevel) {
            pushText(randomEFA(STAGE_BOX[stageType].data[dataType][_STAGE_DATA_STATE.DECREASE][newLevel]))
        }
    } else {
        pushText(randomEFA(STAGE_BOX[stageType].data[dataType][_STAGE_DATA_STATE.NEW][newLevel]))
    }
}

/**计算调查进度等级并根据等级得出描述文字 */
export function calAndWriteForProgress ({pushText, stageType, detectType, newVal, curVal, min, max}: PARAMS_FOR_CAWFP) {
    if (curVal === 0) {
        pushText(randomEFA(STAGE_BOX[stageType].detect[detectType][_DETECT_STATE.START]))
    } else {
        const newState: _DETECT_STATE = calStateForProgress(newVal, min, max)
        const curState: _DETECT_STATE = calStateForProgress(curVal, min, max)
        const state: _DETECT_STATE = newState === curState ? _DETECT_STATE.CONTINUE : newState
        pushText(randomEFA(STAGE_BOX[stageType].detect[detectType][state]))
    }
}

/**包含所有场景类型 */
export const STAGE_BOX: _STAGE_BOX = {
    [_STAGE_TYPE.ROOM]: {
        name: '房间',
        state: {
            [_STAGE_STATE.START]: ['你在一个房间里醒来', '你来到了一个房间里', '你身处在一个奇怪的房间里'],
            [_STAGE_STATE.HALFWAY]: ['你发现出口的另一边居然是一个房间'],
            [_STAGE_STATE.END]: ['你逃到了一个房间']
        },
        data: {
            [_STAGE_DATA.LIGHT]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['房间里一片漆黑', '房间里十分黑暗', '房间里几乎什么都看不见'],
                    [_STAGE_DATA_LEVEL.B]: ['昏暗的房间让你很难看清周围的东西', '周围只有一点微光'],
                    [_STAGE_DATA_LEVEL.C]: ['昏黄的光线由窗口进入了房间', '房间被幽绿的光线笼罩', '整个房间充满了诡异的蓝光'],
                    [_STAGE_DATA_LEVEL.D]: ['房间里十分光亮', '这个房间灯火通明']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_STAGE_DATA.SMELL]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_STAGE_DATA.NOISE]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_DETECT_TYPE.CANDLE]: {
                [_DETECT_STATE.START]: [
                    '你发现房间的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在房间的角落，上面好像有一根蜡烛。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_DETECT_TYPE.CIRCLE]: {
                [_DETECT_STATE.START]: [
                    '你发现房间的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在房间的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_STAGE_TYPE.DUNGEON]: {
        name: '地牢',
        state: {
            [_STAGE_STATE.START]: [`你在一个地牢里醒来`, `你身处于一个地牢`, `你身处在一个潮湿的地牢里`],
            [_STAGE_STATE.HALFWAY]: ['你慌张跑进了出口，脚下一空，掉进了一个地牢'],
            [_STAGE_STATE.END]: ['你逃到了一个地牢']
        },
        data: {
            [_STAGE_DATA.LIGHT]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['地牢里漆黑一片', '周围几乎什么都看不见'],
                    [_STAGE_DATA_LEVEL.B]: ['地牢里一片昏暗', '地牢里只有一点微光的'],
                    [_STAGE_DATA_LEVEL.C]: ['地牢被幽绿的光线笼罩', '地牢里充满诡异蓝光'],
                    [_STAGE_DATA_LEVEL.D]: ['地牢很光亮']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_STAGE_DATA.SMELL]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_STAGE_DATA.NOISE]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_DETECT_TYPE.CANDLE]: {
                [_DETECT_STATE.START]: [
                    '你发现地牢的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在地牢的角落，上面好像有一根蜡烛。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_DETECT_TYPE.CIRCLE]: {
                [_DETECT_STATE.START]: [
                    '你发现地牢的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在地牢的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_STAGE_TYPE.CHURCH]: {
        name: '教堂',
        state: {
            [_STAGE_STATE.START]: ['你在一个教堂里醒来', '你发现你来到了一个教堂', '你身处在一个教堂里'],
            [_STAGE_STATE.HALFWAY]: ['你通过出口来到了一个教堂'],
            [_STAGE_STATE.END]: ['你在出口的尽头找到了一个教堂']
        },
        data: {
            [_STAGE_DATA.LIGHT]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['教堂里几乎没有一丝光线', '由于教堂里太暗，你什么都看不见。'],
                    [_STAGE_DATA_LEVEL.B]: ['周围是昏暗的环境', '好像只有一点微光'],
                    [_STAGE_DATA_LEVEL.C]: ['教堂被幽绿的光线笼罩', '教堂里充满了诡异的蓝光'],
                    [_STAGE_DATA_LEVEL.D]: ['教堂里的灯光十分明亮']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_STAGE_DATA.SMELL]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_STAGE_DATA.NOISE]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_DETECT_TYPE.CANDLE]: {
                [_DETECT_STATE.START]: [
                    '你发现教堂的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在教堂的角落，上面好像有一根蜡烛。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_DETECT_TYPE.CIRCLE]: {
                [_DETECT_STATE.START]: [
                    '你发现教堂的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在教堂的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_STAGE_TYPE.TOMB]: {
        name: '墓穴',
        state: {
            [_STAGE_STATE.START]: [`你在一个墓穴里醒来`, `你来到了一个墓穴`, `你身处在一个墓穴里`],
            [_STAGE_STATE.HALFWAY]: ['与出口连通的居然是一个墓穴'],
            [_STAGE_STATE.END]: ['你发现自己居然来到了一个墓穴']
        },
        data: {
            [_STAGE_DATA.LIGHT]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['墓穴里一片漆黑', '墓穴里只有无尽的黑暗'],
                    [_STAGE_DATA_LEVEL.B]: ['漆黑中似乎有一点点的微光', '一些光透过墙壁的缝隙渗透进来'],
                    [_STAGE_DATA_LEVEL.C]: ['墓穴里布满诡异的光环', '墓穴里充满诡异的蓝光'],
                    [_STAGE_DATA_LEVEL.D]: ['墓穴里居然异常光亮', '墓穴里放满了蜡烛，把周围照得通亮。']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_STAGE_DATA.SMELL]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_STAGE_DATA.NOISE]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_DETECT_TYPE.CANDLE]: {
                [_DETECT_STATE.START]: [
                    '你发现墓穴的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在墓穴的角落，上面好像有一根蜡烛。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_DETECT_TYPE.CIRCLE]: {
                [_DETECT_STATE.START]: [
                    '你发现墓穴的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在墓穴的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_STAGE_TYPE.VALUT]: {
        name: '地下室',
        state: {
            [_STAGE_STATE.START]: [`你在一个地下室里醒来`, `你来到了一个地下室`, `你身处在一个地下室里`],
            [_STAGE_STATE.HALFWAY]: ['你走到了一个地下室'],
            [_STAGE_STATE.END]: ['你跑进了一个地下室']
        },
        data: {
            [_STAGE_DATA.LIGHT]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['地下室一片漆黑', '地下室里几乎什么都看不见'],
                    [_STAGE_DATA_LEVEL.B]: ['室内的环境很难看清', '地下室只有一点微光'],
                    [_STAGE_DATA_LEVEL.C]: ['周围被幽绿的光线笼罩', '室内充满诡异蓝光'],
                    [_STAGE_DATA_LEVEL.D]: ['地下室的灯都亮着，很亮很亮。']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_STAGE_DATA.SMELL]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_STAGE_DATA.NOISE]: {
                [_STAGE_DATA_STATE.NEW]: {
                    [_STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_STAGE_DATA_STATE.INCREASE]: {
                    [_STAGE_DATA_LEVEL.A]: [''],
                    [_STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_STAGE_DATA_STATE.DECREASE]: {
                    [_STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_DETECT_TYPE.CANDLE]: {
                [_DETECT_STATE.START]: [
                    `你发现地下室的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。`,
                    `你发现似乎有一张破旧的桌子被放在地下室的角落，上面好像有一根蜡烛。`
                ],
                [_DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_DETECT_TYPE.CIRCLE]: {
                [_DETECT_STATE.START]: [
                    '你发现地下室的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在地下室的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    }
}

export const STAGE_EVENT = {
    leave: ['你找到了出口'],
    win: ['你终于逃出来了']
}

export const STAGE_LIMIT = {
    light: {
        min: 0,
        max: 20,
        percent: 0.3
    },
    smell: {
        min: 0,
        max: 20,
        percent: 0.3
    },
    noise: {
        min: 0,
        max: 20,
        percent: 0.3
    },
    progress: {
        each: 20,
        eachPercent: 0.3,
        max: 80,
        percent: 0.2
    }
}