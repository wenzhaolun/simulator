type StageType = 'room' | 'dungeon' | 'church' | 'tomb' | 'tunnel' | 'garden' | 'valut' // 关卡类型
type StageDataLevel = 'a' | 'b' | 'c' | 'd'
type DetectType = 'candle' | 'circle'
type DetectState = 'start' | 'halfway' | 'end'

/** 根据最大值，随机获取0-最大值的整数。 */
function randomNumber(max: number){
    return Math.round(Math.random() * max)
}

/** randomStringFromArray，根据string数组，随机抽取string。 */
function randomSFA (array: Array<string>): string {
    return array[randomNumber(array.length - 1)]
}

/** 由于在vue3框架下（2022-08-29），object内部包含的其他object如果使用proxy传递变量的变化，相应的变量变化时，不能触发更新。所以只能用直接读取的传递方式。
 * 但是直接读变量这种方式无法做到各个object的textArray变量实现排序。
 * 所以需要这么一个统一使用的文本ID生成器，用于各个Object的文本在最后统一收集时排列顺序。 */
export class IDCreator {
    id: number = 0

    getId () {
        const res = this.id
        this.id += 1
        return res
    }
}

export class Stage {
    private ifNew: boolean = true
    private idCreator: IDCreator
    public getIfNew (): boolean {
        return this.ifNew
    }
    public offIfNew () {
        this.ifNew = false
    }
    /** 场景总量 */
    private _stageLength: number = 0
    private set stageLength (val: number) {
        this._stageLength = val
    }
    private get stageLength () {
        return this._stageLength
    }

    /** 设置场景总数量，确保总数量不能为0 */
    public setStageLength (val: number): boolean {
        if (val > 0) {
            this.stageLength = val
            return true
        } else {
            return false
        }
    }

    /** 当前场景号 */
    private _stageNum: number = 0
    private set stageNum (val: number) {
        this._stageNum = val
    }
    private get stageNum () {
        return this._stageNum
    }

    /** 设定场景号前，要确保场景号不会大于场景总量且场景总量不为0 */
    public setStageNum (val: number): boolean {
        if (this.stageLength > 0 && this.stageNum <= this.stageLength ) {
            this.stageNum = val
            return true
        } else {
            return false
        }
    }

    /** 调查完场景所需的总进度 */
    private fullProgress = 80
    /** 调查场景的类型 */
    private detectTypeArray: Array<DetectType> = ['candle', 'circle']
    private detectType: DetectType

    /** 场景单独的文字描述 */
    private textArray: Array<{id: number, text: string}> = []
    private pushToTextArray (text: string) {
        this.textArray.push({
            id: this.idCreator.getId(),
            text
        })
    }
    public getTextArray () {
        return this.textArray
    }


    /** 调查场景的文字 */
    private detectText = {
        candle: {
            start: [
                `你发现${this.getStageName()}的中间摆放着一张破旧的桌子，桌子上似乎放着一根蜡烛。`,
                `你发现似乎有一张破旧的桌子被放在${this.getStageName()}的角落，上面好像有一根蜡烛。`
            ],
            halfway: ['你发现这根蜡烛里面还有一些东西', '你发现了桌子上还有另一支相似的却小很多的蜡烛'],
            end: ['你掰开了蜡烛，找到了藏在里面的钥匙。', '你把蜡烛放在桌子中间，并试着读出了蜡烛上的文字。'],
            continue: ['你对蜡烛上的味道有似曾相识的感觉', '你似乎看懂了蜡烛上的文字', '你想起了一些恐怖的回忆', '你发现桌子上的痕迹很可疑'],
            findItem: []
        },
        circle: {
            start: [
                `你发现${this.getStageName()}的地上画着一个巨大的法阵，法阵的中间漆黑一片，像是一个无底深渊。`,
                `你在${this.getStageName()}的天花板找到了一个法阵，像是用某些粘稠的油漆涂画而成，好像随时都会有一部分会滴下来。`
            ],
            halfway: ['你读懂了法阵的文字，法阵发出轻微的亮光。', '你发现法阵上的一个符文很像你曾经在书上看到过的怪物印记。'],
            end: ['你破解了法阵。', '法阵消失了。'],
            continue: ['你在这个法阵上找到了新的线索', '你似乎想起一个和法阵类似的图案'],
            findItem: []
        },
    }

    /** 场景当前的调查进度 */
    private _progress = 0
    private set progress (val: number) {
        const newVal = val
        const oldVal = this._progress

        
        if (oldVal === 0) {
            this.pushToTextArray(randomSFA(this.detectText[this.detectType].start))
        } else {
            let newLevel: DetectState
            switch (true) { // 根据总数值计算级别
                case newVal <= this.fullProgress / 2:
                    newLevel = 'start'
                    break
                case newVal < this.fullProgress:
                    newLevel = 'halfway'
                    break
                case newVal >= this.fullProgress:
                    newLevel = 'end'
                    break
                default:
                    newLevel = 'start'
                    break
            }

            let oldLevel: DetectState
            switch (true) { // 根据总数值计算级别
                case oldVal <= this.fullProgress / 2:
                    oldLevel = 'start'
                    break
                case oldVal < this.fullProgress:
                    oldLevel = 'halfway'
                    break
                case oldVal >= this.fullProgress:
                    oldLevel = 'end'
                    break
                default:
                    oldLevel = 'start'
                    break
            }

            if (newLevel === oldLevel) {
                if (randomNumber(1) >= 0.7) { // 模拟随机判断是否找到道具
                    const index = randomNumber(this.detectText[this.detectType].findItem.length - 1) // 随机找到什么道具，index是对应道具在数组中的排序。

                    
                }
                this.pushToTextArray(randomSFA(this.detectText[this.detectType].continue))
            }else {
                this.pushToTextArray(randomSFA(this.detectText[this.detectType][newLevel]))
            }
        }

        this._progress = val
        console.log('msg from last ===>', this._progress)
    }
    private get progress () {
        return this._progress
    }
    
    public addProgress (x: number) {
        this.progress += x
    }

    /** 场景亮度 */
    private _light: number
    private set light (val: number) {
        this._light = val
    }
    private get light () {
        return this._light
    }

    /** 增加场景亮度,并确定增加后不超过限制也不小于0 */
    public addLight (val: number) {
        this.light += val
    }

    public getLight () {
        return this.light
    }

    private smell: number
    public getSmell () {
        return this.smell
    }

    private noise: number
    public getNoise () {
        return this.noise
    }

    private stageDataLimit = {
        light: 20,
        smell: 20,
        noise: 20
    }

    private stageTypeArray: Array<StageType> = ['room', 'dungeon', 'church', 'tomb', 'tunnel', 'garden', 'valut']
    private stageType: StageType
    public getStageName () {
        switch (true) {
            case this.stageType === 'room':
                return '房间'
            case this.stageType === 'dungeon':
                return '地牢'
            case this.stageType === 'church':
                return '教堂'
            case this.stageType === 'tomb':
                return '墓穴'
            case this.stageType === 'tunnel':
                return '地下通道'
            case this.stageType === 'garden':
                return '花园'
            case this.stageType === 'valut':
                return '地下室'
            default:
                return '房间'
        }
    }

    getType () {
        return this.stageType
    }

    constructor(stageNum: number, stageLength: number, idC: IDCreator) {
        this.idCreator = new Proxy(idC, {})

        this._light = randomNumber(this.stageDataLimit.light * 0.6) + this.stageDataLimit.light * 0.4,
        this.smell = randomNumber(this.stageDataLimit.smell * 0.4),
        this.noise = randomNumber(this.stageDataLimit.noise * 0.4)

        this.stageNum = stageNum
        this.stageLength = stageLength

        this.stageType = this.stageTypeArray[randomNumber(this.stageTypeArray.length - 1)]
        this.detectType = this.detectTypeArray[randomNumber(this.detectTypeArray.length - 1)]
    }
}

export class User {
    private strength: number
    private agility: number
    private intelligence: number
    private sans: number
    private light: number
    private smell: number
    private itemArray: Array<Item> = []

    getLight () {
        return this.light
    }

    getSmell () {
        return this.smell
    }

    pickItem(x: Item) {
        this.itemArray = this.itemArray.concat(x)
    }
    // dropItem(x: Item) {
    //     const id = x.data.id
    //     const index = this.itemArray.findIndex((ele) => {
    //         ele.data.id === id
    //     })
    //     if (index >= 0) {
    //         this.itemArray.splice(index, 1)
    //     }
    // }
    useItem(x: string) {
        const uuid = x
    }
    constructor(str: number, agi: number, int: number, sans: number, light: number, smell: number, itemArray: Array<Item>) {
        this.strength = str
        this.agility = agi
        this.intelligence = int
        this.sans = sans
        this.light = light
        this.smell = smell
        this.itemArray = itemArray.concat(this.itemArray)
    }
}

interface EnemyData {
    atk: number,
    def: number,
    hp: number,
    noise: number,
    smell: number
}

export class EnemyGroup {
    private idCreator: IDCreator
    private group: Array<Enemy>
    private enemyMax: number = 1

    /** 生成敌人的临界值 */
    private enemyBound: number = 10

    private _enemyRate = 0
    /** 当该值变化时，检查该值是否达到生成敌人的临界点，如果达到且敌人数量未达到上限，生成敌人并加入。 */
    private set enemyRate (val: number) {
        this._enemyRate = val
        if (this._enemyRate >= this.enemyBound && this.group.length < this.enemyMax) {
            console.log('msg before new Enemy ===>', val)
            this.spawnEnemy(new Enemy(this.idCreator))
        }
    }
    private get enemyRate () {
        return this._enemyRate
    }

    public getTextArray () {
        let res: Array<{id: number, text: string}> = []
        this.group.forEach((ele) => [
            res = res.concat(ele.getTextArray())
        ])
        return res
    }


    addEnemyRate (v: number) {
        if (v <= this.enemyBound) {
            this.enemyRate += v
            return true
        } else {
            return false
        }
    }

    getSmell () {
        let smell = 0
        for (const ele of this.group) {
            smell += ele.getSmell()
        }
        return smell
    }

    getNoise () {
        let noise = 0
        for (const ele of this.group) {
            noise += ele.getNoise()
        }
        return noise
    }

    getEnemyAmount (): number {
        return this.group.length
    }

    spawnEnemy (enemy: Enemy) {
        this.group.push(enemy)
    }

    /** 随机敌人攻击 */
    private attack () {
        return this.group[randomNumber(this.group.length - 1)].attack()
    }

    /** 随机敌人放屁 */
    private addSmell () {
        return this.group[randomNumber(this.group.length - 1)].addSmell()
    }

    /** 随机敌人唱歌 */
    private addNoise () {
        return this.group[randomNumber(this.group.length - 1)].addNoise()
    }

    /** 敌人的随机行动 */
    public randomAction () {
        if (this.group.length >= 1) {
            switch (randomNumber(3)) {
                case 0:
                    this.attack()
                    break
                case 1:
                    this.addSmell()
                    break
                case 2:
                    this.addNoise()
                    break
                case 3:
                    this.addEnemyRate(randomNumber(this.enemyBound * 0.2))
                    break
                default:
                    this.attack()
                    break
            }
        } else {
            this.addEnemyRate(10)
        }
    }

    constructor (idC: IDCreator) {
        this.idCreator = new Proxy(idC, {})
        this.group = []
        this.enemyRate = Math.random() * this.enemyBound * 0.8 + this.enemyBound * 0.2
    }
}

export class Enemy {
    private idCreator: IDCreator
    private name: string
    private nameList: Array<string> = ['全身都是眼睛的人形怪物', '由狗头混成一团的肉泥', '怪异的黑色碟状物', '巨大的蓝色触手']
    /** 判断对象是否是新建的
     * @true 代表是新建
     */
    private ifNew: boolean = true

    private atk: number
    private def: number

    /** 敌人变化的独有文字描述 */
    private textArray: Array<{id: number, text: string}> = []
    private pushToTextArray (text: string) {
        this.textArray.push({
            id: this.idCreator.getId(),
            text
        })
    }
    public getTextArray () {
        return this.textArray
    }


    private _hp: number = 0
    private set hp (val: number) {
        console.log('msg from set hp')
        if (this.ifNew) {
            const textArray = [`一${this.name}突然从地面冒出，`, `一${this.name}从一堆腐肉中爬出，`, `一${this.name}突然凭空出现，`]
            this.pushToTextArray(randomSFA(textArray))
        } else {
            if (val > this._hp) {
                this.pushToTextArray(this.name + '变得更活跃了')
            }
            if(val === this._hp) {
                this.pushToTextArray(this.name + '似乎没有任何感觉')
            }
            if (val < this._hp) {
                const textArray = [`${this.name}受到损伤了`, `攻击似乎对${this.name}有效`, `一些腐坏的组织从${this.name}身上掉了下来`, `${this.name}的伤口出渗出奇怪的液体`]
                this.pushToTextArray(randomSFA(textArray))
            }
            if (val <= 0) {
                const textArray = [`${this.name}炸开了，到处都是碎块。`, `${this.name}倒在了地上，似乎不能动了。`, `${this.name}突然消失不见了。`, `${this.name}发出惨叫，并化成了一团烟雾。`]
                this.pushToTextArray(randomSFA(textArray))
            }
        }
        this._hp = val
    }
    private get hp () {
        return this._hp
    }


    private _noise: number = 0
    private set noise (val: number) {
        console.log('msg from set noise')
        if (this.ifNew) {
            const textArray = [`${this.name}似乎在发出古怪的声音`, `${this.name}不断传来凄惨的哀嚎声`, `${this.name}奇怪而又刺耳的尖叫声向你袭来`]
            this.pushToTextArray(randomSFA(textArray))
        } else {
            if (val > this._noise) {
                const textArray = [`${this.name}发出诡异的笑声。`, `${this.name}发出恐怖的嚎叫。`, `从${this.name}的方向传来刺耳的电波声。`, `${this.name}发出惨叫。`]
                this.pushToTextArray(randomSFA(textArray))
            }
        }
        this._noise = val
    }
    private get noise () {
        return this._noise
    }


    private _smell: number = 0
    private set smell (val: number) {
        console.log('msg from set smell')
        if (this.ifNew) {
            const textArray = [`同时${this.name}还传来一阵阵恶臭`, '并且伴随着一股诡异的味道。', '怪异的腥味也随之而来']
            this.pushToTextArray(randomSFA(textArray))
        } else {
            if (val > this._smell) {
                const textArray = [`${this.name}向你呕吐了一股恶心的液体。`, `一阵恶臭从${this.name}散播开来`, `恶心的液体从${this.name}身上流出，且伴随着腥味。`, `${this.name}冒出黄色的浓烟，像是一股硫磺的味道。`]
                this.pushToTextArray(randomSFA(textArray))
            }
        }

        this._smell = val
    }
    private get smell () {
        return this._smell
    }


    private enemyDataLimit: EnemyData = {
        atk: 6,
        def: 8,
        hp: 8,
        noise: 14,
        smell: 14
    }

    getName () {
        return this.name
    }

    getSmell () {
        return this.smell
    }

    getNoise () {
        return this.noise
    }

    addSmell () {
        this.smell += randomNumber(2)
    }

    addNoise () {
        this.noise += randomNumber(2)
    }

    attack () {
        return this.atk
    }

    getDef () {
        return this.def
    }

    getHp () {
        return this.hp
    }

    // getText (): string | boolean {
    //     if (this.ifTextUpdate) {
    //         this.ifTextUpdate = false // 每次读取后标注为未更新
    //         return this._text
    //     } else {
    //         return false
    //     }
    // }

    constructor(idC: IDCreator) {
        this.idCreator = new Proxy(idC, {})
        this.name = this.nameList[randomNumber(this.nameList.length - 1)]
        this.atk = randomNumber(this.enemyDataLimit.atk)
        this.def = randomNumber(this.enemyDataLimit.def)
        this.hp = randomNumber(this.enemyDataLimit.hp * 0.8) + this.enemyDataLimit.hp * 0.2
        this.noise = randomNumber(this.enemyDataLimit.noise)
        this.smell = randomNumber(this.enemyDataLimit.smell)
    }
}

interface ItemEffect {
    strength?: number,
    agility?: number,
    intelligence?: number,
    sans?: number,
    light?: number,
    atk?: number
}

interface _ItemFunction {
    (): ItemEffect
}

interface ItemFunction {
    uuid: string
    name: string
    intro: string
    func: _ItemFunction
}

export class Item {
    private name: string
    private intro: string
    private _atk: number = 0
    private set atk (val: number) {
        this._atk = val
    }
    private get atk () {
        return this._atk
    }

    private _hp: number = 0
    private set hp (val: number) {
        this._hp = val
    }
    private get hp () {
        return this._hp
    }

    private uuid: string

    /** 控制道具的hp
     * @param x 增加或减少的hp值
     */
    public addHp (x: number) {
        this.hp += x
    }
    public getHp () {
        return this._hp
    }

    constructor(name: string, intro: string, atk: number, hp: number) {
        this.name = name
        this.intro = intro
        this.atk = atk
        this.hp = hp
        this.uuid = crypto.randomUUID()
    }
}

class Flashlight extends Item {
    private light: number = 3

    use () {

    }

    constructor () {
        super('手电筒', '或许能让你看清现实', 2, 2)
    }
}

class Sword extends Item {
    constructor () {
        super('匕首', '拿着吧，或许有用呢。', 8, 6)

        // this.addFunction({
        //     uuid: crypto.randomUUID(),
        //     name: '用匕首攻击',
        //     intro: '放手一搏吧',
        //     func: () => {
        //         return {
        //             atk: 8
        //         }
        //     }
        // })
    }
}

class Gun extends Item {
    constructor () {
        super('手枪', '5颗子弹', 20, 5)
        // this.addFunction({
        //     uuid: crypto.randomUUID(),
        //     name: '开枪',
        //     intro: '瞄准，嘭！',
        //     func: () => {
        //         return {
        //             atk: 20
        //         }
        //     }
        // })
    }
}

type AllItem = Flashlight

class ItemArray {
    private array: Array<AllItem> = []

    public addItem (item: AllItem) {
        this.array.splice(0, 0, item)
    }

    constructor (itemArray: Array<AllItem>) {
        this.array = itemArray
    }
}

// const test = new Flashlight()
type StageDataType = 'light' | 'smell' | 'noise'

export class Playground{ // 包含整个游戏所有内容的总控制
    private idCreator: IDCreator

    private user: User

    private enemyGroup: EnemyGroup
    private stageNumber: number = 0
    private stageLength: number = 4

    private stage: Stage

    private textArray: Array<{id: number, text: string}> = []
    private pushToTextArray (text: string) {
        this.textArray.push({
            id: this.idCreator.getId(),
            text
        })
    }

    public getTextArray () {
        let res: Array<{id: number, text: string}> = []
        res = res.concat(this.enemyGroup.getTextArray())
        res = res.concat(this.stage.getTextArray())
        res = res.concat(this.textArray)

        let fRes: Array<string> = ['']

        res.forEach((ele) => {
            fRes[ele.id] = ele.text
        })

        return fRes
    }

    /** 根据场景里light、smell、noise这三个属性的变化，分别计算出等级，和对应要显示的文字。 
    * @param newVal 当前属性的数值。
    * @param curVal 当前记录的属性的等级
    * @param type 属性类型
    */
    private enCalAndWrite (newVal: number, curVal: number, type: StageDataType) {
        const check = {
            light: {
                a: 4,
                b: 8,
                c: 12,
                d: 16,
            },
            smell: {
                a: 0, // 没有气味
                b: 6, // 轻微气味
                c: 12, // 明显气味
                d: 18 // 浓烈气味
            },
            noise: {
                a: 0, // 幽静
                b: 6, // 怪声
                c: 12, // 恐怖声音
                d: 18 // 就像在旁边的恐怖声音
            }
        }

        let newLevel: StageDataLevel
        switch (true) { // 根据总数值计算级别
            case newVal <= check[type].a:
                newLevel = 'a'
                break
            case newVal <= check[type].b:
                newLevel = 'b'
                break
            case newVal <= check[type].c:
                newLevel = 'c'
                break
            case newVal <= check[type].d:
                newLevel = 'd'
                break
            default:
                newLevel = 'a'
                break
        }

        let currentLevel: StageDataLevel
        switch (true) { // 根据总数值计算级别
            case curVal <= check[type].a:
                currentLevel = 'a'
                break
            case curVal <= check[type].b:
                currentLevel = 'b'
                break
            case curVal <= check[type].c:
                currentLevel = 'c'
                break
            case curVal <= check[type].d:
                currentLevel = 'd'
                break
            default:
                currentLevel = 'a'
                break
        }

        const sample = {
            light: {
                new: {
                    a: ['漆黑的', '黑暗的', '几乎什么都看不见的'],
                    b: ['幽暗的', '昏暗的', '只有一点微光的'],
                    c: ['昏黄的', '被幽绿的光线笼罩的', '充满诡异蓝光的'],
                    d: ['光亮的', '灯火通明的', '亮如白昼的']
                },
                increase: {
                    a: ['周围依然是一片漆黑'],
                    b: ['周围稍微变亮了一点', '漆黑中出现了一丝亮光', '周围的环境变得隐约可见了'],
                    c: ['周围变亮了', '可以看见周围的环境了', '周围亮了起来'],
                    d: ['周围变得非常光亮', '周围的环境清晰可见']
                },
                decrease: {
                    a: ['周围变成一片漆黑'],
                    b: ['周围变得昏暗', '周围只剩下一丝亮光', '周围的环境变得很难看清'],
                    c: ['周围稍微变暗了一些', '周围变得不那么亮了'],
                    d: ['周围变得非常光亮', '周围的环境清晰可见']
                }
            },
            smell: {
                new: {
                    a: ['周围散发着淡淡的像是木屑的味道', '空气中弥漫着一股旧报纸的味道', '空气中有一股淡淡的怪异的气味'],
                    b: ['周围散发着一股潮湿发霉的气味', '你似乎闻到一股奇怪的味道', '你感觉有一股奇怪的气味'],
                    c: ['周围散发着一股腥臭味', '一股恶心的味道挥之不去', '空气中弥漫着一股像是来自下水道的恶臭味'],
                    d: ['空气中充满了令人恶心的气味', '周围散发着一股浓烈的鱼腥味', '你感觉周围的恶臭令你无法呼吸']
                },
                increase: {
                    a: [''],
                    b: ['周围的味道变得奇怪了起来', '空气中似乎出现了一股怪味', '你感觉空气中有一丝诡异的味道', '你感觉恶心的味道越来越明显'],
                    c: ['空气中的臭味变得更重了', '腥臭味扑面而来', '周围的气味令你感到很恶心'],
                    d: ['周围的气味变得极度恶心', '空气中爆发出一股浓烈的腐臭味', '臭气冲天']
                },
                decrease: {
                    a: ['空气中的气味似乎消失了', '你似乎问不到恶心的味道了', '空气中只剩下轻微的怪味'],
                    b: ['周围不那么臭了', '空气中的腥臭味变淡了很多', '奇怪的气味散去了很多'],
                    c: ['空气中的恶臭似乎散去了一些', '周围的腥臭味减轻了一点', '你感觉奇怪的气味减轻了一点'],
                    d: ['']
                }
            },
            noise: {
                new: {
                    a: ['某个角落传来滴答滴答的钟声', '外面似乎有雨水轻轻落在泥土上的声音', '某个方向传来一些风吹动的声音'],
                    b: ['外面似乎有一些人们窃窃私语的声音', '你隐约听到老人啜泣的声音', '你感觉角落里传来奇怪的敲击声'],
                    c: ['周围传来响亮的钟声', '你清晰听到外面有人在外面嚎叫', '某个地方传来剧烈的撞击声', '某个方向传来清晰而又诡异的笑声'],
                    d: ['震耳的爆炸声包围着你', '你沉没在诡异的怪笑和哭泣声中', '刺耳而又响亮的蜂鸣声向你袭来', '你听到了恐怖的吼叫声']
                },
                increase: {
                    a: [''],
                    b: ['似乎出现一些奇怪的声音', '你好像听到了一些声响'],
                    c: ['不知名声音越来越明显', '急促的敲击声变得越来越近'],
                    d: ['周围的怪声变得异常响亮', '奇怪的声音似乎就在你的身旁发出']
                },
                decrease: {
                    a: ['声音似乎消失了',  '周围居然安静了下来'],
                    b: ['怪声慢慢变小了', '你感觉周围的声音变轻了', '奇怪的声音似乎离你越来远了'],
                    c: ['怪声似乎有些减缓', '你感觉怪声没那么明显了'],
                    d: ['']
                }
            }
        }


        if (this.stage.getIfNew()) { // 检查是否是新开的场景，如果是新开的场景，使用完整描述句式。
            if (type === 'noise') {
                this.stage.offIfNew()
            }

            if (type === 'light') {
                /** 当场景是新建的，在描述光时，需要由两部分组成，这是第一部分。 */
                const headA: string = sample[type].new[newLevel][randomNumber(sample[type].new[newLevel].length - 1)]
                /** 当场景是新建的，在描述光时，需要由两部分组成，这是第二部分。 */
                const headB = [ // 开头描述的样本，由场景的亮度描述+场景的类型名字组成。
                    `你在一个${headA + this.stage.getStageName()}里醒来`,
                    `你来到了一个${headA + this.stage.getStageName()}`,
                    `你身处在一个${headA + this.stage.getStageName()}里`
                ]
                this.pushToTextArray(randomSFA(headB))
            } else {
                this.pushToTextArray(randomSFA(sample[type].new[newLevel]))
            }
        } else {
            if (newLevel !== currentLevel) {
                if (newVal > curVal) {
                    this.pushToTextArray(randomSFA(sample[type].increase[newLevel]))
                }
                if (newVal < curVal) {
                    this.pushToTextArray(randomSFA(sample[type].decrease[newLevel]))
                }
            }
        }
    }

    private _totalLight: number = 0 // 总亮度
    private set totalLight (val: number) {
        console.log('newlight ===>', val)
        this.enCalAndWrite(val, this._totalLight, 'light')
        this._totalLight = val
    }
    private get totalLight () {
        return this._totalLight
    }

    private _totalSmell: number = 0 // 总气味值
    private set totalSmell (val: number) {
        this.enCalAndWrite(val, this._totalSmell, 'smell')
        this._totalSmell = val
    }
    private get totalSmell () {
        return this._totalSmell
    }

    private _totalNoise: number = 0 // 总噪音值
    private set totalNoise (val: number) {
        this.enCalAndWrite(val, this._totalNoise, 'noise')
        this._totalNoise = val
    }
    private get totalNoise () {
        return this._totalNoise
    }

    private write () {
    }

    /** 游戏内自动推进的脚本 */
    public autoRun () {
        console.log('autoRun')
        this.enemyGroup.randomAction()
    }

    /** 存放玩家可以使用的控制选项 */
    private controlArray = [
        {
            uuid: 'a-1',
            name: '调查',
            requirement: []
        },
        {
            uuid: 'a-2',
            name: '调查2',
            requirement: []
        },
        {
            uuid: 'a-3',
            name: '调查3',
            requirement: []
        }
    ]
    /** 判断游戏当前可以提供给玩家的操作选项 */
    public showControl () {
        console.log('showControl')
        return this.controlArray
    }

    /** 接收玩家输入的操作 */
    public myControl (uuid: string) {
        console.log('control')
        if (uuid) {
            this.stage.addProgress(randomNumber(20))
        }
        console.log('textArray after control ===>', this.textArray)
    }

    /** 计算分析用户的操作 */
    public analyzeControl () {
        console.log('analyzeControl')
    }

    /** 刷新当前数据，并通过this.write完成反馈给玩家的文字的处理。 */
    public update () {
        this.totalLight = this.stage.getLight() + this.user.getLight()
        this.totalSmell = this.stage.getSmell() + this.user.getSmell() +this.enemyGroup.getSmell()
        this.totalNoise = this.stage.getSmell() + this.enemyGroup.getNoise()
    }

    public useItem () {
    }
    
    public play() {
    }

    constructor(user: User) {
        this.idCreator = new IDCreator()

        this.user = user

        this.enemyGroup = new EnemyGroup(this.idCreator)

        this.stage = new Stage(this.stageNumber, this.stageLength, this.idCreator)
    }
}