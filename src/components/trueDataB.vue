<script setup lang="ts">
import { onMounted } from 'vue';

class Data {
  fd: number = 0
  td: {
    a: number,
    b: number
  }

  public onlyPlusFd () {
    this.fd += 1
  }

  public plus () {
    this.fd += 1
    this.td.a += 1
    console.log('fd ==>', this.fd)
  }

  constructor (td: { a: number, b: number }) {
    this.td = td
  }
}

defineProps<{
    data: Data
}>()

onMounted(()=> {
    
})

</script>

<template>
    <div class="greetings">
        <div>trueB{{data.td.b}}</div>
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
    