<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { Game } from "./myJs/class/game";
import { _ITEM_FUNC_TYPE } from "./myJs/class/item/static";
import type { ViewDataForVue } from "./myJs/class/viewDataForVue";
import PlayerSetting from '@/components/PlayerSetting.vue'
import EnemySelectionJumpBox from './components/EnemySelectionJumpBox.vue'
import Playground from './components/Playground.vue'
import FakeData from './components/fakeData.vue'
import TrueDataA from './components/trueDataA.vue'
import TrueDataB from './components/trueDataB.vue'

let viewDataForVue: ViewDataForVue = reactive({
  ifShowPlayerSettingPage: true,
  ifShowPlaygroundPage: false,
  textArray: [],
  controlObject: undefined,
  stageItemArray: [],
  jumpBoxTitle: undefined,
  enemySelection: [],
  ifShowGameOverJumpBox: false
})

let game = new Game(viewDataForVue)

class Data {
  fd: number = 0
  td: {
    a: number,
    b: number
  }

  public onlyPlusFd () {
    this.fd += 1
  }

  public onlyPlusTda () {
    this.td.a += 1
  }

  public onlyPlusTdb () {
    this.td.b += 1
  }

  public plus () {
    this.fd += 1
    this.td.a += 1
    this.td.b += 1
    console.log('fd ==>', this.fd)
  }

  constructor (td: { a: number, b: number }) {
    this.td = td
  }
}

let td = reactive({
  a: 0,
  b: 0
})

const data = new Data(td)

onMounted(() => {
  console.log('mounted here')
})

</script>

<template>
  <div>
    <div v-if="viewDataForVue.ifShowPlayerSettingPage">
      <PlayerSetting
      :if-show-player-setting-page="viewDataForVue.ifShowPlayerSettingPage"
      @start-game="(playerParams) => {game.start(playerParams)}">
      </PlayerSetting>
    </div>
    <div>
      <Playground
      :view-data-for-vue="viewDataForVue"
      @activate-player-control="(key) => { game.activatePlayerControl(key) }"
      @activate-player-item-func="(uuid, funcKey) => { game.activatePlayerItemFunc(uuid, funcKey) }"
      @player-pick-item="(uuid) => { game.playerPickItem(uuid) }"
      ></Playground>
    </div>
    <div>
      <EnemySelectionJumpBox
      :enemy-selection=viewDataForVue.enemySelection
      @select-selection="(selectedUUID) => {game.selectEnemySelection(selectedUUID)}"
      @close-jump-box="() => { game.closeEnemySelectionBox() }">
      </EnemySelectionJumpBox>
    </div>
    <div style="border: 2px solid purple;">
      <div>拆成组件</div>
      <FakeData :fd="data.fd"></FakeData>
      <TrueDataA :td="td"></TrueDataA>
      <TrueDataB :data="data"></TrueDataB>
    </div>
    <div>
      <div>test</div>
      <div>fake:{{data.fd}}</div>
      <div>trueA:{{td.a}}</div>
      <!-- <div>trueB:{{td.b}}</div> -->
      <div @click="data.plus">add</div>
      <div @click="data.onlyPlusFd">onlyPlusFd</div>
      <div @click="data.onlyPlusTda">onlyPlusTda</div>
      <div @click="data.onlyPlusTdb">onlyPlusTdb</div>
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
