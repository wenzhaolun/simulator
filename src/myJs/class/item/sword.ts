import { Item } from '@/myJs/class/item/item'
import { ITEM_BOX, _GUN_FUNC, _ITEM_TYPE, _SWORD_FUNC } from './static'
import { turnNameToText, VIEW_BOX_TEXT } from '../viewBox'

export class Sword extends Item {
    protected itemType: Item['itemType'] = _ITEM_TYPE.SWORD
    public getName: () => string = () => {
        return ITEM_BOX[_ITEM_TYPE.SWORD].name
    }
    private atk: number = 3

    protected _dur: Item['_dur'] = 6
    protected funcBox: Item['funcBox'] = {
        [_SWORD_FUNC.ATTACK]: {
            checkIfShow: () => { return this.affectItemArray().affectUser().getOpponentAmount() > 0  },
            ifNeedOrient: () => { return !this.affectItemArray().affectUser().getIfHaveOpponentUUID() },
            func: () => {
                const opponent = this.affectItemArray().affectUser().getOpponentAndClearUUID()
                if (opponent) {
                    this.affectItemArray().affectUser().affectPlayground().affectGame().affectViewBox().pushText(ITEM_BOX[_ITEM_TYPE.SWORD].funcBox[_SWORD_FUNC.ATTACK].describe)
                    const user = this.affectItemArray().affectUser()
                    const sumAtk = user.affectHp().getDataVal() * 0.1 * (user.affectAtk().getAtk() + this.atk)
                    opponent.affectHp().minus(this.uuid, sumAtk)
                }
            }
        }
    }

    constructor (
        itemArray: Item['itemArray']
    ) {
        super(itemArray)
    }
}