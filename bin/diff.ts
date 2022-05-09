#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const progress = require('process');
const {
    generate_operate_list__single,
    generate_operate_list__group,
    generate_operate_list__overview
} = require("../index.js");

const write_into_file = (text: string) => {
    try {
        const filename = Date.now() + '.json'
        fs.writeFileSync(path.join(progress.cwd(), filename), text, { encoding: "utf8" })
        console.log(`output: ${ filename }`)
    }
    catch (e) {
        console.log('Error occurred when write into file.')
        console.log(e)
    }
}

/**
 * @description diff -s string1 string2
 * @description diff -f file1 file2
 */
const do_diff = () => {
    const flag = progress.argv[2]  // string | file
    const type = progress.argv[5] ?? '-line'  // -line; -single; -group
    const ifWrite = progress.argv[6]

    // string
    if(flag === '-s') {
        if(type === '-line') {
            const [ l1, l2 ] = generate_operate_list__overview(progress.argv[3] ?? '', progress.argv[4] ?? '')
            console.log('string: ', l1)
            console.log('labels: ', l2)
            if(ifWrite) {
                write_into_file(JSON.stringify({
                    string: l1,
                    labels: l2
                }, null, 4))
            }
        }
        else if(type === '-single') {
            const res = JSON.stringify(generate_operate_list__single(progress.argv[3] ?? '', progress.argv[4] ?? ''), null, 4)
            console.log(res)
            if(ifWrite) {
                write_into_file(res)
            }
        }
        else if(type === '-group') {
            const res = JSON.stringify(generate_operate_list__group(progress.argv[3] ?? '', progress.argv[4] ?? ''), null, 4)
            console.log(res)
            if(ifWrite) {
                write_into_file(res)
            }
        }
    }
    // file
    else if(flag === '-f') {
        let s1 = '', s2 = ''
        try {
            s1 = fs.readFileSync(path.join(progress.cwd(), progress.argv[3]), { encoding: 'utf-8' })
            s2 = fs.readFileSync(path.join(progress.cwd(), progress.argv[4]), { encoding: 'utf-8' })
        }
        catch (e) {
            console.log(e)
            return
        }

        if(type === '-line') {
            const [ l1, l2 ] = generate_operate_list__overview(s1, s2)
            console.log('string: ', l1)
            console.log('labels: ', l2)
            if(ifWrite) {
                write_into_file(JSON.stringify({
                    string: l1,
                    labels: l2
                }, null, 4))
            }
        }
        else if(type === '-single') {
            const res = JSON.stringify(generate_operate_list__single(s1, s2), null, 4)
            console.log(res)
            if(ifWrite) {
                write_into_file(res)
            }
        }
        else if(type === '-group') {
            const res = JSON.stringify(generate_operate_list__group(s1, s2), null, 4)
            console.log(res)
            if(ifWrite) {
                write_into_file(res)
            }
        }
    }
    // else
    else {
        console.log('usage:')
        console.log('template: diff <in_type> arg1 arg2 <out_type> <if_write_file>')
        console.log('string:   diff -s string1 string2 -line(default, alternative: -single | -group) <-w>')
        console.log('file:     diff -f path_to_file1 path_to_file2 -line(default, also: -single | -group) <-w>')
        console.log('\n\tin_type: [ -s | -f ] string or file as input')
        console.log('\targ1, arg2: string1/string2 or path_to_file1/path_to_file2')
        console.log('\tout_type: [ -line | -single | -group ] in-line / word-by-word / by-group')
        console.log('\tif_write_file: [ -w ](optional) if exists, the output will write into an file too.')
    }
}

do_diff()