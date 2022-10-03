import type { Player } from '@/script/game/actor'

/**只在Game 和 Playground里赋值 */
export interface ViewDataForVue {
    playerSetting: {
        switch: boolean
    },
    playgroundPage: {
        switch: boolean,
        textArray: Array<string>,
        controlObject: ReturnType<Player['getControl']> | undefined,
        stageItemArray: Array<{ uuid: string, name: string }>
    },
    enemySelectionJumpBox: {
        switch: boolean,
        enemySelection: Array<{uuid: string, text: string}>
    },
    gameOverJumpBox: {
        switch: boolean,
        content: string
    }
}