import { randomEFA, randomNumber, randomInitialValue, randomPlusValue } from '@/myJs/class/commonFunc'
import { _AT, LIMIT } from '@/myJs/static_data'
import type { Player } from '@/myJs/class/actor/player'
import { Enemy } from '@/myJs/class/actor/enemy'
import type { Stage } from '@/myJs/class/stage/stage'
import type { TextBox } from '@/myJs/class/textBox'

export class EnemyGroup {
    private group: Array<Enemy> = []
    private spawnEnemy () {
        if (this.stage) {
            this.group.splice(0, 0, new Enemy(
                this.textBox,
                this.player,
                this.stage
            ))
            this.group[0].init({
                initialHp: randomInitialValue(LIMIT.enemy.hp.min, LIMIT.enemy.hp.max, LIMIT.enemy.hp.percent),
                initialNoise: randomInitialValue(LIMIT.enemy.noise.min, LIMIT.enemy.noise.max, LIMIT.enemy.noise.percent),
                initialSmell: randomInitialValue(LIMIT.enemy.smell.min, LIMIT.enemy.smell.max, LIMIT.enemy.smell.percent)
            })
        } else {
            console.log('no stage. can\'t spawnEnemy.')
        }
    }

    /** 推送文本的方法 */
    private textBox: TextBox
    private stage: Stage | undefined
    public bindStage (stage: Stage) {
        this.stage = stage
    }
    private player: Player

    private _enemyRate = randomInitialValue(LIMIT.enemy.rate.min, LIMIT.enemy.rate.max, LIMIT.enemy.rate.percent)
    /** 当该值变化时，检查该值是否达到生成敌人的临界点，如果达到且敌人数量未达到上限，生成敌人并加入。 */
    private set enemyRate (val: number) {
        this._enemyRate = val
        if (this._enemyRate >= LIMIT.enemy.rate.max && this.group.length < LIMIT.enemy.amount.max) {
            this.spawnEnemy()
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

    constructor (
        textBox: TextBox,
        player: Player
    ) {
        this.textBox = textBox
        this.player = player
    }
}