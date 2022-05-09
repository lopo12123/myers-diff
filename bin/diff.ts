#!/usr/bin/env node

const argv = require('process').argv;
const { generate_operate_list__single, generate_operate_list__group, generate_operate_list__overview } = require("../index.js");

/**
 * @description diff -s string1 string2
 * @description diff -f file1 file2
 */
const do_diff = () => {
    const flag = argv[2]  // string | file
    const type = argv[5] ?? '-line'  // -line; -single; -group

    // string
    if(flag === '-s' || flag === '--s' || flag === '-string' || flag === '--string') {
        if(type === '-line') {
            const [l1, l2] = generate_operate_list__overview(argv[3] ?? '', argv[4] ?? '')
            console.log('string: ', l1)
            console.log('labels: ', l2)
        }
        else if(type === '-single') {
            const res = generate_operate_list__single(argv[3] ?? '', argv[4] ?? '')
            console.log(JSON.stringify(res, null, 4))
        }
        else if(type === '-group') {
            const res = generate_operate_list__group(argv[3] ?? '', argv[4] ?? '')
            console.log(JSON.stringify(res, null, 4))
        }
    }
    // file
    else if(flag === '-f' || flag === '--f' || flag === '-file' || flag === '--file') {
        console.log('not support yet.')
    }
    // else
    else {
        console.log('usage:')
        console.log('[string]: diff -s(also: --s | -string | --string) string1 string2 -line(default, also: -single | -group)')
        console.log('[file]: diff -f(also: --f | -file | --file) path_to_file1 path_to_file2 -line(default, also: -single | -group)')
    }
}

do_diff()