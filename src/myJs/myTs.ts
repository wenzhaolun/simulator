import {
    LIMIT,
    _AT,
    STAGE_BOX,
    ITEM_BOX,
    PLAYER_BOX,
    ENEMY_BOX
} from '../myJs/data'

/** 根据最大值，随机获取0-最大值的整数。 */
function randomNumber (max: number) {
    return Math.round(Math.random() * max)
}

/** randomEleFromArray，在数组里随机抽气一个ele。 */
function randomEFA<T>(array: Array<T>): T | null {
    if (array.length > 0) {
        return array[randomNumber(array.length - 1)]
    } else {
        return null
    }
}

function randomEnumKey (x: object) {
    const temp = Object.keys(x)
    return randomNumber((temp.length / 2) - 1)
}

/**根据最大值和最小值，还有保底百分比，计算随机初始值。
 * @param min 最小值
 * @param max 最大值
 * @param percent 保底百分比
*/
function randomInitialValue (min: number, max: number, percent: number) {
    const diff = max - min
    return randomNumber(diff * (1 - percent)) + diff * percent + min
}

/**根据最大值和最小值，还有保底百分比，计算随机增加值。
 * @param min 最小值
 * @param max 最大值
 * @param eachPercent 保底百分比
*/
function randomPlusValue (min: number, max: number, eachPercent: number) {
    const diff = max - min
    return randomNumber(diff * eachPercent)
}

class TextBox {
    public textBoxVal: Array<string> = []

    public pushToTextBox (text: string) {
        console.log('text from pushToTextBox ===>', text)
        this.textBoxVal.splice(0 , 0, text)
        console.log('textBoxVal ==>', this.textBoxVal)
    }
    public getTextBox () {
        return this.textBoxVal
    }
}

/**场景的基础属性的类
 * 这类属性有基础、扩展和合计，基础+扩展=合计
 * 扩展的值的变化触发合计的值的变化
 * 合计的值的变化触发相关描述文字的变化
 */
abstract class BasicData {
    /**记录数据是否是新的，从而判断数据按新的或旧的来生成描述文字。 */
    protected ifDataNew: boolean = true
    protected abstract _data: number
    protected set data (n: number) {
        this._data = n

        this.totalData = this.sumData(n, this.extendData)
    }
    protected get data () {
        return this._data
    }
    /**获取属性的值 */
    public getVal () {
        return this.data
    }

    /**获取属性的好坏比率（超过上下限中间值的就是好，否则就是坏） */
    public getConditionRate () {
        return this.data / ((this.totalDataMax - this.totalDataMin) / 2)
    }

    protected _extendData: Array<{uuid: string, val: number}> = []
    protected set extendData (n: Array<{uuid: string, val: number}>) {
        this._extendData = n
        this.totalData = this.sumData(this.data, n)
    }
    protected get extendData () {
        return this._extendData
    }

    /**设置其他对象对属性的影响值。
     * 数值由包含id和数值两个变量的object形式存放在数列中，每个id对应一个其他外部对象（如玩家、敌人等）的对属性数值的影响。
     * 如果对应的id存在，即代表本来的数组里已经有相关对象留下的数值影响，此时不是往数组里添加新的object，而是修改原有的相关object。
     * */
    public setExtendData (x: {uuid: string, val: number}) {
        console.log('x from setExtendData ===>', x)

        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === x.uuid
        })

        if (index > -1) {
            temp[index].val = x.val
        } else {
            temp.splice(0, 0, x)
        }
        console.log('temp from setExtendData ===>', temp)
        this.extendData = temp
    }
    /**增加其他对象对属性的影响值。
     * 数值由包含id和数值两个变量的object形式存放在数列中，每个id对应一个其他外部对象（如玩家、敌人等）的对属性数值的影响。
     * 如果对应的id存在，即代表本来的数组里已经有相关对象留下的数值影响，此时不是往数组里添加新的object，而是修改原有的相关object。
     * */
    public plusExtendData (x: {uuid: string, val: number}) {
        console.log('x from setExtendData ===>', x)

        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === x.uuid
        })

        if (index > -1) {
            temp[index].val += x.val
        } else {
            temp.splice(0, 0, x)
        }

        this.extendData = temp
    }
    /** 删除其他对象对属性的整个影响值 */
    public removeExtendData (uuid: string) {
        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === uuid
        })

        if (index > -1) {
            temp.splice(index, 1)
            this.extendData = temp
        }
    }

    /** 减少其他对象对属性的整个影响值 */
    public minusExtendData (uuid: string, val: number) {
        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === uuid
        })

        if (index > -1) {
            temp[index].val = temp[index].val - val
            this.extendData = temp
        }
    }

    protected _totalData: number = 0
    protected set totalData (val: number) {
        const newVal = val
        const curVal = this._totalData
        this.whenDataChange(newVal, curVal)
        this._totalData = val
    }
    protected get totalData () {
        return this._totalData
    }

    protected sumData (data: number, extendData: typeof this.extendData) {
        let res: number = 0
        let sumExtendData = 0
        console.log('extendData from sumData ===>', extendData)
        for (let i = 0; i < extendData.length; i++) {
            const ele = extendData[i]
            sumExtendData += ele.val
        }

        if (data + sumExtendData >= 0) {
            if (this.data + sumExtendData > this.totalDataMax) {
                res = this.totalDataMax
                console.log('res from sumDataA ===>', res)
            } else {
                res = this.data + sumExtendData
                console.log('res from sumDataB ===>', res)
            }
        } else {
            res = this.totalDataMin
            console.log('res from sumDataC ===>', res)
        }

        console.log('res from sumData ===>', res)
        return res
    }

    protected abstract readonly totalDataMin: number
    protected abstract readonly totalDataMax: number

    /** 根据属性的变化，分别计算出等级，并从相关文本样本里选出对应要显示的文字。 
    * @param newVal 当前属性的数值。
    * @param curVal 当前记录的属性的等级
    */
    protected abstract readonly whenDataChange: (newVal: number, curVal: number) => void
    /**推送文字的方法 */
    protected pushToTextBox: TextBox['pushToTextBox'] | undefined
    /**绑定pushToTextBox方法 */
    protected bindPushToTextBox (pushToTextBox: TextBox['pushToTextBox']) {
        this.pushToTextBox = pushToTextBox
    }
    /**写文字（就是pushToTextBox套一层判断而已） */
    protected write (text: string | null) {
        if (text) {
            if (this.pushToTextBox) {
                this.pushToTextBox(text)
            } else {
                console.log('pushToTextBox undefine')
            }
        } else {
            console.log('text is null')
        }
    }

    /**初始化，绑定推送文字、数值初始化等 */
    public init (x: {
        pushToTextBox: TextBox['pushToTextBox'],
        initialValue: number
    }) {
        this.bindPushToTextBox(x.pushToTextBox)
        this.data = x.initialValue
    }
}


/**专供hp使用的BasicData */
abstract class BasicDataForHP extends BasicData {
    protected set totalData(val: number) {
        const newVal = val
        const curVal = this._totalData
        this.whenDataChange(newVal, curVal)
        this._totalData = val
        if (val <= 0) {
            this.die()
        }
    }
    protected get totalData(): number {
        return this._totalData
    }
    protected abstract die: (x?: any) => void
}

/**专供给Stage的光、气味、噪声的BasicData */
class BasicDataForSLSN extends BasicData {
    protected _data: BasicData['_data'] = 0
    /**场景类型 */
    private stageType: _AT._STAGE_TYPE
    /** 根据数值计算等级 */
    private calLevel (val: number): _AT._STAGE_DATA_LEVEL {
        const diff = this.totalDataMax - this.totalDataMin
        let res
        switch (true) { // 根据总数值计算级别
            case val <= diff / 4:
                res = _AT._STAGE_DATA_LEVEL.A
                break
            case val <= diff / 4 * 2:
                res = _AT._STAGE_DATA_LEVEL.B
                break
            case val <= diff / 4 * 3:
                res = _AT._STAGE_DATA_LEVEL.C
                break
            case val <= diff:
                res = _AT._STAGE_DATA_LEVEL.D
                break
            default:
                res = _AT._STAGE_DATA_LEVEL.A
                break
        }
        return res
    }
    /**场景数据类别 */
    private stageDataType: _AT._STAGE_DATA

    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    /**生成文字 */
    protected whenDataChange: BasicData['whenDataChange'] = (newVal: number, curVal: number) => {
        let newLevel: _AT._STAGE_DATA_LEVEL = this.calLevel(newVal)
        let currentLevel: _AT._STAGE_DATA_LEVEL = this.calLevel(curVal)
        if (this.ifDataNew) { // 检查是否是新开的场景，如果是新开的场景，使用完整描述句式。
            this.write(randomEFA(STAGE_BOX[this.stageType].data[this.stageDataType][_AT._STAGE_DATA_STATE.NEW][newLevel]))
            this.ifDataNew = false
        } else {
            if (newLevel > currentLevel) {
                this.write(randomEFA(STAGE_BOX[this.stageType].data[this.stageDataType][_AT._STAGE_DATA_STATE.INCREASE][newLevel]))
            }
            if (newLevel < currentLevel) {
                this.write(randomEFA(STAGE_BOX[this.stageType].data[this.stageDataType][_AT._STAGE_DATA_STATE.DECREASE][newLevel]))
            }
        }
    }

    constructor (x: {
        stageDataType: BasicDataForSLSN['stageDataType'],
        totalDataMin: BasicData['totalDataMin'],
        totalDataMax: BasicData['totalDataMax'],
        stageType: ReturnType<Stage['getStageType']>
    }) {
        super()
        this.stageDataType = x.stageDataType
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
        this.stageType = x.stageType
    }
}
/**场景探索进度数据 */
class ProgressForStage extends BasicData {
    protected _data: number = 0
    /**调查事件类型 */
    private detectType: _AT._DETECT_TYPE = randomEnumKey(_AT._DETECT_TYPE)
    private stageType: ReturnType<Stage['getStageType']>
    /** 场景的搜寻进度是否升级？(用于判断是否随机生成道具，升级的时候不生成道具。) */
    private ifProgressUpgrade: boolean = false
    public getIfProgressUpgrade () {
        return this.ifProgressUpgrade
    }
    /** 根据数值计算等级 */
    private calStateForProgress (val: number): _AT._DETECT_STATE {
        let res: _AT._DETECT_STATE
            switch (true) { // 根据总数值计算级别
                case val <= this.totalDataMax / 2:
                    res = _AT._DETECT_STATE.START
                    break
                case val < this.totalDataMax:
                    res = _AT._DETECT_STATE.HALFWAY
                    break
                case val >= this.totalDataMax:
                    res = _AT._DETECT_STATE.END
                    break
                default:
                    res = _AT._DETECT_STATE.START
                    break
            }
        return res
    }
    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    /**生成文字 */
    protected whenDataChange: BasicData['whenDataChange'] = (newVal: number, curVal: number) => {
        if (curVal === 0) {
            this.write(randomEFA(STAGE_BOX[this.stageType].detect[this.detectType][_AT._DETECT_STATE.START]))
        } else {
            const newState: _AT._DETECT_STATE = this.calStateForProgress(newVal)
            const curState: _AT._DETECT_STATE = this.calStateForProgress(curVal)

            const res: _AT._DETECT_STATE = newState === curState ? _AT._DETECT_STATE.CONTINUE : newState
            console.log('stageType ===>', this.stageType, 'detectType ===>', this.detectType, 'res ===>', res)
            this.write(randomEFA(STAGE_BOX[this.stageType].detect[this.detectType][res]))
        }
    }

    public init (x: {
        pushToTextBox: TextBox['pushToTextBox'],
    }) {
        this.bindPushToTextBox(x.pushToTextBox)
    }

    constructor (x: {
        totalDataMin: ProgressForStage['totalDataMin'],
        totalDataMax: ProgressForStage['totalDataMax'],
        stageType: ProgressForStage['stageType']
    }) {
        super()
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
        this.stageType = x.stageType
    }
}

class Stage {
    private stageType: _AT._STAGE_TYPE = randomEnumKey(_AT._STAGE_TYPE)
    public getStageType (): _AT._STAGE_TYPE {
        return this.stageType
    }

    private stageState: _AT._STAGE_STATE

    /**亮度 */
    private light: BasicDataForSLSN
    public setLight ({uuid, val}: {uuid: string, val: number}) {
        this.light.setExtendData({
            uuid,
            val
        })
    }
    public removeLight (uuid: string) {
        this.light.removeExtendData(uuid)
    }

    /**气味 */
    private smell: BasicDataForSLSN
    public setSmell ({uuid, val}: {uuid: string, val: number}) {
        this.smell.setExtendData({
            uuid,
            val
        })
    }
    public removeSmell (uuid: string) {
        this.smell.removeExtendData(uuid)
    }

    /**总噪 */
    private noise: BasicDataForSLSN
    public setNoise ({uuid, val}: {uuid: string, val: number}) {
        this.noise.setExtendData({
            uuid,
            val
        })
    }
    public removeNoise (uuid: string) {
        this.noise.removeExtendData(uuid)
    }

    /**根据光、噪声、气味计算场景调查系数 */
    private getStageCondition () {
        const lightConditionRate = this.light.getConditionRate()
        const smellConditionRate = this.smell.getConditionRate()
        const noiseConditionRate = this.noise.getConditionRate()

        return lightConditionRate * smellConditionRate * noiseConditionRate
    }

    /**根据玩家和场景的属性，计算玩家调查的成果。 */
    private calSearchRes () {
        return randomPlusValue(0, LIMIT.stage.progress.each, LIMIT.stage.progress.eachPercent) * this.getStageCondition()
    }

    /** 场景当前的调查进度 */
    private progress: ProgressForStage
    public addProgress (uuid: string) {
        const val = this.calSearchRes()
        this.progress.plusExtendData({
            uuid,
            val
        })
    }
    public getIfProgressUpgrade () {
        return this.progress.getIfProgressUpgrade()
    }

    private pushToTextBox: TextBox['pushToTextBox'] | undefined
    /**绑定pushToTextBox方法 */
    protected bindPushToTextBox (pushToTextBox: TextBox['pushToTextBox']) {
        this.pushToTextBox = pushToTextBox
    }
    /**写文字（就是pushToTextBox套一层判断而已） */
    protected write (text: string | null) {
        if (text) {
            if (this.pushToTextBox) {
                this.pushToTextBox(text)
            } else {
                console.log('pushToTextBox undefine')
            }
        } else {
            console.log('text is null')
        }
    }
    
    public init (pushToTextBox: TextBox['pushToTextBox']) {
        this.bindPushToTextBox(pushToTextBox)
        console.log('stage write ==>', randomEFA(STAGE_BOX[this.stageType].state[this.stageState]))
        this.write(randomEFA(STAGE_BOX[this.stageType].state[this.stageState]))

        this.light.init({
            pushToTextBox: (x) => {
                pushToTextBox(x)
            },
            initialValue: randomNumber(LIMIT.stage.light.max)
        })

        this.smell.init({
            pushToTextBox: (x) => {
                pushToTextBox(x)
            },
            initialValue: 8
        })

        this.noise.init({
            pushToTextBox: (x) => {
                pushToTextBox(x)
            },
            initialValue: 8
        })

        this.progress.init({
            pushToTextBox: (x) => {
                pushToTextBox(x)
            }
        })
    }

    constructor ( x: {
        stageState: _AT._STAGE_STATE
    } ) {
        this.stageState = x.stageState
    
        this.light = new BasicDataForSLSN({
            stageDataType: _AT._STAGE_DATA.LIGHT,
            totalDataMin: 0,
            totalDataMax: 20,
            stageType: this.stageType
        })
        this.smell = new BasicDataForSLSN({
            stageDataType: _AT._STAGE_DATA.SMELL,
            totalDataMin: 0,
            totalDataMax: 20,
            stageType: this.stageType
        })
        this.noise = new BasicDataForSLSN({
            stageDataType: _AT._STAGE_DATA.NOISE,
            totalDataMin: 0,
            totalDataMax: 20,
            stageType: this.stageType
        })
        this.progress = new ProgressForStage({
            totalDataMin: 0,
            totalDataMax: 80,
            stageType: this.stageType
        })
    }
}

/**玩家或者敌人的道具数据类 */
class ItemArray {
    private userUUID: string
    private itemArray: Array<Item> = []
    public getItemAmount () {
        return this.itemArray.length
    }

    /**获取道具列表里可用的道具功能 */
    public getItemFunc () {
        let res: ReturnType<Item['getFuncArray']> = []
        this.itemArray.forEach((ele) => {
            const temp = ele.getFuncArray()
            if (temp.length > 0) {
                res = res.concat(temp)
            }
        })

        return res
    }

    public addItem (item: Item) {
        this.itemArray.splice(0, 0, item)
        this.itemArray[0].setUserAndState({
            userUUID: this.userUUID,
            state: _AT._ITEM_USE_STATE.ADDED
        })
        this.write(randomEFA(ITEM_BOX[this.itemArray[0].getType()].state[this.itemArray[0].getState()]))
    }

    public removeItem (x: {uuid: string, state: _AT._ITEM_USE_STATE}) {
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === x.uuid
        })
        
        if (index >= 0) {
            const removedItem = this.itemArray.splice(index, 1)[0]
            removedItem.setUserAndState({
                userUUID: this.userUUID,
                state: _AT._ITEM_USE_STATE.REMOVED
            })
            this.write(randomEFA(ITEM_BOX[this.itemArray[0].getType()].state[removedItem.getState()]))
        } else {
            console.log('removeItem faile, can\'t find item')
        }
    }

    public useItem (uuid: Item['uuid'], funcKey: ItemFuncData['key']) {
        const index = this.itemArray.findIndex((ele) => {
            return ele.getUUID() === uuid
        })

        if (index >= 0) {
            this.itemArray[index].use(funcKey)
        } else {
            console.log('useItem faile, can\'t find item')
        }
    }

    private pushToTextBox: TextBox['pushToTextBox'] | undefined
    /**绑定pushToTextBox方法 */
    protected bindPushToTextBox (pushToTextBox: TextBox['pushToTextBox']) {
        this.pushToTextBox = (text: string) => {
            pushToTextBox(text)
        }
    }
    /**写文字（就是pushToTextBox套一层判断而已） */
    protected write (text: string | null) {
        if (text) {
            if (this.pushToTextBox) {
                this.pushToTextBox(text)
            } else {
                console.log('pushToTextBox undefine')
            }
        } else {
            console.log('text is null')
        }
    }

    /**初始化，绑定推送文字、数值初始化等 */
    public init (x: {
        pushToTextBox: TextBox['pushToTextBox']
    }) {
        this.bindPushToTextBox(x.pushToTextBox)
    }

    constructor (x: {
        userUUID: ItemArray['userUUID']
    }) {
        this.userUUID = x.userUUID
    }
}

class HpForPlayer extends BasicDataForHP {
    protected _data: BasicData['_data'] = 0
    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    protected whenDataChange: BasicData['whenDataChange'] = (newVal, curVal) => {
        if (newVal > 0) {
            if (newVal > curVal) {
                this.write(randomEFA(PLAYER_BOX.data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.INCREASE]))
            }
    
            if (newVal < curVal) {
                this.write(randomEFA(PLAYER_BOX.data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.DECREASE]))
            }
        } else {
            this.write(randomEFA(PLAYER_BOX.data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.ZERO]))
        }
    }
    protected die: BasicDataForHP['die']

    public init (x: {
        pushToTextBox: TextBox['pushToTextBox'],
        initialValue: number
    }) {
        this.bindPushToTextBox(x.pushToTextBox)
        this._data = x.initialValue
    }
    
    constructor (x: {
        totalDataMin: BasicDataForHP['totalDataMin'],
        totalDataMax: BasicDataForHP['totalDataMax'],
        die: BasicDataForHP['die']
    }) {
        super()
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
        this.die = x.die
    }
}

class Player {
    private uuid: string = crypto.randomUUID()
    public getUUID () {
        return this.uuid
    }

    private hp: BasicDataForHP
    private atk: number
    private def: number
    private sans: number

    private itemArray: ItemArray
    public getItemFunc () {
        return this.itemArray.getItemFunc()
    }

    /** 获取玩家拥有的物品数量 */
    public getPlayerItemAmount () {
        return this.itemArray.getItemAmount()
    }

    /** 玩家拿起物品 */
    public addItem(item: Item) {
        this.itemArray.addItem(item)
    }

    /**玩家丢掉物品 */
    public removeItem (x: {uuid: Item['uuid'], state: _AT._ITEM_USE_STATE}) {
        this.itemArray.removeItem({
            uuid: x.uuid,
            state: x.state
        })
    }

    /**玩家使用物品 */
    public useItem (uuid: Item['uuid'], funcKey: ItemFuncData['key']) {
        this.itemArray.useItem(uuid, funcKey)
    }

    /**被攻击的处理方法
     * @param x 受到的攻击，包含发出攻击对象的uuid和攻击的val。
    */
    public beAttackedForPlayer (x: {uuid: string, val: number}): void {
        /**敌人攻击减玩家的防御的值 */
        const atkMinusDef = x.val - this.def
        if (atkMinusDef > 0) {
            this.hp.setExtendData({
                uuid: x.uuid,
                val: 0 - atkMinusDef
            })
        }
    }
    /**玩家死亡 */
    private die () {}

    private addProgress: Stage['addProgress']

    private controlBox = {
        [_AT._PLAYER_CONTROL.SEARCH]: {
            key: _AT._PLAYER_CONTROL.SEARCH,
            ...PLAYER_BOX.control[_AT._PLAYER_CONTROL.SEARCH],
            func: () => {
                this.addProgress(this.uuid)
            }
        }
    }
    public getControlBox () {
        const {func: a, ...search} = this.controlBox[_AT._PLAYER_CONTROL.SEARCH]
        let res = [search]
        return res
    }
    public activateControl (key: _AT._PLAYER_CONTROL) {
        console.log('key ===>', key)
        this.controlBox[key].func()
    }

    public init (x: {
        pushToTextBox: TextBox['pushToTextBox'],
        initialValue: Player['hp']['_data']
    }) {
        this.hp.init({
            pushToTextBox: x.pushToTextBox,
            initialValue: x.initialValue
        })

        this.itemArray.init({
            pushToTextBox: x.pushToTextBox
        })
    }

    constructor (x: {
        hp: number,
        atk: Player['atk'],
        def: Player['def'],
        sans: Player['sans'],
        addProgress: Player['addProgress']
    }) {
        this.hp = new HpForPlayer({
            totalDataMin: 0,
            totalDataMax: 20,
            die: this.die
        })
        this.atk = x.atk
        this.def = x.def
        this.sans = x.sans
        this.itemArray = new ItemArray({
            userUUID: this.uuid
        })
        this.addProgress = x.addProgress
    }
}

class EnemyGroup {
    private group: Array<Enemy> = []
    private spawnEnemy (enemy: Enemy) {
        const pushToTextBox = this.pushToTextBox
        if (pushToTextBox) {
            this.group.splice(0, 0, enemy)
            this.group[0].init({
                pushToTextBox: (x) => {
                    pushToTextBox(x)
                },
                initialHp: randomInitialValue(LIMIT.enemy.hp.min, LIMIT.enemy.hp.max, LIMIT.enemy.hp.percent),
                initialNoise: randomInitialValue(LIMIT.enemy.noise.min, LIMIT.enemy.noise.max, LIMIT.enemy.noise.percent),
                initialSmell: randomInitialValue(LIMIT.enemy.smell.min, LIMIT.enemy.smell.max, LIMIT.enemy.smell.percent)
            })
        } else {
            console.log('EnemyGroup\'s pushToTextBox undefined, spawnEnemy fail.')
        }
        
    }

    /** 推送文本的方法 */
    private pushToTextBox: { (str: string): void } | undefined
    /**绑定pushToTextBox方法 */
    protected bindPushToTextBox (pushToTextBox: TextBox['pushToTextBox']) {
        this.pushToTextBox = pushToTextBox
    }
    /** 改变场景气味的方法 */
    private setStageSmell: { (x: {uuid: string, val: number}):void }
    /** 改变场景噪声的方法 */
    private setStageNoise: { (x: {uuid: string, val: number}):void }
    /**玩家被攻击的处理方法 */
    private beAttackedForPlayer: {(x: {uuid: string, val: number}): void}

    private _enemyRate = randomInitialValue(LIMIT.enemy.rate.min, LIMIT.enemy.rate.max, LIMIT.enemy.rate.percent)
    /** 当该值变化时，检查该值是否达到生成敌人的临界点，如果达到且敌人数量未达到上限，生成敌人并加入。 */
    private set enemyRate (val: number) {
        this._enemyRate = val
        if (this._enemyRate >= LIMIT.enemy.rate.max && this.group.length < LIMIT.enemy.amount.max) {
            this.spawnEnemy(new Enemy({
                setStageSmell: this.setStageSmell,
                setStageNoise: this.setStageNoise,
                beAttackedForPlayer: this.beAttackedForPlayer
            }))
        }
    }
    private get enemyRate () {
        return this._enemyRate
    }
    public addEnemyRate (v: number) {
        if (v <= LIMIT.enemy.rate.max) {
            this.enemyRate += v
            return true
        } else {
            return false
        }
    }

    /**检查是否有被攻击的对象 */
    public getIfHaveEnemy () {
        return this.group.length > 0
    }

    /**被攻击（暂时是随机选择攻击目标） */
    public beAttacked (x: {uuid: string, val: number}) {
        const randomEnemy = randomEFA(this.group)
        if (randomEnemy) {
            randomEnemy.beAttacked(x)
        } else {
            console.log('no enemy, attack fail')
        }
    }
    
    /**随机敌人攻击 */
    private randomAttackPlayer () {
        this.group[randomNumber(this.group.length - 1)].attackPlayer()
    }

    /** 随机敌人放屁 */
    private addRandomSmell () {
        this.group[randomNumber(this.group.length - 1)].addRandomSmell()
    }

    /** 随机敌人唱歌 */
    private setRandomNoise () {
        this.group[randomNumber(this.group.length - 1)].setRandomNoise()
    }

    /** 敌人的随机行动 */
    public randomAction () {
        if (this.group.length >= 1) {
            switch (randomNumber(3)) {
                case 0:
                    this.randomAttackPlayer()
                    break
                case 1:
                    this.addRandomSmell()
                    break
                case 2:
                    this.setRandomNoise()
                    break
                case 3:
                    this.addEnemyRate(randomPlusValue(LIMIT.enemy.rate.min, LIMIT.enemy.rate.max, LIMIT.enemy.rate.eachPercent))
                    break
                default:
                    this.randomAttackPlayer()
                    break
            }
        } else {
            this.addEnemyRate(10)
        }
    }

    public init (x:{pushToTextBox: EnemyGroup['pushToTextBox']}) {
        this.pushToTextBox = x.pushToTextBox
    }

    constructor (x: {
        pushToTextBox: EnemyGroup['pushToTextBox'],
        setStageSmell: EnemyGroup['setStageSmell'],
        setStageNoise: EnemyGroup['setStageNoise'],
        beAttackedForPlayer: EnemyGroup['beAttackedForPlayer']
    }) {
        this.pushToTextBox = x.pushToTextBox
        this.setStageSmell = x.setStageSmell
        this.setStageNoise = x.setStageNoise
        this.beAttackedForPlayer = x.beAttackedForPlayer
    }
}


class HpForEnemy extends BasicDataForHP {
    private enemyType: Enemy['enemyType']
    protected _data: BasicData['_data'] = 0
    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    protected whenDataChange: BasicData['whenDataChange'] = (newVal, curVal) => {
        if (newVal > 0) {
            if (newVal > curVal) {
                this.write(randomEFA(ENEMY_BOX[this.enemyType].data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.INCREASE]))
            }
    
            if (newVal < curVal) {
                this.write(randomEFA(ENEMY_BOX[this.enemyType].data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.DECREASE]))
            }
        } else {
            this.write(randomEFA(ENEMY_BOX[this.enemyType].data[_AT._PLAYER_DATA.HP][_AT._DATA_STATE.ZERO]))
        }
    }
    protected die: BasicDataForHP['die']
    
    constructor (x: {
        enemyType: HpForEnemy['enemyType'],
        totalDataMin: BasicDataForHP['totalDataMin'],
        totalDataMax: BasicDataForHP['totalDataMax'],
        die: BasicDataForHP['die']
    }) {
        super()
        this.enemyType = x.enemyType
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
        this.die = x.die
    }
}

/**BasicDataForEnemyNoise&Smell 敌人的噪声、气味属性专用的基础属性 */
class BasicDataForENS extends BasicData {
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
                this.write(randomEFA(sample[_AT._DATA_STATE.INCREASE]))
            }
    
            if (newVal < curVal) {
                this.write(randomEFA(sample[_AT._DATA_STATE.DECREASE]))
            }
        } else {
            this.write(randomEFA(sample[_AT._DATA_STATE.ZERO]))
        }
    }

    constructor (x: {
        enemyType: BasicDataForENS['enemyType'],
        enemyDataType: BasicDataForENS['enemyDataType'],
        enemyUUID: string,
        totalDataMin: BasicDataForENS['totalDataMin'],
        totalDataMax: BasicDataForENS['totalDataMax'],
    }) {
        super()
        this.enemyType = x.enemyType
        this.enemyDataType = x.enemyDataType
        this.enemyUUID = x.enemyUUID
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
    }
}

class Enemy {
    private readonly uuid: string = crypto.randomUUID()
    private readonly enemyType: _AT._ENEMY_TYPE = randomEnumKey(_AT._ENEMY_TYPE)

    private readonly atk: number = randomInitialValue(LIMIT.enemy.atk.min, LIMIT.enemy.atk.max, LIMIT.enemy.atk.percent)
    /**来自Player类的，接收一个攻击数值，计算要减少的hp。该方法在construct里赋值正式方法内容。 */
    private beAttackedForPlayer: {(x: {uuid: string, val: number}): void}
    public attackPlayer () {
        this.beAttackedForPlayer({
            uuid: this.uuid,
            val: this.atk
        })
    }
    private readonly def: number = randomInitialValue(LIMIT.enemy.def.min, LIMIT.enemy.def.max, LIMIT.enemy.def.percent)

    private hp: HpForEnemy
    private noise: BasicDataForENS
    /**敌人发出随机噪音（该值为直接赋值）*/
    public setRandomNoise () {
        this.noise.setExtendData({
            uuid: this.uuid,
            val: randomInitialValue(LIMIT.enemy.noise.min, LIMIT.enemy.noise.max, LIMIT.enemy.noise.percent)
        })
    }
    private smell: BasicDataForENS
    /**敌人散发随机气味（该值为累计赋值）*/
    public addRandomSmell () {
        this.smell.plusExtendData({
            uuid: this.uuid,
            val: randomPlusValue(LIMIT.enemy.smell.min, LIMIT.enemy.smell.max, LIMIT.enemy.smell.eachPercent)
        })
    }

    /**被攻击的处理方法
     * @param x 受到的攻击，包含发出攻击对象的uuid和攻击的val。
    */
    public beAttacked (x: {uuid: string, val: number}): void {
        /**被攻击时，受到的攻击力减防御的值 */
        const atkMinusDef = x.val - this.def
        if (atkMinusDef > 0) {
            this.hp.setExtendData({
                uuid: x.uuid,
                val: 0 - atkMinusDef
            })
        }
    }

    /**敌人死亡 */
    private die () {
        this.noise.removeExtendData(this.uuid)
    }

    /**推送文字的方法 */
    private pushToTextBox: TextBox['pushToTextBox'] | undefined
    /**绑定pushToTextBox方法 */
    private bindPushToTextBox (pushToTextBox: TextBox['pushToTextBox']) {
        this.pushToTextBox = pushToTextBox
    }
    /**写文字（就是pushToTextBox套一层判断而已） */
    private write (text: string) {
        if (this.pushToTextBox) {
            this.pushToTextBox(text)
        } else {
            console.log('pushToTextBox undefine')
        }
    }

    public init (x: {
        pushToTextBox: TextBox['pushToTextBox'],
        initialHp: number,
        initialNoise: number,
        initialSmell: number
    }) {
        this.hp.init({
            pushToTextBox: (text) => {
                x.pushToTextBox(text)
            },
            initialValue: x.initialHp
        })

        this.noise.init({
            pushToTextBox: (text) => {
                x.pushToTextBox(text)
            },
            initialValue: x.initialNoise
        })

        this.smell.init({
            pushToTextBox: (text) => {
                x.pushToTextBox(text)
            },
            initialValue: x.initialSmell
        })

        this.bindPushToTextBox((text) => {
            x.pushToTextBox(text)
        })
    }

    constructor (x: {
        setStageNoise: Stage['setNoise'],
        setStageSmell: Stage['setSmell'],
        beAttackedForPlayer: Enemy['beAttackedForPlayer']
    }) {
        this.beAttackedForPlayer = x.beAttackedForPlayer
        this.hp = new HpForEnemy({
            enemyType: this.enemyType,
            totalDataMin: LIMIT.enemy.hp.min,
            totalDataMax: LIMIT.enemy.hp.max,
            die: () => {
                this.die()
            }
        })

        const paramsForNoiseAndSmell = {
            enemyType: this.enemyType,
            enemyUUID: this.uuid
        }

        this.noise = new BasicDataForENS({
            ...paramsForNoiseAndSmell,
            totalDataMin: LIMIT.enemy.noise.min,
            totalDataMax: LIMIT.enemy.noise.max,
            enemyDataType: _AT._ENEMY_DATA.NOISE
        })
        this.smell = new BasicDataForENS({
            ...paramsForNoiseAndSmell,
            totalDataMin: LIMIT.enemy.smell.min,
            totalDataMax: LIMIT.enemy.smell.max,
            enemyDataType: _AT._ENEMY_DATA.SMELL
        })
    }
}

/**道具里某项功能的基本信息的结构 */
interface ItemFuncData {
    /**道具的id */
    uuid: Item['uuid'],
    /**道具的功能类型 */
    type: _AT._ITEM_FUNC_TYPE,
    /**道具里某项功能的key */
    key: number,
    /**道具里某项功能的名称 */
    name: string,
    /**道具里某项功能的简介 */
    intro: string,
    /**道具里某项功能触发后的文字描述 */
    describe: string
}

/**道具里某项功能的基本信息加上实际功能function的结构 */
interface ItemFuncDataWithFunc extends ItemFuncData {
    /**道具的某项功能 */
    func: (x?: any) => void
}

abstract class Item {
    /**物品的种类 */
    protected abstract type: _AT._ITEM_TYPE
    public getType () {
        return this.type
    }
    /**用户的uuid */
    protected abstract userUUID: string | undefined

    /**物品的状态 */
    protected state: _AT._ITEM_USE_STATE = _AT._ITEM_USE_STATE.NEW
    /**同时设置道具的使用者和道具的状态 */
    public setUserAndState (x: {
        userUUID: Item['userUUID'],
        state: Item['state']
    }) {
        this.userUUID = this.userUUID
        this.state = x.state
    }
    public getState () {
        return this.state
    }
    /**道具的uuid */
    protected uuid: string = crypto.randomUUID()
    public getUUID () {
        return this.uuid
    }

    /**道具耐久度 */
    protected abstract _dur: number
    protected set dur (x: Item['_dur']) {
        const newVal = x
        const curVal = this._dur
        this._dur = newVal
        if (newVal <= 0) {
            this.removeItself({
                uuid: this.uuid,
                state: _AT._ITEM_USE_STATE.USED
            })
        }
        this.whenDurChange(newVal, curVal)
    }
    protected get dur () {
        return this._dur
    }
    /**道具功能合集 */
    protected abstract funcBox: {
        [index: number]: ItemFuncDataWithFunc
    }
    /**使用道具的某个功能 */
    public use (funcKey: number ) {
        this.funcBox[funcKey].func()
    }
    /**获取可用道具功能合集 */
    public abstract getFuncArray: () => Array<ItemFuncData>
    /**ItemArray删除道具的功能，删除道具的相关文字提示在ItemArray类里执行，因为道具的移除以在ItemArray里去除为准。 */
    protected abstract removeItself: ItemArray['removeItem']
    /**推送文字的方法 */
    private pushToTextBox: TextBox['pushToTextBox'] | undefined
    /**绑定pushToTextBox方法 */
    protected bindPushToTextBox (pushToTextBox: TextBox['pushToTextBox']) {
        this.pushToTextBox = pushToTextBox
    }
    /**写文字（就是pushToTextBox套一层判断而已） */
    protected write (text: string) {
        if (this.pushToTextBox) {
            this.pushToTextBox(text)
        } else {
            console.log('pushToTextBox undefine')
        }
    }
    /**其他可能需要在dur变化时触发的脚本写在这里面 */
    protected abstract whenDurChange: (newVal: Item['_dur'], curVal: Item['_dur']) => void

    public init (x: {
        pushToTextBox: TextBox['pushToTextBox']
    }) {
        this.bindPushToTextBox(x.pushToTextBox)
    }
}

class Flashlight extends Item {
    protected type: Item['type'] = _AT._ITEM_TYPE.FLASHLIGHT
    protected _dur: Item['_dur'] = 5
    protected whenDurChange: Item['whenDurChange'] = (newVal: Item['_dur'], curVal: Item['_dur']) => {}
    private ifOn: boolean = false

    /**在手电打开的情况下每回合 */
    public reduceDurPerRound () {
        if (this.ifOn) {
            this.dur = this.dur - 1
        }
    }
    private setStageLight: Stage['setLight']
    private removeStageLight: Stage['removeLight']

    protected funcBox: Item['funcBox'] = {
        [_AT._FLASHLIGHT_FUNC.ON]: {
            uuid: this.uuid,
            key: _AT._FLASHLIGHT_FUNC.ON,
            ...ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.ON],
            func: () => {
                this.write(ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.ON].describe)
                this.setStageLight({
                    uuid: this.uuid,
                    val: 6
                })
                this.ifOn = true
            }
        },
        [_AT._FLASHLIGHT_FUNC.OFF]: {
            uuid: this.uuid,
            key: _AT._FLASHLIGHT_FUNC.OFF,
            ...ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.OFF],
            func: () => {
                this.write(ITEM_BOX[this.type].func[_AT._FLASHLIGHT_FUNC.OFF].describe)
                this.removeStageLight(this.uuid)
                this.ifOn = false
            }
        }
    }
    public getFuncArray: Item['getFuncArray'] = () => {
        let res: Array<ItemFuncData> = []

        const {func: a, ...on} = this.funcBox[_AT._FLASHLIGHT_FUNC.ON]
        const {func: b, ...off} = this.funcBox[_AT._FLASHLIGHT_FUNC.OFF]

        if (this.state === _AT._ITEM_USE_STATE.ADDED) {
            this.ifOn ? res.splice(0, 0, off) : res.splice(0, 0, on)
        }

        return res
    }

    protected userUUID: Item['userUUID']
    protected removeItself: Item['removeItself']

    constructor (x: {
        setStageLight: Flashlight['setStageLight'],
        removeStageLight: Flashlight['removeStageLight'],
        removeItself: Flashlight['removeItself']
    }) {
        super()
        this.setStageLight = x.setStageLight
        this.removeStageLight = x.removeStageLight
        this.removeItself = x.removeItself
    }
}

class Sword extends Item {
    protected type: Item['type'] = _AT._ITEM_TYPE.SWORD
    protected userUUID: Item['userUUID']
    private atk: number = 6

    private getIfHaveEnemy: EnemyGroup['getIfHaveEnemy']
    private beAttackedForEnemy: EnemyGroup['beAttacked']
    
    protected removeItself: Item['removeItself']
    protected whenDurChange: Item['whenDurChange'] = () => {}
    protected _dur: Item['_dur'] = 6
    protected funcBox: Item['funcBox'] = {
        [_AT._SWORD_FUNC.ATTACK]: {
            uuid: this.uuid,
            key: _AT._SWORD_FUNC.ATTACK,
            ...ITEM_BOX[this.type].func[_AT._SWORD_FUNC.ATTACK],
            func: (val: Player['atk']) => {
                if (this.userUUID && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0) {
                    this.write(ITEM_BOX[this.type].func[_AT._SWORD_FUNC.ATTACK].describe)
                    this.beAttackedForEnemy ({
                        uuid: this.userUUID,
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

        if (this.userUUID && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0 && this.getIfHaveEnemy()) {
            res.splice(0, 0, attack)
        }

        return res
    }

    constructor (x: {
        getIfHaveEnemy: Sword['getIfHaveEnemy']
        beAttackedForEnemy: Sword['beAttackedForEnemy'],
        removeItself: Sword['removeItself']
    }) {
        super()
        this.getIfHaveEnemy = x.getIfHaveEnemy
        this.beAttackedForEnemy = x.beAttackedForEnemy
        this.removeItself = x.removeItself
    }
}

class Gun extends Item {
    protected type: Item['type'] = _AT._ITEM_TYPE.GUN
    protected userUUID: Item['userUUID']
    private atk: number = 20
    private getIfHaveEnemy: EnemyGroup['getIfHaveEnemy']
    private beAttackedForEnemy: Enemy['beAttacked']
    protected removeItself: Item['removeItself']
    protected whenDurChange: Item['whenDurChange'] = () => {}
    protected _dur: Item['_dur'] = 0
    protected funcBox: Item['funcBox'] = {
        [_AT._GUN_FUNC.SHOOT]: {
            uuid: this.uuid,
            key: _AT._GUN_FUNC.SHOOT,
            ...ITEM_BOX[this.type].func[_AT._GUN_FUNC.SHOOT],
            func: () => {
                if (this.userUUID && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0) {
                    this.write(ITEM_BOX[this.type].func[_AT._GUN_FUNC.SHOOT].describe)
                    this.beAttackedForEnemy ({
                        uuid: this.userUUID,
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

        if (this.userUUID && this.state === _AT._ITEM_USE_STATE.ADDED && this.dur > 0 && this.getIfHaveEnemy()) {
            res.splice(0, 0, shoot)
        }

        return res
    }

    constructor (x: {
        getIfHaveEnemy: Gun['getIfHaveEnemy'],
        beAttackedForEnemy: Gun['beAttackedForEnemy'],
        removeItself: Gun['removeItself'],
    }) {
        super()
        this.getIfHaveEnemy = x.getIfHaveEnemy
        this.beAttackedForEnemy = x.beAttackedForEnemy
        this.removeItself = x.removeItself
    }
}

export class Playground { // 包含整个游戏所有内容的总控制
    private playerData: {
        hp: Player['hp']['_data'],
        atk: Player['atk'],
        def: Player['def'],
        sans: Player['sans']
    }
    private player: Player

    private enemyGroup: EnemyGroup
    private stageNumber: number = 0
    private stageLength: number = 4

    private stage: Stage

    /** 游戏内自动推进的脚本 */
    public autoRun () {
        console.log('autoRun')
        if (this.enemyGroup) {
            this.enemyGroup.randomAction()
        }
    }

    private itemCreator (type: _AT._ITEM_TYPE): Item {
        let res: Item
        switch (type) {
            case _AT._ITEM_TYPE.FLASHLIGHT: {
                res = new Flashlight({
                    setStageLight: (x) => {
                        this.stage.setLight(x)
                    },
                    removeStageLight: (x) => {
                        this.stage.removeLight(x)
                    },
                    removeItself: (x) => {
                        this.player.removeItem(x)
                    }
                })
                break
            }
            case _AT._ITEM_TYPE.SWORD: {
                res = new Sword({
                    getIfHaveEnemy: () => {
                        return this.enemyGroup.getIfHaveEnemy()
                    },
                    beAttackedForEnemy: (x) => {
                        this.enemyGroup.beAttacked(x)
                    },
                    removeItself: (x) => {
                        this.player.removeItem(x)
                    }
                })
                break
            }
            case _AT._ITEM_TYPE.GUN: {
                res = new Gun({
                    getIfHaveEnemy: () => {
                        return this.enemyGroup.getIfHaveEnemy()
                    },
                    beAttackedForEnemy: (x) => {
                        this.enemyGroup.beAttacked(x)
                    },
                    removeItself: (x) => {
                        this.player.removeItem(x)
                    }
                })
                break
            }
        }

        res.init({
            pushToTextBox: (x) => {
                this.textBox.pushToTextBox(x)
            }
        })

        return res
    }

    /** 模拟生成随机道具并被玩家获取 */
    private addRandomItemToPlayer () {
        const itemType: _AT._ITEM_TYPE = randomEnumKey(_AT._ITEM_TYPE)
        let item: Item = this.itemCreator(itemType)
        this.player.addItem(item)
    }

    /**获取玩家的道具所有可用操作，分成道具使用类和攻击与调查类 */
    private getPlayerItemControl () {
        let res: {
            [_AT._ITEM_FUNC_TYPE.A]: Array<ItemFuncData>,
            [_AT._ITEM_FUNC_TYPE.B]: Array<ItemFuncData>
        } = {
            [_AT._ITEM_FUNC_TYPE.A]: [],
            [_AT._ITEM_FUNC_TYPE.B]: []
        }
        const itemControl = this.player.getItemFunc()
        itemControl.forEach((ele) => {
            if (ele.type === _AT._ITEM_FUNC_TYPE.A) {
                res[_AT._ITEM_FUNC_TYPE.A].splice(0, 0, ele)
            }
            if (ele.type === _AT._ITEM_FUNC_TYPE.B) {
                res[_AT._ITEM_FUNC_TYPE.B].splice(0, 0, ele)
            }
        })

        return res
    }

    /**获取玩家的所有可用操作 */
    public getPlayerControl () {
        let res = {
            playerControl: this.player.getControlBox(),
            itemControl: this.getPlayerItemControl()
        }

        return res
    }

    /**触发玩家的操作 */
    public activatePlayerControl (x: {uuid?: Item['uuid'], key: ItemFuncData['key'] |  _AT._PLAYER_CONTROL}) {
        if (x.uuid) {
            this.player.useItem(x.uuid, x.key)
        } else {
            this.player.activateControl(x.key)
            this.round += 1
        }
    }

    private _round: number = 0
    private set round (x: number) {
        console.log('round ===>', x)
        this._round = x
        this.addRandomItemToPlayer()
    }
    private get round () {
        return this._round
    }

    private textBox = new TextBox()
    public getTextList () {
        return this.textBox.getTextBox()
    }

    public init () {
        this.player.init({
            pushToTextBox: (text) => {
                this.textBox.pushToTextBox(text)
            },
            initialValue: this.playerData.hp
        })

        this.stage.init((text) => {
            this.textBox.pushToTextBox(text)
        })

        this.enemyGroup.init({
            pushToTextBox: (text) => {
                this.textBox.pushToTextBox(text)
            }
        })
    }

    constructor(x: {
        hp: Player['hp']['_data'],
        atk: Player['atk'],
        def: Player['def'],
        sans: Player['sans']
    }) {
        this.playerData = x
        this.player = new Player({
            ...x,
            addProgress: (x) => {
                this.stage.addProgress(x)
            }
        })

        this.stage = new Stage({
            stageState: _AT._STAGE_STATE.START
        })

        this.enemyGroup = new EnemyGroup({
            pushToTextBox: (x) => {
                this.textBox.pushToTextBox(x)
            },
            setStageNoise: (x) => {
                this.stage.setNoise(x)
            },
            setStageSmell: (x) => {
                this.stage.setSmell(x)
            },
            beAttackedForPlayer: (x) => {
                this.enemyGroup.beAttacked(x)
            }
        })
    }
}