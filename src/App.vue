<template>
  <Waterfall ref="waterfallRef" :waterfallList="waterfallList" @load="load">
    <template v-slot="{ item }">
      <img :src="item.src" alt="" @load="imageLoad" />
    </template>
  </Waterfall>
</template>

<script setup>
import Waterfall from "./components/index.vue";
import { ref } from "vue";
import { queryWaterfallList } from "@/api/index.js"

const waterfallList = ref([]);

const mockData = async () => {
  const res = await queryWaterfallList({pageSize: 20});
  console.log(res);
  waterfallList.value = res.data
};

mockData();


const waterfallRef = ref(null);

const imageLoad = () => {
  waterfallRef.value.layoutHandle();
}

const load = async () => {
  const res = await queryWaterfallList({pageSize: 20});
  waterfallList.value.push(...res.data);
}
</script>

<style lang="scss">
img {
  width: 400px;
}
</style>
