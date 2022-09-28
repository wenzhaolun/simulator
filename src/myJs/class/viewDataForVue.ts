import type { Player } from '@/myJs/class/actor/player'

/**只在Game 和 Playground里赋值 */
export interface ViewDataForVue {
    ifShowPlayerSettingPage: boolean,
    ifShowPlaygroundPage: boolean,
    textArray: Array<string>,
    controlObject: ReturnType<Player['getControl']> | undefined,
    stageItemArray: Array<{ uuid: string, name: string }>,
    jumpBoxTitle: string | undefined,
    enemySelection: Array<{uuid: string, text: string}>,
    ifShowGameOverJumpBox: boolean
}