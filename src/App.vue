<script setup lang="ts">
import { onMounted, ref, customRef, reactive, watch, computed, shallowReactive } from "vue";
import type { Ref, ComputedRef } from 'vue'
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import { Playground, User } from "./myJs/myTs";
import { useCounterStore } from "./stores/counter";

const store = useCounterStore()

let playground = reactive(new Playground(new User( 8, 8, 8, 8, 0, 8, [])))

playground.update() // 搞清楚ref和reactive的差别
playground.autoRun()

class TestObjectA {
  valA = {
    val: 100
  }

  valB = new Proxy(this.valA, {})

  addVal () {
    this.valA.val += 1
    console.log('valB ===>', this.valB)
  }
  constructor () {
  }
}

const testA = reactive(new TestObjectA())

// class TestObjectB {
//   testA: TestObjectA
//   valA: ComputedRef<number>

//   addVal () {
//     this.testA.addVal()
//     console.log('valA from tB ===>', this.valA)
    
//   }

//   constructor () {
//     this.testA = testA
//     this.valA = ref(this.testA.valB)
//   }
// }

// const testB = reactive(new TestObjectB())
// testB.testA.addVal()

let numberA = ref(1)
let numberB = computed(() => {
  return numberA.value + 2
})

function plusA () {
  numberA.value += 1
}

onMounted(() => {
  console.log('mounted here?')
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
    <div @click="testA.addVal">{{testA.valB.val}}</div>
    <div @click="plusA">{{numberB}}</div>
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
