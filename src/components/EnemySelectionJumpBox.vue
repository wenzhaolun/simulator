<script setup lang="ts">
import type { ViewDataForVue } from '@/myJs/class/viewDataForVue';
import { onMounted } from 'vue';

const props = defineProps<{
  enemySelection: ViewDataForVue['enemySelection']
}>()

const emit = defineEmits<{
  (event: 'selectSelection', uuid: string): void,
  (event: 'closeJumpBox'): void
}>()


onMounted(()=> {
  
})

</script>

<template>
  <div v-if="props.enemySelection.length > 0" style="border: 2px green solid">
    <div>
      <div>选择敌人</div>
      <div>
        <div v-for="ele in props.enemySelection">
          <div @click="emit('selectSelection', ele.uuid)">{{ele.text}}</div>
        </div>
      </div>
      <div @click="emit('closeJumpBox')">关闭</div>
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
    