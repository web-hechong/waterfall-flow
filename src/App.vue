<template>
  <Waterfall ref="waterfallRef" :waterfallList="waterfallList">
    <template v-slot="{ item }">
      <img :src="item.src.tiny" alt="" @load="imageLoad" />
    </template>
  </Waterfall>
</template>

<script setup>
import Waterfall from "./components/index.vue";
import { ref } from "vue";
import axios from "axios";

const waterfallList = ref([]);

const mockData = () => {
  const instance = axios.create({
    baseURL: "",
    timeout: 1000,
    headers: { "Authorization": "RlP0DWj8yDiTWobaatsJtE6eG49akiPTwBR9LIZDItg05BYqDtF8puHE" },
  });

  instance.get("https://api.pexels.com/v1/search?query=people&page=1&per_page=40").then((res) => {
    waterfallList.value = res.data.photos
  })
};

mockData();


const waterfallRef = ref(null);

const imageLoad = () => {
  waterfallRef.value.layoutHandle();
}
</script>

<style lang="scss">
img {
  width: 400px;
}
</style>
