export { _STAGE_TYPE, _STAGE_STATE } from "./static"

import { BasicData, randomEFA, randomEnumKey, randomInitialValue, randomPlusValue } from '../common'
import { ItemCreator } from "../actor"
import type { Playground } from '../playground'
import { calAndWriteForLSN, calAndWriteForProgress, STAGE_BOX, STAGE_EVENT, STAGE_LIMIT, _DETECT_TYPE, _STAGE_DATA, _STAGE_STATE, _STAGE_TYPE } from './static'

/**玩家和敌人活动的场景 */
export class Stage {
    /**场景id */
    private uuid: string = crypto.randomUUID()
    /**场景是否已经被经过第一轮描述 */
    private ifStageWrited: boolean = false
    public getIfStageWrited () {
        return this.ifStageWrited
    }
    /**场景类型 */
    private stageType: _STAGE_TYPE = randomEnumKey(_STAGE_TYPE)
    /**场景所处整个游戏过程的状态（可以理解成阶段） */
    private stageState: _STAGE_STATE
    private getNextStageState () {
        let nextStageState: _STAGE_STATE | undefined
        switch (this.stageState) {
            case _STAGE_STATE.START:
                nextStageState = _STAGE_STATE.HALFWAY
                break
            case _STAGE_STATE.HALFWAY:
                nextStageState = _STAGE_STATE.END
                break
            case _STAGE_STATE.END:
                nextStageState = undefined
                break
        }
        return nextStageState
    }
    /**调查事件类型 */
    private detectType: _DETECT_TYPE = randomEnumKey(_DETECT_TYPE)
    /**场景所在的游玩空间 */
    private playground: Playground
    public affectPlayground = () => {
        return this.playground
    }

    /**亮度 */
    private light = new BasicData(0, 20)
    public affectLight = () => {
        return {
            set: (uuid: string, val: number) => { this.light.set(uuid, val) },
            plus: (uuid: string, val: number) => { this.light.plus(uuid, val) },
            minus: (uuid: string, val: number) => { this.light.minus(uuid, val) },
            remove: (uuid: string) => { this.light.remove(uuid) }
        }
    }
    /**气味 */
    private smell = new BasicData(0, 20)
    public affectSmell = () => {
        return {
            set: (uuid: string, val: number) => { this.smell.set(uuid, val) },
            plus: (uuid: string, val: number) => { this.smell.plus(uuid, val) },
            minus: (uuid: string, val: number) => { this.smell.minus(uuid, val) },
            remove: (uuid: string) => { this.smell.remove(uuid) }
        }
    }
    /**噪声 */
    private noise = new BasicData(0, 20)
    public affectNoise = () => {
        return {
            set: (uuid: string, val: number) => { this.noise.set(uuid, val) },
            plus: (uuid: string, val: number) => { this.noise.plus(uuid, val) },
            minus: (uuid: string, val: number) => { this.noise.minus(uuid, val) },
            remove: (uuid: string) => { this.noise.remove(uuid) }
        }
    }

    /**场景当前的调查进度 */
    private progress = new BasicData(0, 80)
    /**增加场景的进度 */
    public addProgress = (uuid: string, playerSans: number) => {
        const lightConditionRate = this.light.getConditionRate()
        const smellConditionRate = this.smell.getConditionRate()
        const noiseConditionRate = this.noise.getConditionRate()
        const rate = lightConditionRate * (smellConditionRate + noiseConditionRate)
        const val = (playerSans + randomPlusValue(0, STAGE_LIMIT.progress.each, STAGE_LIMIT.progress.eachPercent)) * rate
        this.progress.plus(uuid, val)
    }

    private itemCreator: ItemCreator
    public affectItemCreator = () => {
        return this.itemCreator
    }
    
    public init () {
        this.affectPlayground().affectGame().affectViewBox().pushText(randomEFA(STAGE_BOX[this.stageType].state[this.stageState]))
        this.light.set(this.uuid, randomInitialValue(STAGE_LIMIT.light.min, STAGE_LIMIT.light.max, STAGE_LIMIT.light.percent))
        this.smell.set(this.uuid, randomInitialValue(STAGE_LIMIT.smell.min, STAGE_LIMIT.smell.max, STAGE_LIMIT.smell.percent))
        this.noise.set(this.uuid, randomInitialValue(STAGE_LIMIT.noise.min, STAGE_LIMIT.noise.max, STAGE_LIMIT.noise.percent))

        this.ifStageWrited = true
    }

    constructor (
        playground: Playground,
        stageState: _STAGE_STATE
    ) {
        this.playground = playground
        this.stageState = stageState
        this.itemCreator = new ItemCreator(playground)
        
        const {getIfStageWrited, ...commonParams} = {
            getIfStageWrited: () => { return this.getIfStageWrited() },
            pushText: (text: string) => {this.affectPlayground().affectGame().affectViewBox().pushText(text)},
            stageType: this.stageType
        }

        this.light.addWDCF((newVal, curVal, min, max) => {
            calAndWriteForLSN({...commonParams, getIfStageWrited, dataType: _STAGE_DATA.LIGHT, newVal, curVal, min, max})
        })

        this.smell.addWDCF((newVal, curVal, min, max) => {
            calAndWriteForLSN({...commonParams, getIfStageWrited, dataType: _STAGE_DATA.SMELL, newVal, curVal, min, max})
        })

        this.noise.addWDCF((newVal, curVal, min, max) => {
            calAndWriteForLSN({...commonParams, getIfStageWrited, dataType: _STAGE_DATA.NOISE, newVal, curVal, min, max})
        })

        this.progress.addWDCF((newVal, curVal, min, max) => {
            calAndWriteForProgress({...commonParams, detectType: this.detectType, newVal, curVal, min, max})
        })
        this.progress.addWDCF(() => {
            if (Math.random() * this.light.getConditionRate() >= 0.7) {
                this.itemCreator.createRandomItem()
            }
        })
        this.progress.addWDCF((newVal, curVal, min, max) => {
            if (newVal >= max) {
                const nextStageState = this.getNextStageState()
                if (nextStageState) {
                    commonParams.pushText(randomEFA(STAGE_EVENT.leave))
                    this.playground.affectStage().setNextStage(nextStageState)
                } else {
                    commonParams.pushText(randomEFA(STAGE_EVENT.win))
                    this.playground.affectGame().gameOver().win()
                }
            }
        })
    }
}
