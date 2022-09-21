import { randomEnumKey, randomInitialValue, randomPlusValue } from '@/myJs/class/commonFunc'
import { _AT, LIMIT } from '@/myJs/static_data'
import type { TextBox } from '@/myJs/class/textBox'
import type { Player } from '@/myJs/class/actor/player'
import { HpForEnemy } from '@/myJs/class/actor/data/hpForEnemy'
import { NSForEnemy } from '@/myJs/class/actor/data/NSForEnemy'
import type { Stage } from '@/myJs/class/stage/stage'

export class Enemy {
    private readonly uuid: string = crypto.randomUUID()
    private readonly enemyType: _AT._ENEMY_TYPE = randomEnumKey(_AT._ENEMY_TYPE)

    private readonly atk: number = randomInitialValue(LIMIT.enemy.atk.min, LIMIT.enemy.atk.max, LIMIT.enemy.atk.percent)

    private player: Player
    private stage: Stage

    public attackPlayer () {
        this.player.beAttacked({
            uuid: this.uuid,
            val: this.atk
        })
    }
    private readonly def: number = randomInitialValue(LIMIT.enemy.def.min, LIMIT.enemy.def.max, LIMIT.enemy.def.percent)

    private hp: HpForEnemy
    private noise: NSForEnemy
    /**敌人发出随机噪音（该值为直接赋值）*/
    public setRandomNoise () {
        this.noise.setExtendData({
            uuid: this.uuid,
            val: randomInitialValue(LIMIT.enemy.noise.min, LIMIT.enemy.noise.max, LIMIT.enemy.noise.percent)
        })
        this.stage.setNoise({
            uuid: this.uuid,
            val: this.noise.getVal()
        })
    }
    private smell: NSForEnemy
    /**敌人散发随机气味（该值为累计赋值）*/
    public addRandomSmell () {
        this.smell.plusExtendData({
            uuid: this.uuid,
            val: randomPlusValue(LIMIT.enemy.smell.min, LIMIT.enemy.smell.max, LIMIT.enemy.smell.eachPercent)
        })
        this.stage.addSmell({
            uuid: this.uuid,
            val: this.smell.getVal()
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
    public die () {
        this.noise.removeExtendData(this.uuid)
    }

    /**推送文字的方法 */
    private textBox: TextBox

    public init (x: {
        initialHp: number,
        initialNoise: number,
        initialSmell: number
    }) {
        this.hp.setVal(x.initialHp)

        this.noise.setVal(x.initialNoise)

        this.smell.setVal(x.initialSmell)
    }

    constructor (
        textBox: TextBox,
        player: Player,
        stage: Stage
    ) {
        this.textBox = textBox
        this.player = player
        this.stage = stage

        this.hp = new HpForEnemy(
            textBox,
            this,
            {
                enemyType: this.enemyType,
                totalDataMin: LIMIT.enemy.hp.min,
                totalDataMax: LIMIT.enemy.hp.max
            }
        )

        const paramsForNoiseAndSmell = {
            enemyType: this.enemyType,
            enemyUUID: this.uuid
        }

        this.noise = new NSForEnemy(
            textBox,
            {
                ...paramsForNoiseAndSmell,
                totalDataMin: LIMIT.enemy.noise.min,
                totalDataMax: LIMIT.enemy.noise.max,
                enemyDataType: _AT._ENEMY_DATA.NOISE
            }
        )
        this.smell = new NSForEnemy(
            textBox,
            {
                ...paramsForNoiseAndSmell,
                totalDataMin: LIMIT.enemy.smell.min,
                totalDataMax: LIMIT.enemy.smell.max,
                enemyDataType: _AT._ENEMY_DATA.SMELL
            }
        )
    }
}