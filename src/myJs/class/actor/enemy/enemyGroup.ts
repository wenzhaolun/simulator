import { randomEFA, randomNumber, randomInitialValue, randomPlusValue } from '@/myJs/class/common/commonFunc'
import { Enemy } from '@/myJs/class/actor/enemy'
import { ENEMY_LIMIT } from './static'
import type { Playground } from '../../playground'
import type { Actor } from '../actor'

export class EnemyGroup {
    private group: Array<Enemy> = []
    private spawnEnemy () {
        const enemy = new Enemy(this.playground)
        this.group.push(enemy)
        enemy.init({
            initialHp: randomInitialValue(ENEMY_LIMIT.hp.min, ENEMY_LIMIT.hp.max, ENEMY_LIMIT.hp.percent),
            initialNoise: randomInitialValue(ENEMY_LIMIT.noise.min, ENEMY_LIMIT.noise.max, ENEMY_LIMIT.noise.percent),
            initialSmell: randomInitialValue(ENEMY_LIMIT.smell.min, ENEMY_LIMIT.smell.max, ENEMY_LIMIT.smell.percent)
        })
    }

    private _enemyRate = randomInitialValue(ENEMY_LIMIT.rate.min, ENEMY_LIMIT.rate.max, ENEMY_LIMIT.rate.percent)
    /** 当该值变化时，检查该值是否达到生成敌人的临界点，如果达到且敌人数量未达到上限，生成敌人并加入。 */
    private set enemyRate (val: number) {
        this._enemyRate = val
        console.log('enemyRate ===>', val)
        if (this._enemyRate >= ENEMY_LIMIT.rate.max && this.group.length < ENEMY_LIMIT.amount.max) {
            this.spawnEnemy()
        }
    }
    private get enemyRate () {
        return this._enemyRate
    }
    private addEnemyRate (v: number) {
        if (v <= ENEMY_LIMIT.rate.max) {
            this.enemyRate += v
        } else {
            this.enemyRate += ENEMY_LIMIT.rate.max
        }
    }

    /**被玩家选中的敌人在数组中的id */
    private selectedEnemyUUID: string | undefined
    public selectEnemy (uuid: string) {
        this.selectedEnemyUUID = uuid
    }
    public getSelectedEnemy () {
        return this.selectedEnemyUUID
    }

    /**获取敌人数量 */
    public getEnemyAmount () {
        return this.group.length
    }
    /**获取敌人群体（包含其uuid和名字） */
    public getEnemyGroup () {
        let res: Array<{ uuid: string, name: string }> = []
        this.group.forEach((ele) => {
            res.push({ uuid: ele.getUUID(), name: ele.getName()})
        })
        return res
    }
    public getEnemy (uuid: string): Actor | undefined {
        const index = this.group.findIndex((ele) => {
            return ele.getUUID() === uuid
        })
        if (index >= 0) {
            return this.group[index]
        }
    }
    public removeEnemy (uuid: string) {
        const index = this.group.findIndex((ele) => {
            return ele.getUUID() === uuid
        })
        if (index >= 0) {
            this.group.splice(index, 1)
        } else {
            console.log('can\'t find enemy. remove fail.')
        }
    }
    /**
     * 影响某个uuid的敌人
     * @returns 
     */
    public affectEnemy (uuid: string) {
        if (this.selectedEnemyUUID) {
            const index = this.group.findIndex((ele) => {
                return ele.getUUID() === uuid
            })
            if (index >= 0) {
                return this.group[index]
            } else {
                console.log('no Enemy, can\'t effect.')
            }
        } else {
            console.log('no selectedEnemy')
        }
    }
    
    /**随机敌人攻击 */
    private randomAttackPlayer () {
        this.group[randomNumber(this.group.length - 1)].attack()
    }

    /** 随机敌人放屁 */
    private addRandomSmell () {
        // this.group[randomNumber(this.group.length - 1)].addRandomSmell()
    }

    /** 随机敌人唱歌 */
    private setRandomNoise () {
        // this.group[randomNumber(this.group.length - 1)].setRandomNoise()
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
                    this.addEnemyRate(randomPlusValue(ENEMY_LIMIT.rate.min, ENEMY_LIMIT.rate.max, ENEMY_LIMIT.rate.eachPercent))
                    break
                default:
                    this.randomAttackPlayer()
                    break
            }
        } else {
            this.addEnemyRate(randomPlusValue(ENEMY_LIMIT.rate.min, ENEMY_LIMIT.rate.max, ENEMY_LIMIT.rate.eachPercent))
        }
    }

    /**敌人群所在的游玩空间 */
    private playground: Playground
    public affectPlayground = () => {
        return this.playground
    }

    constructor (
        playground: Playground
    ) {
        this.playground = playground
    }
}