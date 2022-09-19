<script setup lang="ts">
import { onMounted, reactive, ref} from "vue"

import { Playground } from "./myJs/myTs"

let playground = reactive(new Playground({
  hp: 8,
  atk: 8,
  def: 8,
  sans: 8
}))

playground.init()

// playground.autoRun()

onMounted(() => {
  console.log('mounted here?')
})

</script>

<template>
  <div>
    <div>
      <div v-for="ele in playground.getPlayerControl().playerControl" @click="playground.activatePlayerControl({key: ele.key})" style="border: 2px black solid;">
        <div>{{ele.intro}}</div>
        <div>{{ele.name}}</div>
      </div>
      <div v-for="ele in playground.getPlayerControl().itemControl[0]" @click="playground.activatePlayerControl({uuid: ele.uuid, key: ele.key})" style="border: 2px black solid;">
        <div>{{ele.intro}}</div>
        <div>{{ele.name}}</div>
      </div>
      <div v-for="ele in playground.getPlayerControl().itemControl[1]" @click="playground.activatePlayerControl({uuid: ele.uuid, key: ele.key})" style="border: 2px black solid;">
        <div>{{ele.intro}}</div>
        <div>{{ele.name}}</div>
      </div>
    </div>
    <div v-for="ele in playground.getTextList()">
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
