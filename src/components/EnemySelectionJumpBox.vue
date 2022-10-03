<script setup lang="ts">
import type { ViewDataForVue } from '@/script/viewDataForVue';
import { onMounted } from 'vue';

const props = defineProps<{
  enemySelectionJumpBox: ViewDataForVue['enemySelectionJumpBox']
}>()

const emit = defineEmits<{
  (event: 'selectSelection', uuid: string): void,
  (event: 'closeJumpBox'): void
}>()


onMounted(()=> {
  
})

</script>

<template>
  <div v-if="props.enemySelectionJumpBox.switch" class="child">
    <div class="jump-box">
      <div style="height: 36px; font-size: 24px; border-bottom: 2px rgb(0, 132, 255) solid; box-sizing: border-box;">选择敌人</div>
      <div style="height: calc(100% - 72px); border-bottom: 2px rgb(0, 132, 255) solid;">
        <div v-for="ele in props.enemySelectionJumpBox.enemySelection" style="height: 28px; border-bottom: 2px rgb(0, 132, 255) solid;">
          <div @click="emit('selectSelection', ele.uuid)">{{ele.text}}</div>
        </div>
      </div>
      <div style="height: 36px; font-size: 24px; box-sizing: border-box;" @click="emit('closeJumpBox')">关闭</div>
    </div>
  </div>
</template>

<style scoped>
.child{
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  z-index: 98;
  box-sizing: border-box;
  text-align: center;
}

.child .jump-box{
  width: 60%;
  height: 200px;
  min-height: 40%;
  max-height: 60%;
  border: 4px rgb(0, 132, 255) solid;
  background-color: aliceblue;
  box-sizing: border-box;
}
</style>
    