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

export type _ALLITEM_FUNC = _FLASHLIGHT_FUNC | _SWORD_FUNC | _GUN_FUNC

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

export type _ITEM_FUNC_DATA = {
    type: _ITEM_FUNC_TYPE,
    key: number,
    name: string,
    intro: string,
    describe: string
}

type _ITEM = {
    name: string,
    intro: string,
    /**所有物品的状态变化时的描述文字样本库的结构 */
    state: {
        [key in _ITEM_USE_STATE]: Array<string>
    },
    funcBox: Array<_ITEM_FUNC_DATA>
}

export type _ITEM_BOX = {
    [key in _ITEM_TYPE]: _ITEM
}

export const ITEM_BOX: _ITEM_BOX = {
    [_ITEM_TYPE.FLASHLIGHT]: {
        name: '手电筒',
        intro: '亮亮哦',
        state: {
            [_ITEM_USE_STATE.NEW]: [],
            [_ITEM_USE_STATE.ADDED]: ['你拿到了一支手电筒', '你获得一支手电筒'],
            [_ITEM_USE_STATE.REMOVED]: ['你放下了手电筒', '你丢弃了手电筒', '你把手电筒放了在地上'],
            [_ITEM_USE_STATE.USED]: ['你的手电筒没电了', '你手电筒的电用完了']
        },
        funcBox: [
            {
                type: _ITEM_FUNC_TYPE.B,
                key: _FLASHLIGHT_FUNC.ON,
                name: '打开手电筒',
                intro: '每个回合消耗一格电',
                describe: '你打开了手电筒'
            },
            {
                type: _ITEM_FUNC_TYPE.B,
                key: _FLASHLIGHT_FUNC.OFF,
                name: '关闭手电筒',
                intro: '关闭之后就不耗电了',
                describe: '你关了手电筒'
            }
        ]
    },
    [_ITEM_TYPE.SWORD]: {
        name: '剑',
        intro: '是兄弟就来砍我',
        state: {
            [_ITEM_USE_STATE.NEW]: [],
            [_ITEM_USE_STATE.ADDED]: ['你拿到了一把剑', '你找到了一把剑'],
            [_ITEM_USE_STATE.REMOVED]: ['你扔掉了剑'],
            [_ITEM_USE_STATE.USED]: ['你的剑刃已经崩了', '你的剑断了']
        },
        funcBox: [
            {
                type: _ITEM_FUNC_TYPE.A,
                key: _SWORD_FUNC.ATTACK,
                name: '用剑攻击',
                intro: '砍砍砍！',
                describe: '你拿着剑砍了过去'
            }
        ]
    },
    [_ITEM_TYPE.GUN]: {
        name: '手枪',
        intro: '又快又准',
        state: {
            [_ITEM_USE_STATE.NEW]: [],
            [_ITEM_USE_STATE.ADDED]: ['你找到了一把手枪', '你搜出了一把枪'],
            [_ITEM_USE_STATE.REMOVED]: ['你把枪丢掉了', '你扔掉了你的枪'],
            [_ITEM_USE_STATE.USED]: ['你的子弹用完了', '你的枪没有子弹了']
        },
        funcBox: [
            {
                type: _ITEM_FUNC_TYPE.A,
                key: _GUN_FUNC.SHOOT,
                name: '射击',
                intro: `一共有?发子弹`,
                describe: '你打出了一发子弹'
            }
        ]
    }
}