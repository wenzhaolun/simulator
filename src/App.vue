<script setup lang="ts">
import { onMounted, reactive, ref} from "vue"

import { Playground, TextBox } from "./myJs/class/myTs"

let textBox = reactive(new TextBox())

let playground = new Playground(
  textBox,  
  {
    hp: 8,
    atk: 8,
    def: 8,
    sans: 8
  }
)

let textList = reactive(playground.textBox.textArray)

playground.init()

// playground.autoRun()

// test start

class TA {
  private val: number = 0
  private tb: TB

  addVal () {
    this.tb.addVal()
  }

  constructor (tb: TB) {
    this.tb = tb
  }
}

class TB {
  _val: number = 0
  set val (v: number) {
    this._val = v
    this.tc.val += 1
  }
  get val () {
    return this._val
  }

  tc: TC

  addVal () {
    this.val += 1
  }

  constructor (tc: TC) {
    this.tc = tc
  }
}

class TC {
  val: number = 0
}

class TD {
  ta: TA
  tb: TB
  tc: TC

  add () {
    this.ta.addVal()
  }

  get () {
    return this.tc.val
  }

  constructor () {
    this.tc = new TC()
    this.tb = new TB(this.tc)
    this.ta = new TA(this.tb)
  }
}

const td = reactive(new TD())

// test end

onMounted(() => {
  console.log('mounted here?')
})

</script>

<template>
  <div>
    <div>
      <div
      v-for="ele in playground.getPlayerControl().playerControl"
      @click="playground.activatePlayerControl({key: ele.key})"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in playground.getPlayerControl().itemControl[0]"
      @click="playground.activatePlayerControl({uuid: ele.uuid, key: ele.key})"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in playground.getPlayerControl().itemControl[1]"
      @click="playground.activatePlayerControl({uuid: ele.uuid, key: ele.key})"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
    </div>
    <div v-for="ele in textList">
      {{ ele }}
    </div>
    <div @click="td.add">{{td.get()}}</div>
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
