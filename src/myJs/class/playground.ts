import { Player } from '@/myJs/class/actor/player'

import { Stage } from '@/myJs/class/stage/stage'
import type { _PLAYER_CONTROL } from './actor/player/static'

import { _STAGE_STATE } from './stage/static'

import { EnemyGroup } from './actor/enemy/enemyGroup'
import type { _ALLITEM_FUNC } from './item/static'
import type { Game } from './game'

export class Playground { // 包含整个游戏所有内容的总控制
    private stage: Stage
    public affectStage () {
        return {
            affectLight: this.stage.affectLight,
            affectSmell: this.stage.affectSmell,
            affectNoise: this.stage.affectNoise,
            addProgress: this.stage.addProgress,
            affectItemCreator: this.stage.affectItemCreator,
            setNextStage: (stageState: _STAGE_STATE) => {
                this.stage = new Stage(this, stageState)
                this.stage.init()
            }
        }
    }
    private player: Player
    public affectPlayer () {
        return this.player  
    }
    
    private enemyGroup: EnemyGroup
    public affectEnemyGroup () {
        return this.enemyGroup
    }

    private game: Game
    public affectGame () {
        return {
            affectViewBox: () => {
                return this.game.affectViewBox()
            }
        }
    }

    public nextRound () {
        this.affectEnemyGroup().randomAction()
    }

    

    /**初始化 */
    public init () {
        this.stage.init()
    }

    constructor (
        game: Game,
        x: {
            hp: number,
            atk: Player['atk'],
            def: Player['def'],
            sans: Player['sans']
        }
    ) {
        this.game = game
        this.player = new Player(this, x)

        this.stage = new Stage(this, _STAGE_STATE.START)

        this.enemyGroup = new EnemyGroup(this)
    }
}