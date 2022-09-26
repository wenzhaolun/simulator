import { randomEnumKey } from '@/myJs/class/common/commonFunc'
import { turnNameToText, ViewBox, VIEW_BOX_TEXT } from '@/myJs/class/viewBox'
import type { ViewList } from '@/myJs/class/viewList'
import { Player } from '@/myJs/class/actor/player'

import { Stage } from '@/myJs/class/stage/stage'
import type { _PLAYER_CONTROL } from './actor/player/static'

import { _STAGE_STATE } from './stage/static'

import { EnemyGroup } from './actor/enemy/enemyGroup'
import { ItemCreator } from './item/itemCreator'
import type { _ALLITEM_FUNC } from './item/static'

export class Playground { // 包含整个游戏所有内容的总控制
    private viewList: ViewList
    public affectViewList () {
        return this.viewList
    }
    /**玩家属性记录 */
    private playerData: {
        hp: number,
        atk: Player['atk'],
        def: Player['def'],
        sans: Player['sans']
    }

    private stage: Stage | undefined
    public affectStage () {
        if (this.stage) {
            return {
                affectLight: this.stage.affectLight,
                affectSmell: this.stage.affectSmell,
                affectNoise: this.stage.affectNoise,
                addProgress: this.stage.addProgress
            }
        } else {
            console.log('no stage')
        }
    }
    private player: Player
    public affectPlayer () {
        return this.player
    }
    
    private enemyGroup: EnemyGroup
    public affectEnemyGroup () {
        return this.enemyGroup
    }

    private itemCreator: ItemCreator
    public affectItemCreator () {
        return this.itemCreator
    }

    private viewBox = new ViewBox()
    public affectViewBox () {
        return this.viewBox
    }

    private stageNumber: number = 0
    private stageLength: number = 4

    /** 游戏内自动推进的脚本 */
    public autoRun () {
        console.log('autoRun')
        if (this.enemyGroup) {
            this.enemyGroup.randomAction()
        }
    }


    /**游戏的回合 */
    private _round: number = 0
    /**每回合都执行一次的功能组，例如道具减少耐久。 */
    private funcArrayPerRound: Array<Function> = []
    private pushToFuncArrayPerRound (func: Function) {
        this.funcArrayPerRound.push(func)
    }
    private set round (x: number) {
        this.funcArrayPerRound.forEach((ele) => {
            ele()
        })
        this._round = x
    }
    private get round () {
        return this._round
    }

    /**触发玩家的操作 */
    public activatePlayerControl (key: _PLAYER_CONTROL) {
        this.player.activateControl(key)
        this.round += 1
        
        this.viewList.textList = this.viewBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
        this.viewList.stageItemList = this.itemCreator.affectItemArray().getItemArray()
    }

    public activatePlayerItemFunc (uuid: string, funcKey: _ALLITEM_FUNC) {
        const res = this.player.affectItemArray().useItem(uuid, funcKey)

        if (res === 1) {
            this.viewBox.setJumpBoxObject({
                title: VIEW_BOX_TEXT.SELECT_OPPONENT.title,
                array: turnNameToText(this.player.getAllOpponent())
            })
            
            this.viewBox.pushFuncToAJBS((selsctedUUID: string) => {
                this.player.selectOpponent(selsctedUUID)
            })
            this.viewBox.pushFuncToAJBS(() => {
                this.player.affectItemArray().useItem(uuid, funcKey)
            })
        }

        this.viewList.selectEnemyObject = this.viewBox.getJumpBoxObject()
        this.viewList.textList = this.viewBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
    }

    public selectJumpBoxSelection (uuid: string) {
        this.viewBox.selectJumpBoxSelection(uuid)
        this.viewList.selectEnemyObject = this.viewBox.getJumpBoxObject()
        this.viewList.textList = this.viewBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
    }

    public closeJumpBox () {
        this.viewBox.closeJumpBox()
        this.viewList.selectEnemyObject = this.viewBox.getJumpBoxObject()
    }

    public playerPickItem (uuid: string) {
        const item = this.itemCreator.affectItemArray().getItem(uuid)
        if (item) {
            this.player.affectItemArray().addItem(item)
        } else {
            console.log('no item, pick fail.')
        }
        console.log('player ===>', this.player)
        this.viewList.textList = this.viewBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
        this.viewList.stageItemList = this.itemCreator.affectItemArray().getItemArray()
    }

    public init () {
        this.player.init(10)
        this.stage?.init()
        this.viewList.textList = this.viewBox.getTextBox()
        this.viewList.controlList = this.player.getControl()
        console.log('viewBox ===>', this.viewBox)
        console.log('viewList ===>', this.viewList)
    }

    constructor (
        viewList: ViewList,
        x: {
            hp: number,
            atk: Player['atk'],
            def: Player['def'],
            sans: Player['sans']
        }
    ) {
        this.viewList = viewList

        this.playerData = x
        this.player = new Player(this, x)

        this.stage = new Stage(this, _STAGE_STATE.START)

        this.enemyGroup = new EnemyGroup(this)

        this.itemCreator = new ItemCreator(this)

        this.pushToFuncArrayPerRound(() => {
            this.affectEnemyGroup().addEnemyRate(20)
        })
    }
}