/**
 * @description 操作的枚举映射
 */
const enum OPERATES {
    INSERT = 1,
    DELETE = 2,
    MOVE = 3,
}

/**
 * @description 操作的label表示
 */
type OperateLabel = 'INSERT' | 'DELETE' | 'MOVE'

/**
 * @description 单个操作的封装
 */
type SingleOperate = {
    type: OPERATES,
    label: OperateLabel
    char: string
}

/**
 * @description 获得按顺序执行的操作数组(数字标识)
 * @see generate_operate_list__single
 * @see generate_operate_list__group
 * @description `1: INSERT` - 从curr串中插入一个字符
 * @description `2: DELETE` - 删除prev串中的字符
 * @description `3: MOVE` - 复制prev中的字符(内容不变, 可能存在移位)
 * @param prev 原字符串
 * @param curr 现字符串
 * @example
 * const prev = "AABBCC"
 * const curr = "ABCABC"
 * const ops = operate_list(prev, curr)
 * console.log(ops)
 * // 输出:
 * [ 3, 1, 1, 3, 3, 2, 3, 2 ]
 * // 即:
 * [ 'MOVE', 'INSERT', 'INSERT', 'MOVE', 'MOVE', 'DELETE', 'MOVE', 'DELETE' ]
 */
const operate_list = (prev: string, curr: string): OPERATES[] => {
    const n = prev.length
    const m = curr.length
    const max = m + n
    const trace: { [k: number]: number }[] = []

    let x: number, y: number

    for (let d = 0; d <= max; d++) {
        let v: { [k: number]: number } = {}
        trace.push(v)

        if(d === 0) {
            let t = 0
            while (n > t && m > t && prev[t] === curr[t]) t++
            v[0] = t
            if(t === n && t === m) break
            continue
        }

        let lastV = trace[d - 1]

        for (let k = -d; k <= d; k += 2) {
            // 向下
            if(k === -d || (k !== d && lastV[k - 1] < lastV[k + 1])) x = lastV[k + 1]
            // 向右
            else x = lastV[k - 1] + 1

            y = x - k

            // 对角线处理
            while (x < n && y < m && prev[x] === curr[y]) {
                x += 1
                y += 1
            }

            v[k] = x

            if(x === n && y === m) {
                d = max
                break
            }
        }
    }

    // 反向回溯
    let operates: OPERATES[] = []
    x = n
    y = m
    let k: number, prevK: number, prevX: number, prevY: number

    for (let d = trace.length - 1; d > 0; d--) {
        k = x - y
        let lastV = trace[d - 1]

        if(k === -d || (k !== d && lastV[k - 1] < lastV[k + 1])) prevK = k + 1
        else prevK = k - 1

        prevX = lastV[prevK]
        prevY = prevX - prevK

        while (x > prevX && y > prevY) {
            operates.push(OPERATES.MOVE)
            x -= 1
            y -= 1
        }

        if(x === prevX) operates.push(OPERATES.INSERT)
        else operates.push(OPERATES.DELETE)

        x = prevX
        y = prevY
    }

    if(trace[0][0] !== 0) {
        for (let i = 0; i < trace[0][0]; i++) {
            operates.push(OPERATES.MOVE)
        }
    }

    return operates.reverse()
}

/**
 * @description 获得按顺序执行的操作数组(封装为单个操作对象)
 * @see generate_operate_list__group
 * @param prev 原字符串
 * @param curr 现字符串
 * @example
 * const prev = "AABBCC"
 * const curr = "ABCABC"
 * const ops = generate_operate_list__single(prev, curr)
 * console.log(ops)
 * // 输出:
 * [
 *   { type: 3, label: 'MOVE', char: 'A' },
 *   { type: 1, label: 'INSERT', char: 'B' },
 *   { type: 1, label: 'INSERT', char: 'C' },
 *   { type: 3, label: 'MOVE', char: 'A' },
 *   { type: 3, label: 'MOVE', char: 'B' },
 *   { type: 2, label: 'DELETE', char: 'B' },
 *   { type: 3, label: 'MOVE', char: 'C' },
 *   { type: 2, label: 'DELETE', char: 'C' }
 * ]
 */
const generate_operate_list__single = (prev: string, curr: string): SingleOperate[] => {
    const ops = operate_list(prev, curr)
    const res: SingleOperate[] = []

    let srcIndex = 0, dstIndex = 0

    ops.forEach((op) => {
        switch(op) {
            case OPERATES.INSERT:
                res.push({
                    type: op,
                    label: 'INSERT',
                    char: curr[dstIndex]
                })
                dstIndex += 1
                break
            case OPERATES.MOVE:
                res.push({
                    type: op,
                    label: 'MOVE',
                    char: prev[srcIndex]
                })
                srcIndex += 1
                dstIndex += 1
                break
            case OPERATES.DELETE:
                res.push({
                    type: op,
                    label: 'DELETE',
                    char: prev[srcIndex]
                })
                srcIndex += 1
                break
        }
    })

    return res
}
/**
 * @description 获得按顺序执行的操作数组(合并相邻的相同操作)
 * @see generate_operate_list__single
 * @param prev 原字符串
 * @param curr 现字符串
 * @example
 * const prev = "AABBCC"
 * const curr = "ABCABC"
 * const ops = generate_operate_list__group(prev, curr)
 * console.log(ops)
 * // 输出:
 * [
 *   { type: 3, label: 'MOVE', char: 'A' },
 *   { type: 1, label: 'INSERT', char: 'BC' },
 *   { type: 3, label: 'MOVE', char: 'AB' },
 *   { type: 2, label: 'DELETE', char: 'B' },
 *   { type: 3, label: 'MOVE', char: 'C' },
 *   { type: 2, label: 'DELETE', char: 'C' }
 * ]
 */
const generate_operate_list__group = (prev: string, curr: string): SingleOperate[] => {
    const ops = operate_list(prev, curr)
    const res: SingleOperate[] = []

    let srcIndex = 0, dstIndex = 0

    const labels: OperateLabel[] = [ 'INSERT', 'DELETE', 'MOVE' ]
    let lastOperate = ops[0], lastGroupedString = ''

    ops.forEach((op) => {
        if(lastOperate !== op) {
            res.push({
                type: lastOperate,
                label: labels[lastOperate - 1],
                char: lastGroupedString
            })
            lastOperate = op
            lastGroupedString = ''
        }

        switch(op) {
            case OPERATES.INSERT:
                lastGroupedString += curr[dstIndex]
                dstIndex += 1
                break
            case OPERATES.MOVE:
                lastGroupedString += prev[srcIndex]
                srcIndex += 1
                dstIndex += 1
                break
            case OPERATES.DELETE:
                lastGroupedString += prev[srcIndex]
                srcIndex += 1
                break
        }
    })
    res.push({
        type: lastOperate,
        label: labels[lastOperate - 1],
        char: lastGroupedString
    })

    return res
}

export {
    OPERATES,
    operate_list,
    generate_operate_list__single,
    generate_operate_list__group
}