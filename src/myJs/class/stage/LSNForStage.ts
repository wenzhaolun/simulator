import { randomEFA } from '@/myJs/class/commonFunc'
import { _AT, STAGE_BOX } from '@/myJs/static_data'
import { BasicData } from '@/myJs/class/basicData'
import type { Stage } from '@/myJs/class/stage/stage'
import type { TextBox } from '@/myJs/class/textBox'

/**专供给Stage的光、气味、噪声的BasicData */
export class LSNForStage extends BasicData {
    protected _data: BasicData['_data'] = 0
    /**场景类型 */
    private stageType: _AT._STAGE_TYPE
    /** 根据数值计算等级 */
    private calLevel (val: number): _AT._STAGE_DATA_LEVEL {
        const diff = this.totalDataMax - this.totalDataMin
        let res
        switch (true) { // 根据总数值计算级别
            case val <= diff / 4:
                res = _AT._STAGE_DATA_LEVEL.A
                break
            case val <= diff / 4 * 2:
                res = _AT._STAGE_DATA_LEVEL.B
                break
            case val <= diff / 4 * 3:
                res = _AT._STAGE_DATA_LEVEL.C
                break
            case val <= diff:
                res = _AT._STAGE_DATA_LEVEL.D
                break
            default:
                res = _AT._STAGE_DATA_LEVEL.A
                break
        }
        return res
    }
    /**场景数据类别 */
    private stageDataType: _AT._STAGE_DATA

    protected totalDataMin: BasicData['totalDataMin']
    protected totalDataMax: BasicData['totalDataMax']
    /**生成文字 */
    protected whenDataChange: BasicData['whenDataChange'] = (newVal: number, curVal: number) => {
        let newLevel: _AT._STAGE_DATA_LEVEL = this.calLevel(newVal)
        let currentLevel: _AT._STAGE_DATA_LEVEL = this.calLevel(curVal)
        if (this.ifDataNew) { // 检查是否是新开的场景，如果是新开的场景，使用完整描述句式。
            this.textBox.push(randomEFA(STAGE_BOX[this.stageType].data[this.stageDataType][_AT._STAGE_DATA_STATE.NEW][newLevel]))
            this.ifDataNew = false
        } else {
            if (newLevel > currentLevel) {
                this.textBox.push(randomEFA(STAGE_BOX[this.stageType].data[this.stageDataType][_AT._STAGE_DATA_STATE.INCREASE][newLevel]))
            }
            if (newLevel < currentLevel) {
                this.textBox.push(randomEFA(STAGE_BOX[this.stageType].data[this.stageDataType][_AT._STAGE_DATA_STATE.DECREASE][newLevel]))
            }
        }
    }

    constructor (
        textBox: TextBox,
        x: {
            stageDataType: LSNForStage['stageDataType'],
            totalDataMin: BasicData['totalDataMin'],
            totalDataMax: BasicData['totalDataMax'],
            stageType: ReturnType<Stage['getStageType']>
        }
    ) {
        super(textBox)
        this.stageDataType = x.stageDataType
        this.totalDataMin = x.totalDataMin
        this.totalDataMax = x.totalDataMax
        this.stageType = x.stageType
    }
}
