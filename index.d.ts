/**
 * @description 操作的枚举映射
 */
declare const enum OPERATES {
    INSERT = 1,
    DELETE = 2,
    MOVE = 3
}
/**
 * @description 操作的label表示
 */
declare type OperateLabel = 'INSERT' | 'DELETE' | 'MOVE';
/**
 * @description 单个操作的封装
 */
declare type SingleOperate = {
    type: OPERATES;
    label: OperateLabel;
    char: string;
};
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
declare const operate_list: (prev: string, curr: string) => OPERATES[];
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
declare const generate_operate_list__single: (prev: string, curr: string) => SingleOperate[];
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
declare const generate_operate_list__group: (prev: string, curr: string) => SingleOperate[];
export { OPERATES, operate_list, generate_operate_list__single, generate_operate_list__group };
