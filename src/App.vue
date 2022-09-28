<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { Game } from "./myJs/class/game";
import { _ITEM_FUNC_TYPE } from "./myJs/class/item/static";
import type { ViewDataForVue } from "./myJs/class/viewDataForVue";
import PlayerSetting from '@/components/PlayerSetting.vue'
import EnemySelectionJumpBox from './components/EnemySelectionJumpBox.vue'
import Playground from './components/Playground.vue'

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

onMounted(() => {
  console.log('mounted here')
})

</script>

<template>
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
  <div @click="game.fakeStart()">test</div>
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
