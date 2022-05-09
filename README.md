### myers-diff

#### Install

npm `$ npm install myers-diff`  
yarn `$ yarm add myers-diff`

#### Cli

usage  
run `$ diff` to see help.  
`diff <in_type> arg1 arg2 <out_type> <if_write_file>`  
`diff -s string1 string2 -line(default, alternative: -single | -group) <-w>`  
`diff -f path_to_file1 path_to_file2 -line(default, also: -single | -group) <-w>`

args:  
`in_type`:  `-s` | `-f`; string or file as input  
`arg1, arg2`: `string1/string2` or `path_to_file1/path_to_file2`  
`out_type`:  `-line` | `-single` | `-group`; in-line / word-by-word / by-group  
`if_write_file`:  `-w` (optional); if exists, the output will write into a file too

#### APIs

---  

- `generate_operate_list__single(prev: string, curr: string): number[]`
    - diffs two string, comparing character by character.
    - return a list of number.
        - `1`: `INSERT` - insert a characters into `prev`
        - `2`: `DELETE` - delete a characters from `prev`
        - `3`: `MOVE` - the same characters as in `prev`, but the position(index) are not guaranteed to be the same

---  

- `generate_operate_list__single(prev: string, curr: string): {type: number, label: ('INSERT' | 'DELETE' | 'MOVE'), char: string}[]`
    - diffs two string, comparing character by character.
    - returns the operations performed in sequence, one for each operation.

---  

- `generate_operate_list__group(prev: string, curr: string): {type: number, label: ('INSERT' | 'DELETE' | 'MOVE'), char: string}[]`
    - diffs two string, comparing character by character.
    - returns operations performed sequentially, consecutive identical operations are merged.

---  

- `generate_operate_list__overview(prev: string, curr: string): [str_result: string, str_label: string]`
    - diffs two string, comparing character by character.
    - return a tuple with string in \[0\] and label(`+`/`-`/` `) in \[1\]  
