import { randomEFA, randomEnumKey } from '@/myJs/class/commonFunc'
import { _AT, STAGE_BOX } from '@/myJs/static_data'
import { BasicData } from '@/myJs/class/basicData'
import type { Stage } from '@/myJs/class/stage/stage'
import type { TextBox } from '@/myJs/class/textBox'

/**场景探索进度数据 */
export class ProgressForStage extends BasicData {
    protected _data: number = 0
    /**调查事件类型 */
    private detectType: _AT._DETECT_TYPE = randomEnumKey(_AT._DETECT_TYPE)
    private stageType: ReturnType<Stage['getStageType']>
    /** 场景的搜寻进度是否升级？(用于判断是否随机生成道具，升级的时候不生成道具。) */
    private ifProgressUpgrade: boolean = false
    public getIfProgressUpgrade () {
        return this.ifProgressUpgrade
    }
    /** 根据数值计算等级 */
    private calStateForProgress (val: number): _AT._DETECT_STATE {
        let res: _AT._DETECT_STATE
            switch (true) { // 根据总数值计算级别
                case val <= this.totalDataMax / 2:
                    res = _AT._DETECT_STATE.START
                    break
                case val < this.totalDataMax:
                    res = _AT._DETECT_STATE.HALFWAY
                    break
                case val >= this.totalDataMax:
                    res = _AT._DETECT_STATE.END
                    break
                default:
                    res = _AT._DETECT_STATE.START
                    break
            }
        return res
    }
    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    /**生成文字 */
    protected whenDataChange: BasicData['whenDataChange'] = (newVal: number, curVal: number) => {
        console.log('newVal from progress ===>', newVal)
        if (curVal === 0) {
            this.textBox.push(randomEFA(STAGE_BOX[this.stageType].detect[this.detectType][_AT._DETECT_STATE.START]))
        } else {
            const newState: _AT._DETECT_STATE = this.calStateForProgress(newVal)
            const curState: _AT._DETECT_STATE = this.calStateForProgress(curVal)

            const res: _AT._DETECT_STATE = newState === curState ? _AT._DETECT_STATE.CONTINUE : newState
            console.log('stageType ===>', this.stageType, 'detectType ===>', this.detectType, 'res ===>', res)
            this.textBox.push(randomEFA(STAGE_BOX[this.stageType].detect[this.detectType][res]))
        }
    }

    constructor (
        textBox: TextBox,
        x: {
            totalDataMin: ProgressForStage['totalDataMin'],
            totalDataMax: ProgressForStage['totalDataMax'],
            stageType: ProgressForStage['stageType']
        }
    ) {
        super(textBox)
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
        this.stageType = x.stageType
    }
}