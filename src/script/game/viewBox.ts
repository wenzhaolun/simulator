import type { Player } from "./actor"
import type { Game } from "./game"
import type { ViewDataForVue } from "@/script/viewDataForVue"

/**衔接返回的对手列表的object与提供给jumpBox的object，因为其中的key不一样，一个是name，一个是text */
export function turnNameToText (array: Array<{uuid: string, name: string}>): Array<{uuid: string, text: string}> {
    let res: Array<{uuid: string, text: string}> = []
    array.forEach((ele) => {
        const { uuid, name: text } = ele
        res.push({uuid, text})
    })
    return res
}

enum VIEW_BOX_DATA {
    PLAYER_SETTING_PAGE_SWITCH,
    PLAYGROUND_PAGE_SWITCH,
    TEXT_ARRAY,
    ENEMY_SELECTION_SWITCH,
    ENEMY_SELECTION,
    GAME_OVER_JUMP_BOX_SWITCH,
    GAME_OVER_TEXT,
    STAGE_ITEM_ARRAY,
    CONTROL_OBJECT
}

class UpdatedDataArray {
    private array: Array<VIEW_BOX_DATA> = []
    public push (data: VIEW_BOX_DATA) {
        const index = this.array.findIndex((ele) => ele === data )
        if (index < 0) { this.array.push(data) }
    }
    public get () { return this.array }
}

class Switch {
    private dataType: VIEW_BOX_DATA
    private updatedDataArray: UpdatedDataArray
    private _switch: boolean
    private set switch (x: boolean) {
        this._switch = x
        this.updatedDataArray.push(this.dataType)
    }
    private get switch () { return this._switch }
    public get () { return this.switch }
    public on () { this.switch = true }
    public off () { this.switch = false }

    constructor (dataType: VIEW_BOX_DATA, updatedDataArray: UpdatedDataArray, initialVal: boolean) {
        this.dataType = dataType
        this.updatedDataArray = updatedDataArray
        this._switch = initialVal
    }
}

/**不要让vue渲染的数据在该box里赋值。该box只用于主动让vue的渲染数据从这里取值。 */
export class ViewBox {
    private game: Game
    private updatedDataArray = new UpdatedDataArray()
    // 直接赋值类------开始
    // 设置玩家初始属性模块
    /**判断是否打开玩家属性设置页面 */
    public readonly playerSettingPageSwitch = new Switch(VIEW_BOX_DATA.PLAYER_SETTING_PAGE_SWITCH, this.updatedDataArray, false)

    // 主要游戏内容的显示模块
    /**判断是否打开主要游戏页面 */
    public readonly playgroundPageSwitch = new Switch(VIEW_BOX_DATA.PLAYGROUND_PAGE_SWITCH, this.updatedDataArray, false)

    // 文字描述模块
    private textArray: Array<string> = []
    public pushText (text: string | null) {
        if (text) {
            this.textArray.unshift(text)
            this.updatedDataArray.push(VIEW_BOX_DATA.TEXT_ARRAY)
        } else {
            console.log('text is null')
        }
    }
    public clearText () {
        this.textArray = []
        this.updatedDataArray.push(VIEW_BOX_DATA.TEXT_ARRAY)
    }

    // 玩家选择指向目标的弹窗模块
    public readonly enemySelectionSwitch = new Switch(VIEW_BOX_DATA.ENEMY_SELECTION_SWITCH, this.updatedDataArray, false)

    private enemySelection: Array<{uuid: string, text: string}> = []
    public setEnemySelection (enemySelection: Array<{uuid: string, text: string}>) {
        this.enemySelection = enemySelection
        this.updatedDataArray.push(VIEW_BOX_DATA.ENEMY_SELECTION)
    }
    

    // 游戏结束的弹窗模块
    public readonly gameOverJumpBoxSwitch = new Switch(VIEW_BOX_DATA.GAME_OVER_JUMP_BOX_SWITCH, this.updatedDataArray, false)
    private gameOverText: string = ''
    public winGameOver () {
        this.gameOverText = '你赢了'
        this.updatedDataArray.push(VIEW_BOX_DATA.GAME_OVER_TEXT)
    }
    public failGameOver () {
        this.gameOverText = '你死了'
        this.updatedDataArray.push(VIEW_BOX_DATA.GAME_OVER_TEXT)
    }
    // 直接赋值类------结束

    // computed类--开始
    // 场景内可拾取道具
    private computeStageItemArray (): Array<{ uuid: string, name: string }> {
        let res: Array<{ uuid: string, name: string }> = []
        const playground = this.game.affectPlayground()
        if (playground) {
            res = playground.affectStage().affectItemCreator().affectItemArray().getItemArray()
        }
        return res
    }
    public callStageItemArrayUpdate () { this.updatedDataArray.push(VIEW_BOX_DATA.STAGE_ITEM_ARRAY) }

    // 玩家操作选项模块
    private computeControlObject (): ReturnType<Player['getControl']> | undefined {
        let res: ReturnType<Player['getControl']> | undefined
        res = this.game.affectPlayground()?.affectPlayer().getControl()
        return res
    }
    public callControlObjectUpdate () { this.updatedDataArray.push(VIEW_BOX_DATA.CONTROL_OBJECT) }
    // computed类------结束


    // 更新相关需要更新的viewDataForVue属性
    public update (viewDataForVue: ViewDataForVue) {
        const updatedDataArray = this.updatedDataArray.get()
        updatedDataArray.forEach((ele) => {
            switch (ele) {
                case VIEW_BOX_DATA.PLAYER_SETTING_PAGE_SWITCH:
                    viewDataForVue.playerSetting.switch = this.playerSettingPageSwitch.get()
                    break
                case VIEW_BOX_DATA.PLAYGROUND_PAGE_SWITCH:
                    viewDataForVue.playgroundPage.switch = this.playgroundPageSwitch.get()
                    break
                case VIEW_BOX_DATA.TEXT_ARRAY:
                    viewDataForVue.playgroundPage.textArray = this.textArray
                    break
                case VIEW_BOX_DATA.ENEMY_SELECTION_SWITCH:
                    viewDataForVue.enemySelectionJumpBox.switch = this.enemySelectionSwitch.get()
                    break
                case VIEW_BOX_DATA.ENEMY_SELECTION:
                    viewDataForVue.enemySelectionJumpBox.enemySelection = this.enemySelection
                    break
                case VIEW_BOX_DATA.GAME_OVER_JUMP_BOX_SWITCH:
                    viewDataForVue.gameOverJumpBox.switch = this.gameOverJumpBoxSwitch.get()
                    break
                case VIEW_BOX_DATA.GAME_OVER_TEXT:
                    viewDataForVue.gameOverJumpBox.content = this.gameOverText
                    break
                case VIEW_BOX_DATA.STAGE_ITEM_ARRAY:
                    viewDataForVue.playgroundPage.stageItemArray = this.computeStageItemArray()
                    break
                case VIEW_BOX_DATA.CONTROL_OBJECT:
                    viewDataForVue.playgroundPage.controlObject = this.computeControlObject()
                    break
            }
        })
    }

    constructor (game: Game) {
        this.game = game
    }
}