<script setup lang="ts">
import { reactive, computed, ref, type Ref } from '@vue/reactivity';

import { PLAYER_LIMIT, type _PLAYER_PARAMS } from '@/script/game';
import type { ViewDataForVue } from '@/script/viewDataForVue';

import '@/assets/iconfont/iconfont.css' // 引入阿里云iconfont


const props = defineProps<{
    playerSetting: ViewDataForVue['playerSetting']
}>()

const emit = defineEmits<{
  (event: 'startGame', playerData: _PLAYER_PARAMS): void
}>()

const {hp: hpLimit, atk: atkLimit, def: defLimit, sans: sansLimit } = {...PLAYER_LIMIT.playerData}
const totalPointLimit = PLAYER_LIMIT.totalPoints
let totalPoint: Ref<number> = ref(PLAYER_LIMIT.totalPoints.max)
let playerData: _PLAYER_PARAMS = reactive({
    hpMax: hpLimit.min,
    atk: atkLimit.min,
    def: defLimit.min,
    sans: sansLimit.min
})

function minus () {
    if (totalPoint.value + 1 <= PLAYER_LIMIT.totalPoints.max) {
        const runLater = () => { totalPoint.value += 1 }
        return {
            hp: () => { if (playerData.hpMax - 1 >= hpLimit.min) { playerData.hpMax += -1; runLater(); } },
            atk: () => { if (playerData.atk - 1 >= atkLimit.min) { playerData.atk += -1; runLater(); } },
            def: () => { if (playerData.def - 1 >= defLimit.min) { playerData.def += -1; runLater(); } },
            sans: () => { if (playerData.sans - 1 >= sansLimit.min) { playerData.sans += -1; runLater(); } }
        }
    }
}

function add () {
    if (totalPoint.value - 1 >= totalPointLimit.min) {
        const runLater = () => { totalPoint.value += -1 }
        return {
            hp: () => { if (playerData.hpMax + 1 <= hpLimit.min + totalPointLimit.max) { playerData.hpMax += 1; runLater(); } },
            atk: () => { if (playerData.atk + 1 <= atkLimit.min + totalPointLimit.max) { playerData.atk += 1; runLater(); } },
            def: () => { if (playerData.def + 1 <= defLimit.min + totalPointLimit.max) { playerData.def += 1; runLater(); } },
            sans: () => { if (playerData.sans + 1 <= sansLimit.min + totalPointLimit.max) { playerData.sans += 1; runLater(); } }
        }
    }
}

const ifCanStart = computed(() => {
    const {hpMax, atk, def, sans} = {...playerData}
    if (hpMax >= hpLimit.min && atk >= atkLimit.min && def >= defLimit.min && sans >= sansLimit.min &&
    hpMax + atk + def + sans === hpLimit.min + atkLimit.min + defLimit.min + sansLimit.min + totalPointLimit.max) {
        return true
    } else {
        return false
    }
})

</script>

<template>
    <div v-if="props.playerSetting.switch" class="box-child">
        <div style="font-size: 28px; font-weight: bolder; margin-bottom: 48px;">人物属性分配</div>
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 24px;">待分配点数{{totalPoint}}</div>
        <div>
            <div class="data-section">
                <div @click="minus()?.hp()"><i class="iconfont icon-minus"></i></div>
                <div class="data-section-text">
                    <div>生命值</div>
                    <div>{{playerData.hpMax}}</div>
                </div>
                <div @click="add()?.hp()"><i class="iconfont icon-plus"></i></div>
            </div>
            <div class="data-section">
                <div @click="minus()?.atk()"><i class="iconfont icon-minus"></i></div>
                <div class="data-section-text">
                    <div>攻击力</div>
                    <div>{{playerData.atk}}</div>
                </div>
                <div @click="add()?.atk()"><i class="iconfont icon-plus"></i></div>
            </div>
            <div class="data-section">
                <div @click="minus()?.def()"><i class="iconfont icon-minus"></i></div>
                <div class="data-section-text">
                    <div>防御值</div>
                    <div>{{playerData.def}}</div>
                </div>
                <div @click="add()?.def()"><i class="iconfont icon-plus"></i></div>
            </div>
            <div class="data-section">
                <div @click="minus()?.sans()"><i class="iconfont icon-minus"></i></div>
                <div class="data-section-text">
                    <div>理智值</div>
                    <div>{{playerData.sans}}</div>
                </div>
                <div @click="add()?.sans()"><i class="iconfont icon-plus"></i></div>
            </div>
        </div>
        <div class="button">
            <div v-if="ifCanStart" @click="emit('startGame', playerData)">开始</div>
        </div>
    </div>
</template>

<style scoped>
.box-child{
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.data-section {
    display: flex;
    align-items: center;
}

.data-section-text{
    font-size: 20px;
    margin: 6px 20px 6px 20px;
}

.button{
    width: 180px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
}

</style>
