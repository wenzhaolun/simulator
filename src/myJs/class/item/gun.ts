import { Item } from '@/myJs/class/item/item'
import { _ITEM_TYPE, _GUN_FUNC, ITEM_BOX, _ITEM_USE_STATE } from './static'

export class Gun extends Item {
    protected itemType: _ITEM_TYPE = _ITEM_TYPE.GUN
    public getName: () => string = () => {
        return ITEM_BOX[_ITEM_TYPE.GUN].name
    }
    private atk: number = 6
    protected _dur = 6
    protected funcBox = {
        [_GUN_FUNC.SHOOT]: {
            checkIfShow: () => { return this.affectItemArray().affectUser().getOpponentAmount() > 0 },
            ifNeedOrient: () => { return !this.affectItemArray().affectUser().getIfHaveOpponentUUID() },
            func: async () => {
                const opponent = this.affectItemArray().affectUser().getOpponentAndClearUUID()
                if (opponent) {
                    this.affectItemArray().affectUser().affectPlayground().affectGame().affectViewBox().pushText(ITEM_BOX[_ITEM_TYPE.GUN].funcBox[_GUN_FUNC.SHOOT].describe)
                    opponent.affectHp().minus(this.uuid, this.atk)
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