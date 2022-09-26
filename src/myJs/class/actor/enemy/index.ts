import { randomEnumKey, randomInitialValue, randomPlusValue } from '@/myJs/class/common/commonFunc'
import { randomEFA } from '@/myJs/class/common/commonFunc'
import { BasicData } from '../../common/basicData'
import { _PLAYER_DATA, _DATA_STATE } from '../player/static'
import { _ENEMY_TYPE, ENEMY_BOX, _ENEMY_DATA, ENEMY_LIMIT, calAndWriteForEnemy } from './static'
import type { Playground } from '../../playground'
import type { EnemyGroup } from './enemyGroup'
import { Actor } from '../actor'

export class Enemy extends Actor {
    public getUUID () { return this.uuid }
    public getName () { return ENEMY_BOX[this.enemyType].name }
    private readonly enemyType: _ENEMY_TYPE = randomEnumKey(_ENEMY_TYPE)

    public attack () {}

    private noise = new BasicData(ENEMY_LIMIT.noise.min, ENEMY_LIMIT.noise.max)

    private smell = new BasicData(ENEMY_LIMIT.smell.min, ENEMY_LIMIT.smell.max)


    /**被攻击的处理方法
     * @param x 受到的攻击，包含发出攻击对象的uuid和攻击的val。
    */
    public beAttacked (x: {uuid: string, val: number}): void {
        /**被攻击时，受到的攻击力减防御的值 */
        const atkMinusDef = x.val - this.def
        if (atkMinusDef > 0) {
            this.hp.set(x.uuid, 0 - atkMinusDef)
        }
    }

    /**敌人死亡 */
    public die () {
        this.noise.remove(this.uuid)
    }

    /**为玩家以后可能装死预留的功能 */
    public getOpponentAmount: () => number = () => {
        return 1
    }
    public getAllOpponent = () => {
        return this.affectPlayground().affectEnemyGroup().getEnemyGroup()
    }

    public init (x: {
        initialHp: number,
        initialNoise: number,
        initialSmell: number
    }) {
        this.hp.set(this.uuid, x.initialHp)

        this.noise.set(this.uuid, x.initialNoise)

        this.smell.set(this.uuid, x.initialSmell)
    }

    constructor (
        playground: Playground
    ) {
        super(playground, {
            hp: 10,
            atk: randomInitialValue(ENEMY_LIMIT.atk.min, ENEMY_LIMIT.atk.max, ENEMY_LIMIT.atk.percent),
            def: randomInitialValue(ENEMY_LIMIT.def.min, ENEMY_LIMIT.def.max, ENEMY_LIMIT.def.percent),
            ifCanUseItem: true
        })

        const commonParams = {
            pushText: (text: string) => { this.affectPlayground().affectViewBox().pushText(text) },
            enemyType: this.enemyType
        }

        this.hp.addWDCF((newVal, curVal) => { calAndWriteForEnemy({...commonParams, dataType: _ENEMY_DATA.HP, newVal, curVal}) })
        this.hp.addWDCF((newVal) => { if (newVal <= 0) { this.die() } })

        this.smell.addWDCF((newVal, curVal) => { calAndWriteForEnemy({...commonParams, dataType: _ENEMY_DATA.SMELL, newVal, curVal}) })

        this.noise.addWDCF((newVal, curVal) => { calAndWriteForEnemy({...commonParams, dataType: _ENEMY_DATA.NOISE, newVal, curVal}) })
    }
}