<script setup lang="ts">
import type { ViewDataForVue } from '@/script/viewDataForVue';
import { onMounted } from 'vue';

const props = defineProps<{
    gameOverJumpBox: ViewDataForVue['gameOverJumpBox']
}>()

const emit = defineEmits<{
    (event: 'restart'): void
}>()


onMounted(()=> {
    
})

</script>

<template>
    <div v-if="props.gameOverJumpBox.switch" style="border: 2px green solid" class="jump-box">
    <div class="content">
        <div style="margin-bottom: 24px;">你死了</div>
        <div @click="emit('restart')" style="width: 80%; font-weight: bold; text-align: center; border: 2px black solid">重新游戏</div>
    </div>
    </div>
</template>

<style scoped>
.jump-box{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 99;
  box-sizing: border-box;
  padding: 28px;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.jump-box .content{
    width: 80%;
    height: 24%;
    box-sizing: border-box;
    border: 4px rgb(255, 255, 255, 0.7) solid;
    background-color: rgba(255, 0, 0, 0.7);
    font-size: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
        