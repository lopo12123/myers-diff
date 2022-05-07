### myers-diff

#### Install

npm `$ npm install myers-diff`  
yarn `$ yarm add myers-diff`

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
