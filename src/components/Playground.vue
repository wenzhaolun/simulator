<script setup lang="ts">
import type { _PLAYER_CONTROL } from '@/myJs/class/actor/player/static';
import { _ITEM_FUNC_TYPE, type _ALLITEM_FUNC } from '@/myJs/class/item/static';
import type { ViewDataForVue } from '@/myJs/class/viewDataForVue';
import { onMounted } from 'vue';
const props = defineProps<{
    viewDataForVue: ViewDataForVue
}>()

const emit = defineEmits<{
  (event: 'activatePlayerControl', key: _PLAYER_CONTROL): void,
  (event: 'activatePlayerItemFunc', uuid: string, funcKey: _ALLITEM_FUNC): void,
  (event: 'playerPickItem', uuid: string): void
}>()

onMounted(()=> {
    
})

</script>

<template>
    <div v-if="props.viewDataForVue.ifShowPlaygroundPage">
    <div>
      <div
      v-for="ele in props.viewDataForVue.controlObject?.playerControl"
      @click="emit('activatePlayerControl', ele.key)"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in props.viewDataForVue.controlObject?.itemControl[_ITEM_FUNC_TYPE.A]"
      @click="emit('activatePlayerItemFunc', ele.uuid, ele.key)"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
      <div
      v-for="ele in props.viewDataForVue.controlObject?.itemControl[_ITEM_FUNC_TYPE.B]"
      @click="emit('activatePlayerItemFunc', ele.uuid, ele.key)"
      style="border: 2px black solid;"
      >
        <div>{{ele.name}}</div>
        <div>{{ele.intro}}</div>
      </div>
    </div>
    <div style="border: 2px red solid">
      <div v-for="ele in props.viewDataForVue.stageItemArray">
        <div @click="emit('playerPickItem', ele.uuid)">{{ele.name}}</div>
      </div>
    </div>
    <div v-for="ele in props.viewDataForVue.textArray">
      {{ ele }}
    </div>
  </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
    text-align: left;
    }
}
</style>
    