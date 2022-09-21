import type { Player } from '@/myJs/class/actor/player'

export interface ViewList {    
    textList: Array<string>
    controlList: ReturnType<Player['getControl']>
}