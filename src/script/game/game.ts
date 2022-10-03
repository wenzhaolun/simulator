import type { ViewDataForVue } from "@/script/viewDataForVue";
import type { _PLAYER_CONTROL, _PLAYER_PARAMS } from "./actor/player/static";
import { _ITEM_FUNC_TYPE, type _ALLITEM_FUNC } from "./item/static";
import { Playground } from "./playground";
import { turnNameToText, ViewBox } from "./viewBox";

export class Game {
    private playground: Playground | undefined
    public affectPlayground () {
        if (this.playground) {
            return this.playground
        }
    }

    public start = (playerParams: _PLAYER_PARAMS) => {
        this.playground = new Playground(this, playerParams)
        this.playground.init()
        
        this.viewBox.playerSettingPageSwitch.off()
        this.viewBox.playgroundPageSwitch.on()
        
        this.viewBox.update(this.viewDataForVue)
    }

    public gameOver = () => {
        const runLater = () => {
            this.viewBox.gameOverJumpBoxSwitch.on()
            this.viewBox.update(this.viewDataForVue)
        }
        return {
            win: () => {
                this.viewBox.winGameOver()
                runLater()
            },
            fail: () => {
                this.viewBox.failGameOver()
                runLater()
            }
        }
    }

    public restart () {
        this.viewBox.playgroundPageSwitch.off()
        this.viewBox.clearText()
        delete this.playground
        this.playground = undefined

        this.viewBox.gameOverJumpBoxSwitch.off()
        this.viewBox.playerSettingPageSwitch.on()
        
        this.viewBox.update(this.viewDataForVue)
    }

    /**触发玩家的操作 */
    public activatePlayerControl (key: _PLAYER_CONTROL) {
        this.affectPlayground()?.affectPlayer().activateControl(key)
        
        this.affectPlayground()?.nextRound()

        this.viewBox.update(this.viewDataForVue)
    }
    /**触发玩家的道具功能 */
    public activatePlayerItemFunc (uuid: string, funcKey: _ALLITEM_FUNC, type: _ITEM_FUNC_TYPE) {
        const res = this.affectPlayground()?.affectPlayer().affectItemArray().useItem(uuid, funcKey)

        if (res === 1) {
            const affectPlayground = this.affectPlayground()
            if (affectPlayground) {
                this.viewBox.setEnemySelection(turnNameToText(affectPlayground.affectPlayer().getAllOpponent()))
                this.viewBox.enemySelectionSwitch.on()
                this.funcArrayAfterSetselectEnemySelection.push((selsctedUUID) => { affectPlayground.affectPlayer().selectOpponent(selsctedUUID) })
                this.funcArrayAfterSetselectEnemySelection.push(() => { this.activatePlayerItemFunc(uuid, funcKey, type) })
            }
        }

        if (res === 2 && type === _ITEM_FUNC_TYPE.A) {
            this.affectPlayground()?.nextRound()
        }

        this.viewBox.update(this.viewDataForVue)
    }

    /**这些功能会在弹窗的选项被选择后执行。（selectEnemySelection里执行） */
    private funcArrayAfterSetselectEnemySelection: Array<(selectedUUID: string) => void> = []
    // 选择敌人选项
    public selectEnemySelection (selectedUUID: string) {
        // 执行外部推送进来，在选择选项后执行的脚本。
        this.funcArrayAfterSetselectEnemySelection.forEach((ele) => { ele(selectedUUID) })
        // 清空外部推送进来的，在选择选项后执行的脚本。
        this.funcArrayAfterSetselectEnemySelection = []
        // 执行完后并关闭弹窗,清空弹窗内容。
        this.viewBox.enemySelectionSwitch.off()
        this.viewBox.setEnemySelection([])

        this.viewBox.update(this.viewDataForVue)
    }
    /**玩家关闭弹窗 */
    public closeEnemySelectionBox () {
        // 清空外部推送进来的，在选择选项后执行的脚本。
        this.funcArrayAfterSetselectEnemySelection = []
        // 清空弹窗内容。
        this.viewBox.setEnemySelection([])
        this.viewBox.enemySelectionSwitch.off()

        this.viewBox.update(this.viewDataForVue)
    }
    
    /**玩家选择道具 */
    public playerPickItem (uuid: string) {
        const item = this.affectPlayground()?.affectStage().affectItemCreator().affectItemArray().getItem(uuid)
        if (item) {
            this.affectPlayground()?.affectPlayer().affectItemArray().addItem(item)
        } else {
            console.log('no item, pick fail.')
        }

        this.viewBox.update(this.viewDataForVue)
    }

    /**打开game over 弹窗 */
    // public openGameOverBox () {
    //     this.viewBox.openGameOverJumpBox()
    //     this.viewList.ifShowGameOverJumpBox = this.viewBox.getIfShowGameOverJumpBox()
    // }

    private viewBox = new ViewBox(this)
    public affectViewBox () {
        return this.viewBox
    }
    private viewDataForVue: ViewDataForVue

    constructor (viewDataForVue: ViewDataForVue) {
        this.viewDataForVue = viewDataForVue
        console.log('viewDataForVue ===>', this.viewDataForVue)
    }
}