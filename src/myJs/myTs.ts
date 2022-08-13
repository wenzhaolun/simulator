export function myTestFunction(x: string): number {
    console.log(x)
    return 1
}

const staticData = {
    user: {
        sight: 40
    },
    item: {
        flashLight: {
            id: '001',
            name: '手电筒',
            intro: '用于照明的普通手电筒。',
            atk: 2,
            def: 1,
            hp: 2,
            weight: 200
        }
    }
}

const words = {
    start: {
        room: 1,
        dungeon: 2,
        church: 3,
        tomb: 4,
        tunnel: 5,
        garden: 6,
        valut: 7
    },
    halfway: {
        room: 1,
        dungeon: 2,
        church: 3,
        tomb: 4,
        tunnel: 5,
        garden: 6,
        valut: 7
    }
}

const otherWords = {
    light: {
        a: [
            '被昏黄色灯光笼罩的房间',
            '大门上狭窄的气窗只能透过些极为微弱的光线，而头上用来通风的烟道根本漏不进光线来',
            '云团已经遮挡住了月亮',
            '你在一个${}里醒来', '门厅昔日显然装修精良，镶嵌着黑色橡木板', 
            '宽广地下室的一个角落，那是一口井，井口用砖砌成，直接开在泥土地上。走近一看，井口约有五英尺宽、超过一英尺厚，高出地面六英寸——应该是十七世纪的古井，也可能更早。',
            '用石头和砖块建起的房屋，这房屋位于不祥的沼泽和修在低矮山丘上的墓地南方'
        ]
    },
    smell: {
        a: ['空气中弥漫着一股像是下水道的恶臭味']
    },
    noise: {
        a: '角落不断传来奇怪的笑声'
    },
    intro: ['破旧的房间布满了蜘蛛网', '屋里的窗户几乎全被木板钉死', '进了一条更窄的胡同，这里静寂依然，没有一点灯光', '一扇非常古旧的十格镶板木门，它已经被虫子蛀蚀得很严重了'],
    event: {
        sample: '`你在一个被昏黄色灯光笼罩的房间里醒来，空气中弥漫着一股像是下水道的恶臭味，房间外传来咚咚咚的脚步声。你在朦胧中看到书桌上有一盏煤油灯，火苗摇曳不定，像是有风。`,',
        research: {
            room: [
                {
                    intro: '房间地面的中央位置画着一个诡异的法阵,',
                    compose: [
                        {
                            intro: '法阵的中心像是一个无底深渊',
                            compose: [
                                {
                                    intro: '并且散发着幽幽的绿光',
                                    progress: 70,
                                    option: [
                                        {
                                            check: 'torch',
                                            intro: '尝试用火把点燃法阵',
                                            randomEffect: [
                                                {
                                                    intro: '无法点燃',
                                                    effect: {
                                                        string: 'progress',
                                                        value: 0
                                                    }
                                                },
                                                {
                                                    intro: '法阵瞬间被点燃，迸发出极强的亮光。',
                                                    effect: {
                                                        string: 'light',
                                                        value: 100
                                                    }
                                                },
                                                {
                                                    intro: '笋干爆炸',
                                                    effect: {
                                                        string: 'hp',
                                                        value: -1000
                                                    }
                                                },
                                                {
                                                    intro: '法阵的部分被点燃，燃烧的部分看起来像是一个古老的字符。',
                                                    effect: {
                                                        string: 'progress',
                                                        value: 30 * (0.5 + Math.random())
                                                    }
                                                }
                                            ],
                                            repeat: false
                                        },
                                        {
                                            check: undefined,
                                            intro: '研究法阵上的图案',
                                            randomEffect: [
                                                {
                                                    intro: '你似乎看懂了部分图案',
                                                    effect: {
                                                        string: 'progress',
                                                        value: 10 * (0.5 + Math.random())
                                                    },
                                                    repeat: true
                                                },
                                                {
                                                    intro: '你觉得某个图案很难懂',
                                                    effect: {
                                                        string: 'progress',
                                                        value: 2 * (0.2 + Math.random())
                                                    }
                                                },
                                                {
                                                    intro: '某个图案令你想起了一些事',
                                                    effect: {
                                                        string: 'progress',
                                                        value: 8 * (0.6 + Math.random())
                                                    }
                                                },
                                                {
                                                    intro: '诡异的图案令你出现恐怖的幻觉',
                                                    effect: {
                                                        string: 'sans',
                                                        value: -4
                                                    }
                                                }
                                            ],
                                            repeat: true
                                        },
                                        {
                                            check: undefined,
                                            intro: '触摸法阵',
                                            randomEffect: ''
                                        }
                                    ]
                                },
                                {
                                    intro: ''
                                }
                            ]
                        }

                    ],
                    option: [
                        {
                            intro: '桌子上的煤油灯发出奇怪的滋滋声，像是恶魔的嘲笑声。'
                        }
                    ]
                }
            ]
        },
        battle: {}
    },
    option: '站起来，继续躺着。'

}

function randomNumber(max: number){ // 根据最大值，随机获取0-最大值的整数。
    return Math.floor(Math.random() * (max - 1))
}

type StageType = 'room' | 'dungeon' | 'church' | 'tomb' | 'tunnel' | 'garden' | 'valut' // 关卡类型
type StageState = 'start' | 'halfway'
type StageDataLevel = 'a' | 'b' | 'c' | 'd'

type wordType = 'intro' | 'news' | 'history'

class Stage {
    private _light: number = 0
    private set light (val: number) {
        this._light = val
    }
    private get light () {
        return this._light
    }
    private smell: number
    private noise: number
    private stageDataLimit = {
        light: 20,
        smell: 20,
        noise: 20
    }

    private stageNum: number
    private stageLength: number

    private stageTypeArray: Array<StageType> = ['room', 'dungeon', 'church', 'tomb', 'tunnel', 'garden', 'valut']
    private stageType: StageType
    private stageState: StageState

    getLight () {
        return this.light
    }

    getSmell () {
        return this.smell
    }

    getNoise () {
        return this.noise
    }

    getState () {
        return this.stageState
    }

    getType () {
        return this.stageType
    }

     /** 通过关卡序号和关卡总量，得出目前关卡是属于开始、过程还是结束 */
     private checkStageState() {
        switch (true) {
            case this.stageNum <= 0: return 'start'
            case this.stageNum < this.stageLength: return 'halfway'
            default: return 'start'
        }
    }

    constructor(stageNum: number, stageLength: number) {
        // this.light = randomNumber(this.stageDataLimit.light * 0.6) + this.stageDataLimit.light * 0.4,
        this.smell = randomNumber(this.stageDataLimit.smell * 0.4),
        this.noise = randomNumber(this.stageDataLimit.noise * 0.4)

        this.stageNum = stageNum
        this.stageLength = stageLength

        this.stageState = this.checkStageState()
        this.stageType = this.stageTypeArray[randomNumber(this.stageTypeArray.length)]
        
    }
}

interface UserData {
    strength: number,
    agility: number,
    intelligence: number,
    sans: number,
    sight: number,
    smell: number
}

class User {
    private data: UserData
    private itemArray: Array<Item> = []

    getSight () {
        return this.data.sight
    }

    getSmell () {
        return this.data.smell
    }

    pickItem(x: Item) {
        this.itemArray = this.itemArray.concat(x)
    }
    dropItem(x: Item) {
        const id = x.data.id
        const index = this.itemArray.findIndex((ele) => {
            ele.data.id === id
        })
        if (index >= 0) {
            this.itemArray.splice(index, 1)
        }
    }
    useItem(x: Item) {
        const id = x.data.id
    }
    constructor(data: UserData, itemArray: Array<Item>) {
        this.data = data
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

class EnemyGroup {
    private group: Array<Enemy>
    private enemyMax: number = 5
    private enemyBound: number = 1

    private _enemyRate = 0
    /** 当该值变化时，检查该值是否达到生成敌人的临界点，如果达到，生成敌人并加入。 */
    private set enemyRate (val: number) {
        this._enemyRate = val
        if (this._enemyRate >= this.enemyBound && this.group.length < this.enemyMax) {
            this.spawnEnemy(new Enemy)
        }
    }
    private get enemyRate () {
        return this._enemyRate
    }

    getSmell () {
        let noise = 0
        for (const ele of this.group) {
            noise += ele.getNoise()
        }
        return noise
    }

    spawnEnemy (enemy: Enemy) {
        this.group.push(enemy)
    }

    constructor () {
        this.group = []
        this.enemyRate = Math.random() * this.enemyBound * 0.8 + this.enemyBound * 0.2
    }
}

class Enemy {
    private data: EnemyData
    private enemyDataLimit: EnemyData = {
        atk: 6,
        def: 8,
        hp: 8,
        noise: 14,
        smell: 14
    }

    getSmell () {
        return this.data.smell
    }

    getNoise () {
        return this.data.noise
    }

    constructor() {
        this.data = {
            atk: randomNumber(this.enemyDataLimit.atk),
            def: randomNumber(this.enemyDataLimit.def),
            hp: randomNumber(this.enemyDataLimit.hp * 0.8) + this.enemyDataLimit.hp * 0.2,
            noise: randomNumber(this.enemyDataLimit.noise),
            smell: randomNumber(this.enemyDataLimit.smell)
        }
    }
}

interface ItemData {
    id: string,
    name: string,
    intro: string,
    atk: number,
    def: number,
    hp: number,
    weight: number
}

export class Item {
    public data: ItemData
    public uuid: string
    constructor(a: ItemData) {
        this.data = a
        this.uuid = crypto.randomUUID()
    }
}

interface FlashLightData {
    light: number,
    life: number,
    addLight: number
}

export class Flashlight extends Item {
    public ownData: FlashLightData
    on() {
        this.ownData.light = this.ownData.addLight
    }
    off() {
        this.ownData.light = 0
    }
    constructor(ItemData: ItemData, ownData: FlashLightData) {
        super(ItemData)
        this.ownData = ownData
    }
}

// const test = new Flashlight()

export class Playground{ // 包含整个游戏所有内容的总控制
    private user: User

    private enemyGroup: EnemyGroup
    private stageNumber: number = 0
    private stageLength: number = 4

    private stage: Stage

    private sightLevel: StageDataLevel
    private oldSightLevel: StageDataLevel
    private smellLevel: StageDataLevel
    private oldSmellLevel: StageDataLevel
    private noiseLevel: StageDataLevel
    private oldNoiseLevel: StageDataLevel

    
    private check = {
        /** 用于对比计算视野等级
         * 小于4很难看清
         * 小于8不容易看清
         * 小于12可以看清
         * 小于16看得很清楚
         */
        sight: {
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

    /** 根据玩家属性和场景检查玩家视觉 */
    private checkSight() {
        const sight = this.user.getSight() + this.stage.getLight()
        switch (true) {
            case sight <= this.check.sight.a:
                return 'a'
            case sight <= this.check.sight.b:
                return 'b'
            case sight <= this.check.sight.c:
                return 'c'
            case sight <= this.check.sight.d:
                return 'd'
            default:
                return 'a'
        }
    }

    /** 比较新旧视觉等级 @param sightLevel */
    private compareSight (sightLevel: StageDataLevel) {
        return sightLevel === this.oldSightLevel
    }
    
    /** 根据玩家属性、场景和敌人检查玩家味觉 */
    private checkSmell() {
        let smell = this.user.getSmell() + this.stage.getSmell() + this.enemyGroup.getSmell()

        switch (true) {
            case smell <= this.check.smell.a:
                return 'a'
            case smell <= this.check.smell.b:
                return 'b'
            case smell <= this.check.smell.c:
                return 'c'
            case smell <= this.check.smell.d:
                return 'd'
            default:
                return 'a'
        }
    }

    /** 比较新旧气味等级 @param smellLevel */
    private compareSmell (smellLevel: StageDataLevel) {
        return smellLevel === this.oldSmellLevel
    }

    /** 根据玩家属性、场景和敌人检查场景声音 */
    private checkNoise() {
        let noise = this.stage.getNoise()

        const cNoise = this.check.noise
            switch (true) {
                case noise <= cNoise.a:
                    return 'a'
                case noise <= cNoise.b:
                    return 'b'
                case noise <= cNoise.c:
                    return 'c'
                case noise <= cNoise.d:
                    return 'd'
                default:
                    return 'a'
            }
    }

    /** 比较新旧噪音等级 @param noiseLevel */
    private compareNoise (noiseLevel: StageDataLevel) {
        return noiseLevel === this.oldNoiseLevel
    }

    writer () {
        const stageState: StageState = this.stage.getState()
        const stageType: StageType = this.stage.getType()
        const sentence = words[stageState][stageType]
    }
    
    public play() {
    }

    constructor(data: UserData, itemArray: Array<Item>) {
        this.user = new User(data, itemArray)

        this.enemyGroup = new EnemyGroup()

        this.stage = new Stage(this.stageNumber, this.stageLength)

        this.sightLevel = this.oldSightLevel = this.checkSight()
        this.smellLevel = this.oldSmellLevel = this.checkSmell()
        this.noiseLevel = this.oldNoiseLevel = this.checkNoise()
    }
}