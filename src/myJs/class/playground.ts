import { randomEnumKey } from '@/myJs/class/commonFunc'
import { _AT } from '@/myJs/static_data'
import { TextBox } from '@/myJs/class/textBox'
import type { ViewList } from '@/myJs/class/viewList'
import { Player } from '@/myJs/class/actor/player'
import { EnemyGroup } from '@/myJs/class/actor/enemyGroup'
import type { ItemFuncData, Item } from '@/myJs/class/item/item'
import { Flashlight } from '@/myJs/class/item/flashlight'
import { Sword } from '@/myJs/class/item/sword'
import { Gun } from '@/myJs/class/item/gun'
import { Stage } from '@/myJs/class/stage/stage'

export class Playground { // 包含整个游戏所有内容的总控制
    private viewList: ViewList
    /**玩家属性记录 */
    private playerData: {
        hp: Player['hp']['_data'],
        atk: Player['atk'],
        def: Player['def'],
        sans: Player['sans']
    }

    private player: Player
    private enemyGroup: EnemyGroup
    private stage: Stage
    private textBox = new TextBox()

    private stageNumber: number = 0
    private stageLength: number = 4

    /** 游戏内自动推进的脚本 */
    public autoRun () {
        console.log('autoRun')
        if (this.enemyGroup) {
            this.enemyGroup.randomAction()
        }
    }

    /**用于生成道具 */
    private itemCreator (type: _AT._ITEM_TYPE): Item {
        let res: Item
        switch (type) {
            case _AT._ITEM_TYPE.FLASHLIGHT: {
                res = new Flashlight(
                    this.textBox,
                    this.stage
                )
                break
            }
            case _AT._ITEM_TYPE.SWORD: {
                res = new Sword(
                    this.textBox,
                    this.enemyGroup
                )
                break
            }
            case _AT._ITEM_TYPE.GUN: {
                res = new Gun(
                    this.textBox,
                    this.enemyGroup
                )
                break
            }
        }

        return res
    }

    /** 模拟生成随机道具并被玩家获取 */
    private addRandomItemToPlayer () {
        const itemType: _AT._ITEM_TYPE = randomEnumKey(_AT._ITEM_TYPE)
        let item: Item = this.itemCreator(itemType)
        this.player.addItem(item)
    }

    /**游戏的回合 */
    private _round: number = 0
    /**每回合都执行一次的功能组，例如道具减少耐久。 */
    private funcArrayPerRound: Array<Function> = []
    private pushToFuncArrayPerRound (func: Function) {
        this.funcArrayPerRound.push(func)
    }
    private set round (x: number) {
        console.log('round ===>', x)
        this._round = x
        if (this.player.getPlayerItemAmount() < 3 && Math.random() > 0.6 && !this.stage.getIfProgressUpgrade()) {
            this.addRandomItemToPlayer()
        }
        // this.addRandomItemToPlayer()
    }
    private get round () {
        return this._round
    }

    /**触发玩家的操作 */
    public activatePlayerControl (x: {uuid?: Item['uuid'], key: ItemFuncData['key'] |  _AT._PLAYER_CONTROL}) {
        if (x.uuid) {
            this.player.useItem(x.uuid, x.key)
        } else {
            this.player.activateControl(x.key)
            this.round += 1
        }

        this.viewList.textList = this.textBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
    }

    public init () {
        this.stage.init()
        this.player.init(this.playerData.hp)
        this.player.bindStage(this.stage)

        this.viewList.textList = this.textBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
        console.log('viewList ===>', this.viewList)
    }

    constructor (
        viewList: ViewList,
        x: {
            hp: Player['hp']['_data'],
            atk: Player['atk'],
            def: Player['def'],
            sans: Player['sans']
        }
    ) {
        this.viewList = viewList

        this.playerData = x
        this.player = new Player(this.textBox, x)

        this.stage = new Stage(
            this.textBox,
            _AT._STAGE_STATE.START
        )

        this.enemyGroup = new EnemyGroup(this.textBox, this.player)
    }
}