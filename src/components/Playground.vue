<script setup lang="ts">

import type { ViewDataForVue } from '@/script/viewDataForVue';
import { _PLAYER_CONTROL, _ITEM_FUNC_TYPE, type _ALLITEM_FUNC } from '@/script/game';
import { onMounted } from 'vue';

const props = defineProps<{
  playgroundPage: ViewDataForVue['playgroundPage']
}>()

const emit = defineEmits<{
  (event: 'activatePlayerControl', key: _PLAYER_CONTROL): void,
  (event: 'activatePlayerItemFunc', uuid: string, funcKey: _ALLITEM_FUNC, type: _ITEM_FUNC_TYPE): void,
  (event: 'playerPickItem', uuid: string): void
}>()

onMounted(()=> {
    
})

</script>

<template>
  <div v-if="props.playgroundPage.switch" class="child">
    <div class="text-box">
      <div v-for="ele in props.playgroundPage.textArray" class="text">{{ ele }}</div>
    </div>
    <div class="control-box">
      <div class="a">
        <div class="title">回合行动</div>
        <div style="height: calc(50% - 15px); overflow: scroll; border-bottom: 2px black solid;">
          <div v-for="ele in props.playgroundPage.controlObject?.playerControl"
          @click="emit('activatePlayerControl', ele.key)"
          class="section">
            <div>{{ele.name}}</div>
          </div>
        </div>
        <div style="height: calc(50% - 15px); overflow: scroll;">
          <div v-for="ele in props.playgroundPage.controlObject?.itemControl[_ITEM_FUNC_TYPE.A]"
          @click="emit('activatePlayerItemFunc', ele.uuid, ele.key, _ITEM_FUNC_TYPE.A)"
          class="section">
            <div>{{ele.name}}</div>
          </div>
        </div>
      </div>
      <div class="b">
        <div class="title">普通行动</div>
        <div style="height: calc(50% - 15px); border-bottom: 2px black solid; color: rgb(78 218 0) !important; overflow: scroll;">
          <div style="border-bottom: 2px black solid">可拾取的道具(点击)</div>
          <div v-for="ele in props.playgroundPage.stageItemArray" style="border-bottom: 2px black solid">
            <div @click="emit('playerPickItem', ele.uuid)">{{ele.name}}</div>
          </div>
        </div>
        <div style="color: rgb(230 0 0) !important;">
          <div style="border-bottom: 2px black solid">使用道具</div>
          <div style="height: calc(50% - 15px); overflow: scroll;">
            <div v-for="ele in props.playgroundPage.controlObject?.itemControl[_ITEM_FUNC_TYPE.B]"
            @click="emit('activatePlayerItemFunc', ele.uuid, ele.key, _ITEM_FUNC_TYPE.B)"
            style="border: 2px black solid; font-size: 16px;">
              <div>{{ele.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.child {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  padding: 28px;
  text-align: center;
  font-size: 18px;
  position: absolute;
  z-index: 97;
}

.text-box {
  width: 100%;
  height: 64%;
  box-sizing: border-box;
  overflow: scroll;
  display: flex;
  flex-direction: column-reverse;
}

.text {
  width: 96%;
  box-sizing: border-box;
  margin: 6px 0;
  border-bottom: 2px rgba(182, 182, 182, 0.6) solid;
}

.control-box {
  width: 100%;
  height: calc(36% - 28px);
  margin-top: 28px;
  display: flex;
}

.control-box .a {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  border: 2px black solid;
}

.control-box .b {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  border: 2px black solid;
}

.control-box .title {
  width: 100%;
  height: 30px;
  font-size: 22px;
  font-weight: bold;
  border-bottom: 2px black solid;
}

.control-box .section {
  font-size: 20px;
  color: rgb(0, 153, 255);
  border-bottom: 2px black solid;
}
</style>
    