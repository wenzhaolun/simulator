import { randomEnumKey, randomInitialValue, randomEFA, BasicData } from '../../common'
import { _PLAYER_DATA, _DATA_STATE } from '../player/static'
import { _ENEMY_TYPE, ENEMY_BOX, _ENEMY_DATA, ENEMY_LIMIT, calAndWriteForEnemy } from './static'
import type { Playground } from '../../playground'
import { Actor } from '../actor'

export class Enemy extends Actor {
    public getUUID () { return this.uuid }
    public getName () { return ENEMY_BOX[this.enemyType].name }
    private readonly enemyType: _ENEMY_TYPE = randomEnumKey(_ENEMY_TYPE)

    public attack = () => {
        const opponent = randomEFA(this.getAllOpponent())
        if (opponent.uuid === this.affectPlayground().affectPlayer().getUUID()) {
            this.affectPlayground().affectGame().affectViewBox().pushText(randomEFA(ENEMY_BOX[this.enemyType].attack))
            this.affectPlayground().affectPlayer().affectHp().minus(this.uuid, this.atk)
        } else {
            console.log('enemy attack fail')
        }
    }

    private noise = new BasicData(ENEMY_LIMIT.noise.min, ENEMY_LIMIT.noise.max)

    private smell = new BasicData(ENEMY_LIMIT.smell.min, ENEMY_LIMIT.smell.max)

    /**敌人死亡 */
    public die () {
        this.noise.remove(this.uuid)
        this.smell.remove(this.uuid)
        this.affectPlayground().affectEnemyGroup().removeEnemy(this.uuid)
    }

    /**为玩家以后可能装死预留的功能 */
    public getOpponentAmount: () => number = () => {
        return 1
    }
    public getAllOpponent = () => {
        let res: Array<{uuid: string, name: string}> = []
        const playerOpponent = {uuid: this.affectPlayground().affectPlayer().getUUID(), name: 'player'}
        res = res.concat(playerOpponent)
        // 敌人内部互相攻击的事件以后再完善
        // const enemyOpponent = this.affectPlayground().affectEnemyGroup().getEnemyGroup()
        // res = res.concat(enemyOpponent)
        return res
    }

    public init () {
        this.affectPlayground().affectGame().affectViewBox().pushText(ENEMY_BOX[this.enemyType].appear)

        const initialHp = this.hp.get.max() * 0.8
        this.hp.set(this.uuid, initialHp)

        this.noise.set(this.uuid, randomInitialValue(ENEMY_LIMIT.noise.min, ENEMY_LIMIT.noise.max, ENEMY_LIMIT.noise.percent))

        this.smell.set(this.uuid, randomInitialValue(ENEMY_LIMIT.smell.min, ENEMY_LIMIT.smell.max, ENEMY_LIMIT.smell.percent))
    }

    constructor (
        playground: Playground
    ) {
        super(playground, {
            hpMax: randomInitialValue(ENEMY_LIMIT.hp.min, ENEMY_LIMIT.hp.max, ENEMY_LIMIT.hp.percent),
            atk: randomInitialValue(ENEMY_LIMIT.atk.min, ENEMY_LIMIT.atk.max, ENEMY_LIMIT.atk.percent),
            def: randomInitialValue(ENEMY_LIMIT.def.min, ENEMY_LIMIT.def.max, ENEMY_LIMIT.def.percent),
            ifCanUseItem: true
        })

        const commonParams = {
            pushText: (text: string) => { this.affectPlayground().affectGame().affectViewBox().pushText(text) },
            enemyType: this.enemyType
        }

        this.hp.addWDCF((newVal, curVal) => { calAndWriteForEnemy({...commonParams, dataType: _ENEMY_DATA.HP, newVal, curVal}) })
        this.hp.addWDCF((newVal) => { if (newVal <= 0) { this.die() } })

        this.smell.addWDCF((newVal, curVal) => { calAndWriteForEnemy({...commonParams, dataType: _ENEMY_DATA.SMELL, newVal, curVal}) })

        this.noise.addWDCF((newVal, curVal) => { calAndWriteForEnemy({...commonParams, dataType: _ENEMY_DATA.NOISE, newVal, curVal}) })
    }
}