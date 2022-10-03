/** 根据最大值，随机获取0-最大值的整数。 */
export function randomNumber (max: number) {
    return Math.round(Math.random() * max)
}

/** randomEleFromArray，在数组里随机抽气一个ele。 */
export function randomEFA<T>(array: Array<T>): T {
    return array[randomNumber(array.length - 1)]
}

export function randomEnumKey (x: object) {
    const temp = Object.keys(x)
    return randomNumber((temp.length / 2) - 1)
}

/**根据最大值和最小值，还有保底百分比，计算随机初始值。
 * @param min 最小值
 * @param max 最大值
 * @param percent 保底百分比
*/
export function randomInitialValue (min: number, max: number, percent: number) {
    const diff = max - min
    return randomNumber(diff * (1 - percent)) + diff * percent + min
}

/**根据最大值和最小值，还有保底百分比，计算随机增加值。
 * @param min 最小值
 * @param max 最大值
 * @param eachPercent 保底百分比
*/
export function randomPlusValue (min: number, max: number, eachPercent: number) {
    const diff = max - min
    return randomNumber(diff * eachPercent)
}