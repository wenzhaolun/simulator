/**编辑数据的方式的类型 */
export enum EDIT_TYPE {
    /**设定值 */
    SET,
    /**加 */
    PLUS,
    /**减 */
    MINUS,
    /**除去某个对象的所有编辑记录 */
    REMOVE
}

/**数据内的组成部分 */
interface BASICDATA_CHILD {
    uuid: string,
    type: EDIT_TYPE,
    val: number
}

function deepCopy (array: Array<BASICDATA_CHILD>): Array<BASICDATA_CHILD> {
    return JSON.parse(JSON.stringify(array))
}

/**场景的基础属性的类
 * 这类属性有基础、扩展和合计，基础+扩展=合计
 * 扩展的值的变化触发合计的值的变化
 * 合计的值的变化触发相关描述文字的变化
 */
export class BasicData {
    /**记录数据是否是新的，从而判断数据按新的或旧的来生成描述文字。 */
    private ifDataNew: boolean = true
    /**最小值 */
    protected readonly min: number
    /**最大值 */
    protected readonly max: number
    public get = {
        val: () => {
            return this.calData(this.data)
        },
        max: () => {
            return this.max
        }
    }
    /**根据数据内的子数据，计算数据的值。 */
    private calData (d: Array<BASICDATA_CHILD>): number {
        console.log('d form cal ===>', d)
        let res: number = 0
        const temp = d
        temp.forEach((ele) => {
            switch (ele.type) {
                case EDIT_TYPE.SET:
                    res = ele.val
                    break
                case EDIT_TYPE.PLUS:
                    res += ele.val
                    break
                case EDIT_TYPE.MINUS:
                    res += -ele.val
                    break
            }
        })

        return res
    }

    protected _data: Array<BASICDATA_CHILD> = []
    protected set data (d: Array<BASICDATA_CHILD>) {       
        console.log('d and _data ===>', d, this._data) 
        const curVal = this.calData(this._data)
        console.log(`curVal is ${curVal}`)
        const newVal = this.calData(d)

        console.log('newVal === curVal ?', newVal === newVal)
        if (curVal === newVal) {
            console.log('new = cur')
        }
        

        console.log('newVal and curVal before wdc ==>', newVal, curVal)

        this.whenDataChange(newVal, curVal)
        this._data = d
        if (this.ifDataNew) { this.ifDataNew = false }
    }
    protected get data () { return this._data }

    /**获取数据的值 */
    public getDataVal () {
        return this.calData(this.data)
    }

    /**
     * 直接设置数据的值
     * @param uuid 发生编辑行为的对象的id
     * @param val 编辑的值
     */
    public set (uuid: string, val: number) {
        const temp = deepCopy(this.data)
        const child = {
            uuid,
            type: EDIT_TYPE.SET,
            val
        }
        temp.push(child)

        this.data = temp
    }

    /**
     * 为数据加一个值
     * @param uuid 发生编辑行为的对象的id
     * @param val 编辑的值
     */
    public plus (uuid: string, val: number) {
        console.log('msg from plus ==>', val)
        const temp = deepCopy(this.data)
        console.log('temp ==>', temp)
        const child = {
            uuid,
            type: EDIT_TYPE.PLUS,
            val
        }
        temp.push(child)

        this.data = temp
    }

    /**
     * 为数据减一个值
     * @param uuid 发生编辑行为的对象的id
     * @param val 编辑的值
     */
    public minus (uuid: string, val: number) {
        const temp = deepCopy(this.data)
        const child = {
            uuid,
            type: EDIT_TYPE.MINUS,
            val
        }
        temp.push(child)

        this.data = temp
    }

    /**
     * 为数据减一个值
     * @param uuid 发生编辑行为的对象的id
     * @param val 编辑的值
     */
     public remove (uuid: string) {
        const tempA = deepCopy(this.data)
        const tempB = deepCopy(this.data)
        for (let i = 0; i < tempA.length; i++) {
            if (tempA[i].uuid === uuid) {
                tempB.splice(i, 1)
            }
        }
        this.data = tempB
    }

    /**该数组内的功能将由index为0开始，由whenDataChange执行 */
    private whenDataChangeFuncArray: Array<(newVal: number, curVal: number, min: number, max: number) => void> = []
    /** 根据属性的新旧值，执行相关功能（该function发生在data被正式赋值前）。 
    * @param newVal 属性即将更新的合计数值
    * @param curVal 当前记录的属性的合计数值
    */
    private whenDataChange (newVal: number, curVal: number) {
        console.log('newVal ==>', newVal, 'curVal ===>', curVal)
        this.whenDataChangeFuncArray.forEach((ele) => { ele(newVal, curVal, this.min, this.max) })
    }
    /**
     * 增加在数据变化时要执行的功能（发生在data被正式赋值前）
     * @param func 需要在数据变化时执行的功能（发生在data被正式赋值前）
     */
    public addWDCF (func: (newVal: number, curVal: number, min: number, max: number) => void) {
        this.whenDataChangeFuncArray.push(func)
    }

    /**
     * 获取属性的好坏比率（超过上下限中间值的就是好，否则就是坏）
     * 值的可能范围是0-1
     * */
    public getConditionRate () {
        return this.calData(this.data) / ((this.max + this.min) / 2)
    }

    constructor (min: number, max: number) {
        this.min = min
        this.max = max
    }
}
