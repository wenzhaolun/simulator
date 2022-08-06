import { defineStore } from "pinia";

export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    leadingRole: { // 玩家属性
      strength: 0,
      agility: 0,
      intelligence: 0,
      sans: 0,
      sight: 0,
      item: []
    },
    envState: { // 环境属性,环境推动人物和敌人属性，从而选择描述文字。
      light: 0,
      noise: 0,
      smell: 0
    },
    enemy: { // 随机敌人属性
      hp: 0,
      atk: 0,
      def: 0,
      aspect: 0,
      smell: 0,
      noise: 0,
      visible: 0
    },
    boss: { // 常驻大佬
      hp: 100,
      atk: 0,
      def: 0,
      aspect: 0,
      smell: 0,
      noise: 0,
      visible: 0
    },
    item: {
      a: {
        name: '手电筒',
        weight: 200,
        atk: 1,
        hp: 1,
        def: 1,
        light: 10
      },
      b: {
        name: '火把',
        weight: 200,
        atk: 1,
        hp: 1,
        def: 1,
        fire: 20,
        time: 10
      },
    }
  }),
  getters: {
    // doubleCount: (state) => state.leading_role * 2,
    leadingRoleAbility: (state) => {
      const lr = state.leadingRole
      return {
        hp: lr.strength,
        stun: lr.strength,
        doge: lr.agility,
        unlock: lr.agility,
        negotiate: lr.intelligence
      }
    }
  },
  actions: {
    // increment() {
    //   this.leading_role++;
    // },
  },
});
