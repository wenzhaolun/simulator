import type { TextBox } from './textBox'

/**场景的基础属性的类
 * 这类属性有基础、扩展和合计，基础+扩展=合计
 * 扩展的值的变化触发合计的值的变化
 * 合计的值的变化触发相关描述文字的变化
 */
export abstract class BasicData {
    /**记录数据是否是新的，从而判断数据按新的或旧的来生成描述文字。 */
    protected ifDataNew: boolean = true
    protected abstract _data: number
    protected set data (n: number) {
        this._data = n

        this.totalData = this.sumData(n, this.extendData)
    }
    protected get data () {
        return this._data
    }
    public setVal (v: number) {
        this.data = v
    }
    /**获取属性的值 */
    public getVal () {
        return this.data
    }

    /**获取属性的好坏比率（超过上下限中间值的就是好，否则就是坏） */
    public getConditionRate () {
        return this.totalData / ((this.totalDataMax - this.totalDataMin) / 2)
    }

    protected _extendData: Array<{uuid: string, val: number}> = []
    protected set extendData (n: Array<{uuid: string, val: number}>) {
        this._extendData = n
        this.totalData = this.sumData(this.data, n)
    }
    protected get extendData () {
        return this._extendData
    }

    /**设置其他对象对属性的影响值。
     * 数值由包含id和数值两个变量的object形式存放在数列中，每个id对应一个其他外部对象（如玩家、敌人等）的对属性数值的影响。
     * 如果对应的id存在，即代表本来的数组里已经有相关对象留下的数值影响，此时不是往数组里添加新的object，而是修改原有的相关object。
     * */
    public setExtendData (x: {uuid: string, val: number}) {
        console.log('x from setExtendData ===>', x)

        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === x.uuid
        })

        if (index > -1) {
            temp[index].val = x.val
        } else {
            temp.splice(0, 0, x)
        }
        console.log('temp from setExtendData ===>', temp)
        this.extendData = temp
    }
    /**增加其他对象对属性的影响值。
     * 数值由包含id和数值两个变量的object形式存放在数列中，每个id对应一个其他外部对象（如玩家、敌人等）的对属性数值的影响。
     * 如果对应的id存在，即代表本来的数组里已经有相关对象留下的数值影响，此时不是往数组里添加新的object，而是修改原有的相关object。
     * */
    public plusExtendData (x: {uuid: string, val: number}) {
        console.log('x from setExtendData ===>', x)
        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === x.uuid
        })

        if (index > -1) {
            temp[index].val += x.val
        } else {
            temp.splice(0, 0, x)
        }

        this.extendData = temp
    }
    /** 删除其他对象对属性的整个影响值 */
    public removeExtendData (uuid: string) {
        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === uuid
        })

        if (index > -1) {
            temp.splice(index, 1)
            this.extendData = temp
        }
    }

    /** 减少其他对象对属性的整个影响值 */
    public minusExtendData (uuid: string, val: number) {
        const temp = this.extendData
        const index = temp.findIndex((ele) => {
            return ele.uuid === uuid
        })

        if (index > -1) {
            temp[index].val = temp[index].val - val
            this.extendData = temp
        }
    }

    protected _totalData: number = 0
    protected set totalData (val: number) {
        const newVal = val
        const curVal = this._totalData
        this.whenDataChange(newVal, curVal)
        this._totalData = val
    }
    protected get totalData () {
        return this._totalData
    }

    protected sumData (data: number, extendData: typeof this.extendData) {
        let res: number = 0
        let sumExtendData = 0
        console.log('extendData from sumData ===>', extendData)
        for (let i = 0; i < extendData.length; i++) {
            const ele = extendData[i]
            sumExtendData += ele.val
        }

        if (data + sumExtendData >= 0) {
            if (this.data + sumExtendData > this.totalDataMax) {
                res = this.totalDataMax
                console.log('res from sumDataA ===>', res)
            } else {
                res = this.data + sumExtendData
                console.log('res from sumDataB ===>', res)
            }
        } else {
            res = this.totalDataMin
            console.log('res from sumDataC ===>', res)
        }

        console.log('res from sumData ===>', res)
        return res
    }

    protected abstract readonly totalDataMin: number
    protected abstract readonly totalDataMax: number

    /** 根据属性的变化，分别计算出等级，并从相关文本样本里选出对应要显示的文字。 
    * @param newVal 当前属性的数值。
    * @param curVal 当前记录的属性的等级
    */
    protected abstract readonly whenDataChange: (newVal: number, curVal: number) => void
    /**推送文字的方法 */
    protected textBox: TextBox

    constructor (textBox: TextBox) {
        this.textBox = textBox
    }
}