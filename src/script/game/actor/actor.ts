import { BasicData } from "../common"
import { ItemArray } from "../item"
import type { Playground } from "../playground"

export abstract class Actor {
    protected uuid: string = crypto.randomUUID()
    public getUUID () {
        return this.uuid
    }

    protected hp: BasicData
    public affectHp () {
        return this.hp
    }
    protected atk: number
    public affectAtk () {
        return {
            getAtk: () => {
                return this.atk
            }
        }
    }
    protected def: number

    /**是否能使用道具 */
    protected ifCanUseItem: boolean
    public getIfCanUseItem () {
        return this.ifCanUseItem
    }
    protected itemArray: ItemArray
    public affectItemArray () {
        return this.itemArray
    }

    /**临时指向的对象（行为和道具的作用对象）,被get后就会设置成undefined. */
    protected tempOpponentUUID: string | undefined
    public getIfHaveOpponentUUID = () => {
        return !!this.tempOpponentUUID
    }
    /**获取可以被选为敌对对象的敌对数量 */
    public abstract getOpponentAmount: () => number
    public abstract getAllOpponent: () => Array<{uuid: string, name: string}>
    /**
     * 选定敌对对象
     * @param uuid 想要选定对象的uuid
     * @returns true代表选定成功，false代表失败。
     */
    public selectOpponent = (uuid: string) => {
        this.tempOpponentUUID = uuid
    }
    public getOpponentAndClearUUID = (): Actor | undefined => {
        let opponent: Actor | undefined = undefined
        if (!!this.tempOpponentUUID) {
            if (this.affectPlayground().affectPlayer().getUUID() === this.tempOpponentUUID) {
                opponent = this.affectPlayground().affectPlayer()
            } else {
                opponent = this.affectPlayground().affectEnemyGroup().getEnemy(this.tempOpponentUUID)
            }
            this.tempOpponentUUID = undefined
        } else {
            console.log('no opponent')
        }
        return opponent
    }

    /**被攻击的处理方法
     * @param x 受到的攻击，包含发出攻击对象的uuid和攻击的val。
    */
    public attack (x: {uuid: string, val: number}): void {
        /**敌人攻击减玩家的防御的值 */
        const atkMinusDef = x.val - this.def
        if (atkMinusDef > 0) {
            this.hp.set(x.uuid, atkMinusDef)
        }
    }

    /**角色所在游玩空间 */
    private playground: Playground
    public affectPlayground = () => {
        return this.playground
    }

    constructor (
        playground: Playground,
        x: {
            hpMax: number,
            atk: number,
            def: number,
            ifCanUseItem: boolean
        }
    ) {
        this.playground = playground
        this.hp = new BasicData(0, x.hpMax)
        
        this.atk = x.atk
        this.def = x.def

        this.ifCanUseItem = x.ifCanUseItem
        this.itemArray = new ItemArray(this)
    }
}
