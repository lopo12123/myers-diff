"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_operate_list__overview = exports.generate_operate_list__group = exports.generate_operate_list__single = exports.operate_list = void 0;
/**
 * @description 获得按顺序执行的操作数组(数字标识)
 * @see generate_operate_list__single
 * @see generate_operate_list__group
 * @see generate_operate_list__overview
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
const operate_list = (prev, curr) => {
    const n = prev.length;
    const m = curr.length;
    const max = m + n;
    const trace = [];
    let x, y;
    for (let d = 0; d <= max; d++) {
        let v = {};
        trace.push(v);
        if (d === 0) {
            let t = 0;
            while (n > t && m > t && prev[t] === curr[t])
                t++;
            v[0] = t;
            if (t === n && t === m)
                break;
            continue;
        }
        let lastV = trace[d - 1];
        for (let k = -d; k <= d; k += 2) {
            // 向下
            if (k === -d || (k !== d && lastV[k - 1] < lastV[k + 1]))
                x = lastV[k + 1];
            // 向右
            else
                x = lastV[k - 1] + 1;
            y = x - k;
            // 对角线处理
            while (x < n && y < m && prev[x] === curr[y]) {
                x += 1;
                y += 1;
            }
            v[k] = x;
            if (x === n && y === m) {
                d = max;
                break;
            }
        }
    }
    // 反向回溯
    let operates = [];
    x = n;
    y = m;
    let k, prevK, prevX, prevY;
    for (let d = trace.length - 1; d > 0; d--) {
        k = x - y;
        let lastV = trace[d - 1];
        if (k === -d || (k !== d && lastV[k - 1] < lastV[k + 1]))
            prevK = k + 1;
        else
            prevK = k - 1;
        prevX = lastV[prevK];
        prevY = prevX - prevK;
        while (x > prevX && y > prevY) {
            operates.push(3 /* MOVE */);
            x -= 1;
            y -= 1;
        }
        if (x === prevX)
            operates.push(1 /* INSERT */);
        else
            operates.push(2 /* DELETE */);
        x = prevX;
        y = prevY;
    }
    if (trace[0][0] !== 0) {
        for (let i = 0; i < trace[0][0]; i++) {
            operates.push(3 /* MOVE */);
        }
    }
    return operates.reverse();
};
exports.operate_list = operate_list;
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
const generate_operate_list__single = (prev, curr) => {
    const ops = operate_list(prev, curr);
    const res = [];
    let srcIndex = 0, dstIndex = 0;
    ops.forEach((op) => {
        switch (op) {
            case 1 /* INSERT */:
                res.push({
                    type: op,
                    label: 'INSERT',
                    char: curr[dstIndex]
                });
                dstIndex += 1;
                break;
            case 3 /* MOVE */:
                res.push({
                    type: op,
                    label: 'MOVE',
                    char: prev[srcIndex]
                });
                srcIndex += 1;
                dstIndex += 1;
                break;
            case 2 /* DELETE */:
                res.push({
                    type: op,
                    label: 'DELETE',
                    char: prev[srcIndex]
                });
                srcIndex += 1;
                break;
        }
    });
    return res;
};
exports.generate_operate_list__single = generate_operate_list__single;
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
const generate_operate_list__group = (prev, curr) => {
    const ops = operate_list(prev, curr);
    const res = [];
    let srcIndex = 0, dstIndex = 0;
    const labels = ['INSERT', 'DELETE', 'MOVE'];
    let lastOperate = ops[0], lastGroupedString = '';
    ops.forEach((op) => {
        if (lastOperate !== op) {
            res.push({
                type: lastOperate,
                label: labels[lastOperate - 1],
                char: lastGroupedString
            });
            lastOperate = op;
            lastGroupedString = '';
        }
        switch (op) {
            case 1 /* INSERT */:
                lastGroupedString += curr[dstIndex];
                dstIndex += 1;
                break;
            case 3 /* MOVE */:
                lastGroupedString += prev[srcIndex];
                srcIndex += 1;
                dstIndex += 1;
                break;
            case 2 /* DELETE */:
                lastGroupedString += prev[srcIndex];
                srcIndex += 1;
                break;
        }
    });
    res.push({
        type: lastOperate,
        label: labels[lastOperate - 1],
        char: lastGroupedString
    });
    return res;
};
exports.generate_operate_list__group = generate_operate_list__group;
/**
 * @description 获得按顺序执行操作前后的比对串
 * @see operate_list
 * @param prev 原字符串
 * @param curr 现字符串
 * @example
 * const prev = "AABBCC"
 * const curr = "ABCABC"
 * const [str_result, str_label] = generate_operate_list__overview(prev, curr)
 * console.log(str_result)
 * console.log(str_label)
 */
const generate_operate_list__overview = (prev, curr) => {
    const ops = operate_list(prev, curr);
    let result = '';
    let label = '';
    let srcIndex = 0, dstIndex = 0;
    ops.forEach(op => {
        switch (op) {
            case 1 /* INSERT */:
                result += curr[dstIndex];
                label += '+';
                dstIndex += 1;
                break;
            case 3 /* MOVE */:
                result += prev[srcIndex];
                label += ' ';
                srcIndex += 1;
                dstIndex += 1;
                break;
            case 2 /* DELETE */:
                result += prev[srcIndex];
                label += '-';
                srcIndex += 1;
                break;
        }
    });
    return [result, label];
};
exports.generate_operate_list__overview = generate_operate_list__overview;