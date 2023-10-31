import {B} from './a'

class A {
    constructor(){
        console.log(B)
        // console.log(get({},"123"))
    }
}

class C {
    constructor(){
        // console.log(get({},"123"))
    }
}

new A()