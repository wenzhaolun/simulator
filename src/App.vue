<script setup lang="ts">
import { onMounted, ref, customRef, reactive, watch, computed, shallowReactive } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import { Playground, User } from "./myJs/myTs";
import { useCounterStore } from "./stores/counter";

const store = useCounterStore()

let playground = reactive(new Playground(new User( 8, 8, 8, 8, 0, 8, [])))

playground.update() // 搞清楚ref和reactive的差别
playground.autoRun()

class TestA {
  _a: Array<string> = ['a', 'b', 'c']
  set a (val: Array<string>) {
    console.log('set a ===>', val)
    this._a = val
  }
  get a () {
    return this._a
  }

}

class TestB {
  testA: TestA
  a: Array<string> = ['a']

  b: Array<string> = ['b']
  

  pushToAB () {
    this.testA.a.push('pbb')
    console.log('a ===>', this.a)
    console.log('b ===>', this.b)
  }

  constructor () {
    this.testA = new TestA()
    this.a = new Proxy(this.b, {})
  }
}

let testB = new TestB()
let testBR = reactive(testB)



onMounted(() => {
  console.log('mount here?')
})

</script>

<template>
  <div>
    <div v-for="ele in playground.showControl()">
      <div @click="playground.myControl(ele.uuid)">{{ele.name}}</div>
    </div>
    <div v-for="ele in playground.getTextArray()">
      {{ ele }}
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
