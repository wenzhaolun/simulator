import type { Player } from '@/myJs/class/actor/player'

export interface ViewList {    
    textList: Array<string>,
    controlList: ReturnType<Player['getControl']>,
    selectEnemyObject: { title: string | undefined, array: Array<{uuid: string, text: string}> } | undefined,
    stageItemList: Array<{ uuid: string, name: string }>
}