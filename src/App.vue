<script setup lang="ts">
import { onMounted, ref, customRef, reactive, watch, computed, shallowReactive } from "vue";
import type { Ref, ComputedRef } from 'vue'
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import { Playground, Player } from "./myJs/myTs";
import { useCounterStore } from "./stores/counter";

let playground = reactive(new Playground(new Player( 8, 8, 8, 8, 0, 8, [])))

playground.init()
playground.update() // 搞清楚ref和reactive的差别
playground.autoRun()

// object test start

interface Val {
  a: number
  b: number
  c: number
}

class TestObjectA {
  private _valA: Val = {
    a: 1,
    b: 2,
    c: 0
  }
  private set valA (val: Val) {
    this._valA = val
    this._valA.c += 1
  }
  private get valA () {
    return this._valA
  }

  addVal () {
    let temp = this.valA
    temp.a += 1
    this.valA = temp
    console.log('valA ===>', this.valA)
  }

  getTestA () {
    return this.valA
  }
}

class TestObjectB {
  private _testA: TestObjectA
  private set testA (val: TestObjectA) {
    this._testA = val
  }
  private get testA () {
    return this._testA
  }

  private _valB: Val = {
    a: 1,
    b: 2,
    c: 0
  }
  private set valB (val: Val) {
    this._valB = val
    this._valB.c += 1
    this.testA.addVal()
    this.testA.addVal()
  }
  private get valB () {
    return this._valB
  }

  addVal () {
    let temp = this.valB
    temp.b += 1
    this.valB = temp
    console.log('valB ===>', this.valB)
  }

  getTestB () {
    return this.valB
  }

  constructor (testA: TestObjectA) {
    this._testA = new Proxy(testA, {})
  }
}

class TestW {
  testA: TestObjectA = new TestObjectA()

  testB: TestObjectB = new TestObjectB(this.testA)

  addVal () {
    this.testB.addVal()
  }

  getRes () {
    return ['开始啦！', `testA.a的值是${this.testA.getTestA().a}`, `testA.a加了${this.testA.getTestA().c}次`, `testB.b的值是${this.testB.getTestB().b}`, `testB.b加了${this.testB.getTestB().c}次`]
  }

  bindA (ta: TestObjectA) {
    this.testA = new Proxy(ta, {})
  }

  bindB (tb: TestObjectB) {
    this.testB = new Proxy(tb, {})
  }

  constructor () {
  }
}

class Set {
  testA: TestObjectA
  testB: TestObjectB
  testW: TestW

  getSetRes () {
    // console.log('ifGetRes? ===>', this.testA.getTestA().c + this.testB.getTestB().c)
    // if (this.testA.getTestA().c + this.testB.getTestB().c >= 0) {
    //   return this.testW.getRes()
    // }
    return this.testW.getRes()
  }

  addVal () {
    this.testB.addVal()
  }

  constructor () {
    this.testA = new TestObjectA()
    this.testB = new TestObjectB(this.testA)
    this.testW = new TestW()
    this.testW.bindA(this.testA)
    this.testW.bindB(this.testB)
  }
}

const set = reactive(new Set())

// object test end

// other object test start

// class TestPA {
//   list: Array<string> = ['string A']

//   bind (tc: TestPC) {
//     this.list = new Proxy(tc.list, {})
//   }

//   pushString () {
//     this.list.push('stringA')
//   }
// }

// class TestPB {
//   list: Array<string> = ['string B']

//   bind (tc: TestPC) {
//     this.list = new Proxy(tc.list, {})
//   }

//   pushString () {
//     this.list.push('stringB')
//   }
// }

// class TestPC {
//   list: Array<string> = ['string C']

//   pushString () {
//     this.list.push('stringC')
//   }
// }

// class TestPD {
//   tA: TestPA = new TestPA()
//   tB: TestPB = new TestPB()
//   tC: TestPC = new TestPC()

//   pushString () {
//     this.tA.pushString()
//     this.tB.pushString()
//   }

//   constructor () {
//     this.tA.bind(this.tC)
//     this.tB.bind(this.tC)
//   }
// }

// let tD = reactive(new TestPD())

// other object test end

// other object test start

// class TestPA {
//   tC: TestPC = new TestPC()

//   bind (tc: TestPC) {
//     this.tC = new Proxy(tc, {})
//   }

//   pushString () {
//     this.tC.list.push('stringA')
//   }
// }

// class TestPB {
//   tC: TestPC = new TestPC()

//   bind (tc: TestPC) {
//     this.tC = new Proxy(tc, {})
//   }

//   pushString () {
//     this.tC.list.push('stringB')
//   }
// }

// class TestPC {
//   list: Array<string> = ['string C']

//   pushString () {
//     this.list.push('stringC')
//   }
// }

// class TestPD {
//   tA: TestPA = new TestPA()
//   tB: TestPB = new TestPB()
//   tC: TestPC = new TestPC()

//   pushString () {
//     this.tA.pushString()
//     this.tB.pushString()
//   }

//   constructor () {
//     this.tA.bind(this.tC)
//     this.tB.bind(this.tC)
//   }
// }

// let tD = reactive(new TestPD())

// other object test end

// other object test start

// interface TList {
//   val: Array<string>,
//   func: Function
// }

// class TestPA {
//   list: TList = {
//     val: ['stringA'],
//     func: function () {
//       this.val.push('stringA')
//     }
//   }

//   bind (tc: TestPC) {
//     this.list = new Proxy(tc.list, {})
//   }
// }

// class TestPB {
//   list: TList = {
//     val: ['stringB'],
//     func: function () {
//       this.val.push('stringB')
//     }
//   }

//   bind (tc: TestPC) {
//     this.list = new Proxy(tc.list, {})
//   }
// }

// class TestPC {
//   list: TList = {
//     val: ['stringC'],
//     func: function () {
//       this.val.push('stringC')
//     }
//   }

//   outSidePushString () {
//     this.list.val.push('stringC outSide')
//   }
// }

// class TestPD {
//   tA: TestPA = new TestPA()
//   tB: TestPB = new TestPB()
//   tC: TestPC = new TestPC()

//   pushString () {
//     this.tA.list.func()
//     this.tB.list.func()
//   }

//   constructor () {
//     this.tA.bind(this.tC)
//     this.tB.bind(this.tC)
//   }
// }

// let tD = reactive(new TestPD())

// other object test end

// object test end

// 反向proxy测试开始

interface RVal {
  str: Array<string>,
  num: number
}

class RA {
  val: RVal = {
    str: ['stringA'],
    num: 0
  }

  pushString () {
    this.val.str.push('stringA')
  }
}

class RB {
  val: RVal = {
    str: ['stringA'],
    num: 0
  }

  _oval: number = 0
  set oval (val: number) {
    this._oval = val
    this.pushString()
  }
  get oval () {
    return this._oval
  }

  bind (val: RVal) {
    this.val = new Proxy (val, {})
  }

  pushString () {
    this.val.str.push('stringB')
  }

  addOval () {
    this.oval += 1
  }
}

class RC {
  ra: RA = new RA()
  rb: RB = new RB()

  getRAString () {
    return this.ra.val.str
  }

  pushStringToRa () {
    this.ra.pushString()
  }

  constructor () {
    this.rb.bind(this.ra.val)
  }
}

let rc = reactive(new RC())

// 反向proxy测试结束

onMounted(() => {
  console.log('mounted here?')
})

</script>

<template>
  <div>
    <div v-for="ele in playground.showControl()">
      <div @click="playground.myControl(ele.uuid)">{{ele.name}}</div>
    </div>
    <div v-for="ele in playground.textBox.textBoxVal.textArray">
      {{ ele }}
    </div>
    <div v-for="ele in set.testW.testA">
      <div @click="set.testA.addVal()">{{ele}}</div>
    </div>
    <!-- 第一种情况，不能更新。 -->
    <!-- <div v-for="ele in tD.tA.list">
      <div @click="tD.tC.pushString">{{ele}}</div>
    </div> -->
    <!-- proxy里直接代理整个类，能更新。 -->
    <!-- <div v-for="ele in tD.tA.tC.list">
      <div @click="tD.tC.pushString">{{ele}}</div>
    </div> -->
    <!-- proxy里直接代理里面的某个object，能更新。 -->
    <!-- <div v-for="ele in tD.tA.list.val">
      <div @click="tD.tC.outSidePushString">{{ele}}</div>
    </div> -->
    <!-- 反向proxy尝试更新 -->
    <div v-for="ele in rc.ra.val.str">
      <div @click="rc.rb.addOval">{{ele}}</div>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
