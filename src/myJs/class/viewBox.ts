import type { Player } from "./actor/player"

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

    // 玩家操作选项模块
    private controlObject: ReturnType<Player['getControl']> | undefined
    public setControlArray (controlObject: ReturnType<Player['getControl']>) {
        this.controlObject = controlObject
    }
    public getControlObject () { return this.controlObject }

    // 玩家选择指向目标的弹窗模块
    private jumpBoxObject: { title: string | undefined, array: Array<{uuid: string, text: string}> } | undefined
    public setJumpBoxObject (jumpBoxObject: { title: string, array: Array<{uuid: string, text: string}>}) {
        this.jumpBoxObject = jumpBoxObject
    }
    public getJumpBoxObject () { return this.jumpBoxObject }
    private funcArrayAfterJumpBoxSelected: Array<(selectedUUID: string) => void> = []
    /**向弹窗推送功能，这些功能会在弹窗的选项被选择后执行。（selectJumpBoxSelection里执行） */
    public pushFuncToAJBS ( func: ( selectedUUID: string ) => void ) { this.funcArrayAfterJumpBoxSelected.push(func) }
    // 用这个测试下箭头函数的特性
    public selectJumpBoxSelection (selectedUUID: string) {
        // 执行完后并关闭弹窗,清空弹窗内容。
        this.jumpBoxObject = undefined
        // 执行外部推送进来，在选择选项后执行的脚本。
        this.funcArrayAfterJumpBoxSelected.forEach((ele) => { ele(selectedUUID) })
        // 清空外部推送进来的在选择选项后执行的脚本。
        this.funcArrayAfterJumpBoxSelected = []
    }
    /**只关闭，不选择。原定在选择后执行的功能也不执行并直接清空。 */
    public closeJumpBox () {
        // 执行完后并关闭弹窗,清空弹窗内容。
        this.jumpBoxObject = undefined
        // 清空外部推送进来的在选择选项后执行的脚本。
        this.funcArrayAfterJumpBoxSelected = []
    }
}