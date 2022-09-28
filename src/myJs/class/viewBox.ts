import type { Player } from "./actor/player"
import type { ViewDataForVue } from "./viewDataForVue"

export const VIEW_BOX_TEXT = {
    SELECT_OPPONENT: {
        title: '选择敌人',
        button: '取消',
    }
}

/**衔接返回的对手列表的object与提供给jumpBox的object，因为其中的key不一样，一个是name，一个是text */
export function turnNameToText (array: Array<{uuid: string, name: string}>): Array<{uuid: string, text: string}> {
    let res: Array<{uuid: string, text: string}> = []
    array.forEach((ele) => {
        const { uuid, name: text } = ele
        res.push({uuid, text})
    })
    return res
}

/**不要让vue渲染的数据在该box里赋值。该box只用于主动让vue的渲染数据从这里取值。 */
export class ViewBox {
    // 设置玩家初始属性模块
    /**判断是否打开玩家属性设置页面 */
    private ifShowPlayerSettingPage: boolean = false
    public openPlayerSettingPage () { this.ifShowPlayerSettingPage = true }
    public closePlayerSettingPage () { this.ifShowPlayerSettingPage = false }

    // 主要游戏内容的显示模块
    /**判断是否打开主要游戏页面 */
    private ifShowPlaygroundPage: boolean = false
    public openPlaygroundPage () { this.ifShowPlaygroundPage = true }
    public closePlaygroundPage () { this.ifShowPlaygroundPage = false }
    

    // 文字描述模块
    private textArray: Array<string> = []
    public pushText (text: string | null) {
        console.log('text from push of textBox ==>', text)
        if (text) {
            this.textArray.splice(0 , 0, text)
        } else {
            console.log('text is null')
        }
    }
    public getTextBox () { return this.textArray }

    // 场景内可拾取道具
    private stageItemArray: Array<{ uuid: string, name: string }> = []

    // 玩家操作选项模块
    private controlObject: ReturnType<Player['getControl']> | undefined
    public setControlArray (controlObject: ReturnType<Player['getControl']>) {
        this.controlObject = controlObject
    }
    public getControlObject () { return this.controlObject }

    // 弹窗题目
    private jumpBoxTitle: string | undefined

    // 玩家选择指向目标的弹窗模块
    private enemySelection: Array<{uuid: string, text: string}> = []
    public openEnemySelectionBox (enemySelection: Array<{uuid: string, text: string}>) { this.enemySelection = enemySelection }
    public closeEnemySelectionBox () { this.enemySelection = [] }

    // 游戏结束提示弹窗
    private gameOverJumpBoxObject = {
        title: '你死了',
        button: '重新开始'
    }
    private ifShowGameOverJumpBox: boolean = false
    public getIfShowGameOverJumpBox () {
        return this.ifShowGameOverJumpBox
    }
    public openGameOverJumpBox () {
        this.ifShowGameOverJumpBox = true
    }
    public closeGameOverJumpBox () {
        this.ifShowGameOverJumpBox = false
    }

    // 获取所有viewDataForVue所需的数据
    public get: () => ViewDataForVue = () => {
        return {
            ifShowPlayerSettingPage: this.ifShowPlayerSettingPage,
            ifShowPlaygroundPage: this.ifShowPlaygroundPage,
            textArray: this.textArray,
            controlObject: this.controlObject,
            stageItemArray: this.stageItemArray,
            jumpBoxTitle: this.jumpBoxTitle,
            enemySelection: this.enemySelection,
            ifShowGameOverJumpBox: this.ifShowGameOverJumpBox
        }
    }
}