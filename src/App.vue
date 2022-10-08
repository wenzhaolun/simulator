<script setup lang="ts">
import { onMounted, reactive } from "vue"

import type { ViewDataForVue } from "./script/viewDataForVue";
import { Game } from "@/script/game";

import PlayerSetting from '@/components/PlayerSetting.vue'
import Playground from './components/Playground.vue'
import EnemySelectionJumpBox from './components/EnemySelectionJumpBox.vue'
import GameOverJumpBox from './components/GameOverJumpBox.vue'

let viewDataForVue: ViewDataForVue = reactive({
  playerSetting: {
    switch: true
  },
  playgroundPage: {
    switch: false,
    textArray: [],
    controlObject: undefined,
    stageItemArray: []
  },
  enemySelectionJumpBox: {
    switch: false,
    enemySelection: []
  },
  gameOverJumpBox: {
    switch: false,
    content: ''
  }
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
  <div class="box">
    <PlayerSetting
    :player-setting="viewDataForVue.playerSetting"
    @start-game="(playerParams) => {game.start(playerParams)}">
    </PlayerSetting>
    <Playground
    :playground-page="viewDataForVue.playgroundPage"
    @activate-player-control="(key) => { game.activatePlayerControl(key) }"
    @activate-player-item-func="(uuid, funcKey, type) => { game.activatePlayerItemFunc(uuid, funcKey, type) }"
    @player-pick-item="(uuid) => { game.playerPickItem(uuid) }"
    ></Playground>
    <EnemySelectionJumpBox
    :enemy-selection-jump-box="viewDataForVue.enemySelectionJumpBox"
    @select-selection="(selectedUUID) => {game.selectEnemySelection(selectedUUID)}"
    @close-jump-box="() => { game.closeEnemySelectionBox() }">
    </EnemySelectionJumpBox>
    <GameOverJumpBox
    :game-over-jump-box="viewDataForVue.gameOverJumpBox"
    @restart="() => { game.restart() }">
    </GameOverJumpBox>
  </div>
</template>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>
