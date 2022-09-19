/**(All Type For Playground)游戏内的所有自定义类*/
export namespace _AT{
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

    /**物品种类枚举 */
    export enum _ITEM_TYPE {
        FLASHLIGHT,
        SWORD,
        GUN
    }

    /**道具功能的种类 */
    export enum _ITEM_FUNC_TYPE {
        /**攻击和搜索类 */
        A,
        /**功能类 */
        B
    }

    export enum _FLASHLIGHT_FUNC {
        ON,
        OFF
    }

    export enum _SWORD_FUNC {
        ATTACK
    }

    export enum _GUN_FUNC {
        SHOOT
    }

    /**玩家或者敌人的物品变化状态 */
    export enum _ITEM_USE_STATE {
        /**未有任何拾取、被丢弃或者使用 */
        NEW,
        /**被拾取 */
        ADDED,
        /**未被拾取 */
        REMOVED,
        /**使用完 */
        USED
    }

    /**存放所有物品所有信息的object的结构 */
    export type _ITEM_BOX = {
        [key in _ITEM_TYPE]: {
            name: string,
            intro: string,
            /**所有物品的状态变化时的描述文字样本库的结构 */
            state: {
                [key in _ITEM_USE_STATE]: Array<string>
            },
            func: {
                [index: number]: {
                    type: _AT._ITEM_FUNC_TYPE,
                    name: string,
                    intro: string,
                    describe: string
                }
            }
        }
    }

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
            data: {
                [key in _ENEMY_DATA]: {
                    [key in _DATA_STATE]: Array<string>
                }
            }
        }
    }
}

export const TEXT_REPLACE_SAMPLE = '%replace_sample%'

/**包含所有场景类型 */
export const STAGE_BOX: _AT._STAGE_BOX = {
    [_AT._STAGE_TYPE.ROOM]: {
        name: '房间',
        state: {
            [_AT._STAGE_STATE.START]: ['你在一个房间里醒来', '你来到了一个房间里', '你身处在一个奇怪的房间里'],
            [_AT._STAGE_STATE.HALFWAY]: [],
            [_AT._STAGE_STATE.END]: []
        },
        data: {
            [_AT._STAGE_DATA.LIGHT]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['房间里一片漆黑', '房间里十分黑暗', '房间里几乎什么都看不见'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['昏暗的房间让你很难看清周围的东西', '周围只有一点微光的'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['昏黄的光线由窗口进入了房间', '房间被幽绿的光线笼罩的', '整个房间充满了诡异的蓝光'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['房间里十分光亮', '这个房间灯火通明']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_AT._STAGE_DATA.SMELL]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_AT._STAGE_DATA.NOISE]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_AT._DETECT_TYPE.CANDLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现房间的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在房间的角落，上面好像有一根蜡烛。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_AT._DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_AT._DETECT_TYPE.CIRCLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现房间的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在房间的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_AT._DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_AT._STAGE_TYPE.DUNGEON]: {
        name: '地牢',
        state: {
            [_AT._STAGE_STATE.START]: [`你在一个地牢里醒来`, `你身处于一个地牢`, `你身处在一个潮湿的地牢里`],
            [_AT._STAGE_STATE.HALFWAY]: [],
            [_AT._STAGE_STATE.END]: []
        },
        data: {
            [_AT._STAGE_DATA.LIGHT]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['地牢里漆黑一片', '周围几乎什么都看不见'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['幽暗的', '昏暗的', '只有一点微光的'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['昏黄的', '被幽绿的光线笼罩的', '充满诡异蓝光的'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['光亮的', '灯火通明的', '亮如白昼的']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_AT._STAGE_DATA.SMELL]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_AT._STAGE_DATA.NOISE]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_AT._DETECT_TYPE.CANDLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现地牢的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在地牢的角落，上面好像有一根蜡烛。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_AT._DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_AT._DETECT_TYPE.CIRCLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现地牢的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在地牢的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_AT._DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_AT._STAGE_TYPE.CHURCH]: {
        name: '教堂',
        state: {
            [_AT._STAGE_STATE.START]: ['你在一个教堂里醒来', '你发现你来到了一个教堂', '你身处在一个教堂里'],
            [_AT._STAGE_STATE.HALFWAY]: [],
            [_AT._STAGE_STATE.END]: []
        },
        data: {
            [_AT._STAGE_DATA.LIGHT]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['教堂里几乎没有一丝光线', '由于教堂里太暗，你什么都看不见。'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围是昏暗的环境', '好像只有一点微光'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['教堂被幽绿的光线笼罩', '教堂里充满了诡异的蓝光'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['教堂里的灯光十分明亮']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_AT._STAGE_DATA.SMELL]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_AT._STAGE_DATA.NOISE]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_AT._DETECT_TYPE.CANDLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现教堂的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在教堂的角落，上面好像有一根蜡烛。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_AT._DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_AT._DETECT_TYPE.CIRCLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现教堂的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在教堂的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_AT._DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_AT._STAGE_TYPE.TOMB]: {
        name: '墓穴',
        state: {
            [_AT._STAGE_STATE.START]: [`你在一个墓穴里醒来`, `你来到了一个墓穴`, `你身处在一个墓穴里`],
            [_AT._STAGE_STATE.HALFWAY]: [],
            [_AT._STAGE_STATE.END]: []
        },
        data: {
            [_AT._STAGE_DATA.LIGHT]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['墓穴里一片漆黑', '墓穴里只有无尽的黑暗'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['漆黑中似乎有一点点的微光', '一些光透过墙壁的缝隙渗透进来'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['墓穴里布满诡异的光环', '墓穴里充满诡异的蓝光'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['墓穴里居然异常光亮', '墓穴里放满了蜡烛，把周围照得通亮。']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_AT._STAGE_DATA.SMELL]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_AT._STAGE_DATA.NOISE]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_AT._DETECT_TYPE.CANDLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现墓穴的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。',
                    '你发现似乎有一张破旧的桌子被放在墓穴的角落，上面好像有一根蜡烛。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_AT._DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_AT._DETECT_TYPE.CIRCLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现墓穴的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在墓穴的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_AT._DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    },
    [_AT._STAGE_TYPE.VALUT]: {
        name: '地下室',
        state: {
            [_AT._STAGE_STATE.START]: [`你在一个地下室里醒来`, `你来到了一个地下室`, `你身处在一个地下室里`],
            [_AT._STAGE_STATE.HALFWAY]: [],
            [_AT._STAGE_STATE.END]: []
        },
        data: {
            [_AT._STAGE_DATA.LIGHT]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['地下室一片漆黑', '地下室里几乎什么都看不见'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['室内的环境很难看清', '地下室只有一点微光'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围被幽绿的光线笼罩', '室内充满诡异蓝光'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['地下室的灯都亮着，很亮很亮。']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围依然是一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围变成一片漆黑'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            [_AT._STAGE_DATA.SMELL]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            },
            [_AT._STAGE_DATA.NOISE]: {
                [_AT._STAGE_DATA_STATE.NEW]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                [_AT._STAGE_DATA_STATE.INCREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: [''],
                    [_AT._STAGE_DATA_LEVEL.B]: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                [_AT._STAGE_DATA_STATE.DECREASE]: {
                    [_AT._STAGE_DATA_LEVEL.A]: ['声音似乎消失了',  '周围居然安静了下来'],
                    [_AT._STAGE_DATA_LEVEL.B]: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    [_AT._STAGE_DATA_LEVEL.C]: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    [_AT._STAGE_DATA_LEVEL.D]: ['']
                }
            }
        },
        detect: {
            [_AT._DETECT_TYPE.CANDLE]: {
                [_AT._DETECT_STATE.START]: [
                    `你发现地下室的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。`,
                    `你发现似乎有一张破旧的桌子被放在地下室的角落，上面好像有一根蜡烛。`
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
                [_AT._DETECT_STATE.END]: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑']
            },
            [_AT._DETECT_TYPE.CIRCLE]: {
                [_AT._DETECT_STATE.START]: [
                    '你发现地下室的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。',
                    '你在地下室的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。'
                ],
                [_AT._DETECT_STATE.HALFWAY]: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
                [_AT._DETECT_STATE.END]: ['你破解了法阵。', '法阵消失了。'],
                [_AT._DETECT_STATE.CONTINUE]: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案']
            }
        }
    }
}

export const ITEM_BOX: _AT._ITEM_BOX = {
    [_AT._ITEM_TYPE.FLASHLIGHT]: {
        name: '手电筒',
        intro: '亮亮哦',
        state: {
            [_AT._ITEM_USE_STATE.NEW]: [],
            [_AT._ITEM_USE_STATE.ADDED]: ['你拿到了一支手电筒', '你获得一支手电筒'],
            [_AT._ITEM_USE_STATE.REMOVED]: ['你放下了手电筒', '你丢弃了手电筒', '你把手电筒放了在地上'],
            [_AT._ITEM_USE_STATE.USED]: ['你的手电筒没电了', '你手电筒的电用完了']
        },
        func: {
            [_AT._FLASHLIGHT_FUNC.ON]: {
                type: _AT._ITEM_FUNC_TYPE.B,
                name: '打开手电筒',
                intro: '每个回合消耗一格电',
                describe: '你打开了手电筒'
            },
            [_AT._FLASHLIGHT_FUNC.OFF]: {
                type: _AT._ITEM_FUNC_TYPE.B,
                name: '关闭手电筒',
                intro: '关闭之后就不耗电了',
                describe: '你关了手电筒'
            }
        }
    },
    [_AT._ITEM_TYPE.SWORD]: {
        name: '剑',
        intro: '是兄弟就来砍我',
        state: {
            [_AT._ITEM_USE_STATE.NEW]: [],
            [_AT._ITEM_USE_STATE.ADDED]: ['你拿到了一把剑', '你找到了一把剑'],
            [_AT._ITEM_USE_STATE.REMOVED]: ['你扔掉了剑'],
            [_AT._ITEM_USE_STATE.USED]: ['你的剑刃已经崩了', '你的剑断了']
        },
        func: {
            [_AT._SWORD_FUNC.ATTACK]: {
                type: _AT._ITEM_FUNC_TYPE.A,
                name: '用剑攻击',
                intro: '砍砍砍！',
                describe: '你拿着剑砍了过去'
            }
        }
    },
    [_AT._ITEM_TYPE.GUN]: {
        name: '手枪',
        intro: '又快又准',
        state: {
            [_AT._ITEM_USE_STATE.NEW]: [],
            [_AT._ITEM_USE_STATE.ADDED]: ['你找到了一把手枪', '你搜出了一把枪'],
            [_AT._ITEM_USE_STATE.REMOVED]: ['你把枪丢掉了', '你扔掉了你的枪'],
            [_AT._ITEM_USE_STATE.USED]: ['你的子弹用完了', '你的枪没有子弹了']
        },
        func: {
            [_AT._GUN_FUNC.SHOOT]: {
                type: _AT._ITEM_FUNC_TYPE.A,
                name: '射击',
                intro: `一共有${TEXT_REPLACE_SAMPLE}发子弹`,
                describe: '你打出了一发子弹'
            }
        }
    }
}

/**玩家属性的描述文字的样本库 */
export const PLAYER_BOX: _AT._PLAYER_BOX = {
    data: {
        [_AT._PLAYER_DATA.HP]: {
            [_AT._DATA_STATE.INCREASE]: [
                '你感觉身体状况变好了',
                '你的伤势得到了缓和'
            ],
            [_AT._DATA_STATE.DECREASE]: [
                '你感觉到剧烈疼痛',
                '你的受伤了',
                '你的伤势更严重了'
            ],
            [_AT._DATA_STATE.ZERO]: [
                '你死了',
                '你倒下了'
            ]
        },
        [_AT._PLAYER_DATA.SANS]: {
            [_AT._DATA_STATE.INCREASE]: [
                '你感觉清醒了一些',
                '你的恢复了一点理智'
            ],
            [_AT._DATA_STATE.DECREASE]: [
                '你越来越感觉害怕',
                '你感觉自己有点疯狂',
            ],
            [_AT._DATA_STATE.ZERO]: [
                '你陷入了疯狂'
            ]
        },
        [_AT._PLAYER_DATA.STAM]: {
            [_AT._DATA_STATE.INCREASE]: [
                '你感觉更有力气了',
                '你恢复了一些体力'
            ],
            [_AT._DATA_STATE.DECREASE]: [
                '你觉得有点累',
                '你感受到自己体力的流失',
            ],
            [_AT._DATA_STATE.ZERO]: [
                '你觉得全身乏力',
                '你似乎已经没有任何力气了'
            ]
        }
    },
    control: {
        [_AT._PLAYER_CONTROL.SEARCH]: {
            name: '调查线索',
            intro: '快想想办法吧'
        }
    }
}

/**所有敌人的基本信息 */
export const ENEMY_BOX: _AT._ENEMY_BOX = {
    [_AT._ENEMY_TYPE.HUMAN_BODY_MONSTER]: {
        name: '全身都是眼睛的人形怪物',
        data: {
            [_AT._ENEMY_DATA.HP]: {
                [_AT._DATA_STATE.INCREASE]: [],
                [_AT._DATA_STATE.DECREASE]: [
                    '人形怪物似乎受到了伤害',
                    '怪物的眼睛掉到了地上'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '怪物炸开了',
                    '怪物的眼睛全都融化了'
                ]
            },
            [_AT._ENEMY_DATA.NOISE]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '人形怪物张开了口对着你大吼',
                    '人形怪物发出了奇怪的尖叫声'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '一阵奇怪的低吼由怪物的腹部传出',
                    '人形怪物发出奇怪的抽泣声'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '怪物变安静了'
                ]
            },
            [_AT._ENEMY_DATA.SMELL]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '怪物的身上散发出越来越浓烈的刺激气味',
                    '一股恶心的味道由怪物身上散发出来'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '怪物的怪味似乎变淡了',
                    '来自怪物的气味似乎变少了'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '人形怪物散发出的气味消失了'
                ]
            }
        }
    },
    [_AT._ENEMY_TYPE.DOG_HEAD]: {
        name: '由狗头混成一团的肉泥',
        data: {
            [_AT._ENEMY_DATA.HP]: {
                [_AT._DATA_STATE.INCREASE]: [],
                [_AT._DATA_STATE.DECREASE]: [
                    '狗头发出悲惨的叫声',
                    '狗头的皮肤开始裂开了'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '狗头的全部眼睛都闭上了',
                    '全部狗头的不动了'
                ]
            },
            [_AT._ENEMY_DATA.NOISE]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '肉泥中的几个狗头在狂吠',
                    '狗头的口里传来人在快速朗诵的声音'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '狗头发出了像人一样的低吟声',
                    '狗头的皮肤开始裂开了'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '肉泥变安静了下来'
                ]
            },
            [_AT._ENEMY_DATA.SMELL]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '狗头的口流出了恶心的唾液，散发出恶心的臭味。',
                    '肉泥的臭味越来越浓烈'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '肉泥的臭味似乎变淡了',
                    '由狗头传出的气味似乎慢慢变少了'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '狗头肉泥的气味消失了'
                ]
            }
        }
    },
    [_AT._ENEMY_TYPE.DARK_PLATE]: {
        name: '怪异的黑色碟状物',
        data: {
            [_AT._ENEMY_DATA.HP]: {
                [_AT._DATA_STATE.INCREASE]: [],
                [_AT._DATA_STATE.DECREASE]: [
                    '碟状物表面出现裂痕',
                    '碟状物掉落了一些碎块'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '碟状物化成了粉末',
                    '碟状物粉碎了'
                ]
            },
            [_AT._ENEMY_DATA.NOISE]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '碟状物发出一阵刺耳的声波',
                    '碟状物连续发出了几段急促的声波'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '碟状物的声波音量降低了',
                    '碟状物的声波变得断断续续'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '完全听不到碟状物的声波了'
                ]
            },
            [_AT._ENEMY_DATA.SMELL]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '碟状物散发出一阵阵硫磺的味道',
                    '碟状物散发出一股类似烧焦塑料的味道'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '碟状物的气味变成了淡淡的药水气味',
                    '似乎有一股墨水味从碟状物散发开来'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '似乎闻不到碟状物的气味了',
                ]
            }
        }
    },
    [_AT._ENEMY_TYPE.BLUE_TENTACLES]: {
        name: '巨大的蓝色触手',
        data: {
            [_AT._ENEMY_DATA.HP]: {
                [_AT._DATA_STATE.INCREASE]: [],
                [_AT._DATA_STATE.DECREASE]: [
                    '触手上出现了伤痕',
                    '触手暴露出了里面的奇怪血管',
                    '一些奇怪的蓝色液体从触手溅出'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '触手断成了两段',
                    '触手化成了一滩灰色液体'
                ]
            },
            [_AT._ENEMY_DATA.NOISE]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '一阵阵肌肉破裂的声音从触手的内部传出'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '触手发出一些像是海豚的叫声'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '触手发出的声音消失了'
                ]
            },
            [_AT._ENEMY_DATA.SMELL]: {
                [_AT._DATA_STATE.INCREASE]: [
                    '触手散发出一股恶心的腥臭味'
                ],
                [_AT._DATA_STATE.DECREASE]: [
                    '触手散的腥臭味变淡了'
                ],
                [_AT._DATA_STATE.ZERO]: [
                    '来自触手的腥臭味消失了'
                ]
            }
        }
    }
}

export const LIMIT = {
    stage: {
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
    },
    player: {
        itemAmount: 2,
        findItem: 0.75
    },
    enemy: {
        amount: {
            max: 3
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
            min: 1,
            max: 8,
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
}