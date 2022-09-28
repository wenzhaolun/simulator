import { Playground } from "./playground";
import type { ViewDataForVue } from "./viewDataForVue";
import { turnNameToText, ViewBox } from "./viewBox";
import type { _PLAYER_CONTROL, _PLAYER_PARAMS } from "./actor/player/static";
import type { _ALLITEM_FUNC } from "./item/static";

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
        this.viewBox.closePlayerSettingPage()
        this.viewBox.openPlaygroundPage()
        
        this.updateViewDataForVue()
    }

    public fakeStart = () => {
        this.viewBox.closePlayerSettingPage()
        this.viewDataForVue = this.viewBox.get()
        console.log('viewDataForVue ==>', this.viewDataForVue)
    }

    public restart () {

    }

    /**触发玩家的操作 */
    public activatePlayerControl (key: _PLAYER_CONTROL) {
        this.affectPlayground()?.affectPlayer().activateControl(key)
        
        this.affectPlayground()?.nextRound()

        this.updateViewDataForVue()
    }
    /**触发玩家的道具功能 */
    public activatePlayerItemFunc (uuid: string, funcKey: _ALLITEM_FUNC) {
        const res = this.affectPlayground()?.affectPlayer().affectItemArray().useItem(uuid, funcKey)

        if (res === 1) {
            const affectPlayer = this.affectPlayground()?.affectPlayer()
            if (affectPlayer) {
                this.viewBox.openEnemySelectionBox(turnNameToText(affectPlayer.getAllOpponent()))
                this.funcArrayAfterSetselectEnemySelection.push((selsctedUUID) => { affectPlayer.selectOpponent(selsctedUUID) })
                this.funcArrayAfterSetselectEnemySelection.push(() => { affectPlayer.affectItemArray().useItem(uuid, funcKey) })
            }
        }

        this.updateViewDataForVue()
    }

    /**这些功能会在弹窗的选项被选择后执行。（selectEnemySelection里执行） */
    private funcArrayAfterSetselectEnemySelection: Array<(selectedUUID: string) => void> = []
    // 选择敌人选项
    public selectEnemySelection (selectedUUID: string) {
        // 执行完后并关闭弹窗,清空弹窗内容。
        this.viewBox.closeEnemySelectionBox()
        // 执行外部推送进来，在选择选项后执行的脚本。
        this.funcArrayAfterSetselectEnemySelection.forEach((ele) => { ele(selectedUUID) })
        // 清空外部推送进来的在选择选项后执行的脚本。
        this.funcArrayAfterSetselectEnemySelection = []

        this.updateViewDataForVue()
    }
    /**玩家关闭弹窗 */
    public closeEnemySelectionBox () {
        this.viewBox.closeEnemySelectionBox()
        this.updateViewDataForVue()
    }
    
    /**玩家选择道具 */
    public playerPickItem (uuid: string) {
        const item = this.affectPlayground()?.affectStage().affectItemCreator().affectItemArray().getItem(uuid)
        if (item) {
            this.affectPlayground()?.affectPlayer().affectItemArray().addItem(item)
        } else {
            console.log('no item, pick fail.')
        }

        this.updateViewDataForVue()
    }

    /**打开game over 弹窗 */
    // public openGameOverBox () {
    //     this.viewBox.openGameOverJumpBox()
    //     this.viewList.ifShowGameOverJumpBox = this.viewBox.getIfShowGameOverJumpBox()
    // }

    private viewBox = new ViewBox()
    public affectViewBox () {
        return {
            pushText: (text: string | null) => {
                this.viewBox.pushText(text)
            }
        }
    }
    private viewDataForVue: ViewDataForVue
    public updateViewDataForVue () {
        this.viewDataForVue = this.viewBox.get()
        console.log('viewDataForVue ===>', this.viewDataForVue)
    }

    constructor (viewDataForVue: ViewDataForVue) {
        this.viewDataForVue = viewDataForVue
        console.log('viewDataForVue ===>', this.viewDataForVue)
    }
}