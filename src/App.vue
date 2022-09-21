<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { _AT } from '@/myJs/static_data'
import type { ViewList } from '@/myJs/class/viewList'
import { Playground } from '@/myJs/class/playground'



let viewList: ViewList = reactive({
  textList: [],
  controlList: {
    playerControl: [],
    itemControl: {
        [_AT._ITEM_FUNC_TYPE.A]: [],
        [_AT._ITEM_FUNC_TYPE.B]: []
    }
  }
})

let playground = new Playground(
  viewList,
  {
    hp: 8,
    atk: 8,
    def: 8,
    sans: 8
  }
)
playground.init()


// playground.autoRun()

onMounted(() => {
  console.log('mounted here? ==>', viewList)
})

</script>

<template>
  <div>
    <div>
      <div
      v-for="ele in viewList.controlList.playerControl"
      @click="playground.activatePlayerControl({key: ele.key})"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in viewList.controlList.itemControl[_AT._ITEM_FUNC_TYPE.A]"
      @click="playground.activatePlayerControl({uuid: ele.uuid, key: ele.key})"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in viewList.controlList.itemControl[_AT._ITEM_FUNC_TYPE.B]"
      @click="playground.activatePlayerControl({uuid: ele.uuid, key: ele.key})"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
    </div>
    <div v-for="ele in viewList.textList">
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
