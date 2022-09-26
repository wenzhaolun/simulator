<script setup lang="ts">
import { onMounted, reactive } from "vue"
import type { ViewList } from '@/myJs/class/viewList'
import { Playground } from '@/myJs/class/playground'
import { _ITEM_FUNC_TYPE } from "./myJs/class/item/static";



let viewList: ViewList = reactive({
  textList: [],
  controlList: {
    playerControl: [],
    itemControl: {
        [_ITEM_FUNC_TYPE.A]: [],
        [_ITEM_FUNC_TYPE.B]: []
    }
  },
  selectEnemyObject: undefined,
  stageItemList: []
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
      @click="playground.activatePlayerControl(ele.key)"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in viewList.controlList.itemControl[_ITEM_FUNC_TYPE.A]"
      @click="playground.activatePlayerItemFunc(ele.uuid, ele.key)"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in viewList.controlList.itemControl[_ITEM_FUNC_TYPE.B]"
      @click="playground.activatePlayerItemFunc(ele.uuid, ele.key)"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
    </div>
    <div style="border: 2px red solid">
      <div v-for="ele in viewList.stageItemList">
        <div @click="playground.playerPickItem(ele.uuid)">{{ele.name}}</div>
      </div>
    </div>
    <div style="border: 2px green solid">
      <div v-if="viewList.selectEnemyObject">
        <div>{{viewList.selectEnemyObject.title}}</div>
        <div>
          <div v-for="ele in viewList.selectEnemyObject.array">
            <div @click="playground.selectJumpBoxSelection(ele.uuid)">{{ele.text}}</div>
          </div>
        </div>
        <div @click="playground.closeJumpBox()">关闭</div>
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
