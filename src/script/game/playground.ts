import { Player } from '@/script/game/actor'
import { EnemyGroup } from './actor/enemy/enemyGroup'
import { Stage } from '@/script/game/stage'
import type { _PLAYER_CONTROL } from './actor/player/static'
import { _STAGE_STATE } from './stage/static'
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
            },
            gameOver: () => {
                return this.game.gameOver()
            }
        }
    }

    public nextRound () {
        this.enemyGroup.randomAction()
        console.log('msg from nextRound')
        if (Math.random() >= 0.7) {
            this.stage.affectItemCreator().createRandomItem()
        }
    }

    

    /**初始化 */
    public init () {
        this.stage.init()
        this.player.init()
    }

    constructor (
        game: Game,
        x: {
            hpMax: number,
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