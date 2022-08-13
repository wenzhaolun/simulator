<script setup lang="ts">
import { onMounted } from 'vue';
import { Item } from '../myJs/myTs'


defineProps<{
  msg: string;
}>();

onMounted(()=> {
  console.log('mounted')
  const item = new Item({
    id: '123',
    uuid: '32',
    name: 'item',
    intro: '1231231231',
    atk: 1,
    def: 1,
    hp: 10,
    life: 10,
    weight: 20
})
  console.log(item)
})

</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://vuejs.org/">Vue 3</a>.
    </h3>
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
