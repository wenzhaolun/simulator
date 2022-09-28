<script setup lang="ts">
import { PLAYER_LIMIT, type _PLAYER_PARAMS } from '@/myJs/class/actor/player/static';
import { reactive, computed, ref, type Ref } from '@vue/reactivity';

const { ifShowPlayerSettingPage } = defineProps<{
    ifShowPlayerSettingPage: boolean
}>()

const emit = defineEmits<{
  (event: 'startGame', playerData: _PLAYER_PARAMS): void
}>()

const {hp: hpLimit, atk: atkLimit, def: defLimit, sans: sansLimit } = {...PLAYER_LIMIT.playerData}
const totalPointLimit = PLAYER_LIMIT.totalPoints
let totalPoint: Ref<number> = ref(PLAYER_LIMIT.totalPoints.max)
let playerData: _PLAYER_PARAMS = reactive({
    hp: hpLimit.min,
    atk: atkLimit.min,
    def: defLimit.min,
    sans: sansLimit.min
})

function minus () {
    if (totalPoint.value + 1 <= PLAYER_LIMIT.totalPoints.max) {
        totalPoint.value += 1
        return {
            hp: () => { if (playerData.hp - 1 >= hpLimit.min) { playerData.hp += -1 } },
            atk: () => { if (playerData.atk - 1 >= atkLimit.min) { playerData.atk += -1 } },
            def: () => { if (playerData.def - 1 >= defLimit.min) { playerData.def += -1 } },
            sans: () => { if (playerData.sans - 1 >= sansLimit.min) { playerData.sans += -1 } }
        }
    }
}

function add () {
    if (totalPoint.value - 1 >= totalPointLimit.min) {
        totalPoint.value += -1
        return {
            hp: () => { if (playerData.hp + 1 <= hpLimit.min + totalPointLimit.max) { playerData.hp += 1 } },
            atk: () => { if (playerData.atk + 1 <= atkLimit.min + totalPointLimit.max) { playerData.atk += 1 } },
            def: () => { if (playerData.def + 1 <= defLimit.min + totalPointLimit.max) { playerData.def += 1 } },
            sans: () => { if (playerData.sans + 1 <= sansLimit.min + totalPointLimit.max) { playerData.sans += 1 } }
        }
    }
}

const ifCanStart = computed(() => {
    const {hp, atk, def, sans} = {...playerData}
    if (hp >= hpLimit.min && atk >= atkLimit.min && def >= defLimit.min && sans >= sansLimit.min &&
    hp + atk + def + sans === hpLimit.min + atkLimit.min + defLimit.min + sansLimit.min + totalPointLimit.max) {
        return true
    } else {
        return false
    }
})

</script>

<template>
    <div v-if="ifShowPlayerSettingPage">
        <div>{{totalPoint}}</div>
        <div>
            <div>
                <div @click="minus()?.hp">-</div>
                <div>
                    <div>hp</div>
                    <div>{{playerData.hp}}</div>
                </div>
                <div @click="add()?.hp()">+</div>
            </div>
        </div>
        <div v-if="ifCanStart" @click="emit('startGame', playerData)">开始</div>
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
