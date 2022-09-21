import { randomEFA, randomEnumKey, randomPlusValue, randomInitialValue } from '@/myJs/class/commonFunc'
import { _AT, STAGE_BOX, LIMIT } from '@/myJs/static_data'
import { LSNForStage } from '@/myJs/class/stage/LSNForStage'
import { ProgressForStage } from '@/myJs/class/stage/progressForStage'
import type { TextBox } from '@/myJs/class/textBox'

/**玩家和敌人活动的场景 */
export class Stage {
    private stageType: _AT._STAGE_TYPE = randomEnumKey(_AT._STAGE_TYPE)
    public getStageType (): _AT._STAGE_TYPE {
        return this.stageType
    }

    private stageState: _AT._STAGE_STATE

    /**亮度 */
    private light: LSNForStage
    public setLight ({uuid, val}: {uuid: string, val: number}) {
        this.light.setExtendData({
            uuid,
            val
        })
    }
    public removeLight (uuid: string) {
        this.light.removeExtendData(uuid)
    }

    /**气味 */
    private smell: LSNForStage
    public setSmell ({uuid, val}: {uuid: string, val: number}) {
        this.smell.setExtendData({
            uuid,
            val
        })
    }
    public addSmell ({uuid, val}: {uuid: string, val: number}) {
        this.smell.plusExtendData({
            uuid,
            val
        })
    }
    public removeSmell (uuid: string) {
        this.smell.removeExtendData(uuid)
    }

    /**总噪 */
    private noise: LSNForStage
    public setNoise ({uuid, val}: {uuid: string, val: number}) {
        this.noise.setExtendData({
            uuid,
            val
        })
    }
    public removeNoise (uuid: string) {
        this.noise.removeExtendData(uuid)
    }

    /**根据光、噪声、气味计算场景调查系数 */
    private getStageCondition () {
        const lightConditionRate = this.light.getConditionRate()
        const smellConditionRate = this.smell.getConditionRate()
        const noiseConditionRate = this.noise.getConditionRate()

        return lightConditionRate * smellConditionRate * noiseConditionRate
    }

    /**根据玩家和场景的属性，计算玩家调查的成果。 */
    private calSearchRes () {
        return randomPlusValue(0, LIMIT.stage.progress.each, LIMIT.stage.progress.eachPercent) * this.getStageCondition()
    }

    /** 场景当前的调查进度 */
    private progress: ProgressForStage
    public addProgress (uuid: string) {
        const val = this.calSearchRes()
        this.progress.plusExtendData({
            uuid,
            val
        })
    }
    public getIfProgressUpgrade () {
        return this.progress.getIfProgressUpgrade()
    }

    private textBox: TextBox
    
    public init () {
        this.textBox.push(randomEFA(STAGE_BOX[this.stageType].state[this.stageState]))

        this.light.setVal(randomInitialValue(LIMIT.stage.light.min, LIMIT.stage.light.max, LIMIT.stage.light.percent))

        this.smell.setVal(randomInitialValue(LIMIT.stage.smell.min, LIMIT.stage.smell.max, LIMIT.stage.smell.percent))

        this.noise.setVal(randomInitialValue(LIMIT.stage.noise.min, LIMIT.stage.noise.max, LIMIT.stage.noise.percent))
    }

    constructor (
        textBox: TextBox,
        stageState: _AT._STAGE_STATE
    ) {
        this.textBox = textBox

        this.stageState = stageState
    
        this.light = new LSNForStage(
            textBox,
            {
                stageDataType: _AT._STAGE_DATA.LIGHT,
                totalDataMin: 0,
                totalDataMax: 20,
                stageType: this.stageType
            }
        )
        this.smell = new LSNForStage(
            textBox,
            {
                stageDataType: _AT._STAGE_DATA.SMELL,
                totalDataMin: 0,
                totalDataMax: 20,
                stageType: this.stageType
            }
        )
        this.noise = new LSNForStage(
            textBox,
            {
                stageDataType: _AT._STAGE_DATA.NOISE,
                totalDataMin: 0,
                totalDataMax: 20,
                stageType: this.stageType
            }
        )
        this.progress = new ProgressForStage(
            textBox,
            {
                totalDataMin: 0,
                totalDataMax: 80,
                stageType: this.stageType
            }
        )
    }
}