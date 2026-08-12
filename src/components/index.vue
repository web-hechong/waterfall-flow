<script setup>
import { ref, onMounted, computed } from "vue";
import _ from "lodash";

const props = defineProps({
  waterfallList: {
    type: Array,
    default: () => [],
  },
  gapWidth: {
    type: Number,
    default: 20,
  },
  gapHeight: {
    type: Number,
    default: 20,
  },
  columns: {
    type: Number,
    default: 20,
  },
});

const waterfallMap = new Map();
class WaterfallItem {
  constructor(x, y, width, height, id, dom) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;
    this.dom = dom;
  }

  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  getDom() {
    return this.dom;
  }
}

const maxColumnHeight = computed(()=>Math.max(...columnHeightArray.value))

// const maxColumnHeight = ref(0);
// // 更新最大列高度
// const updateMaxColumnHeight = () => {
//   maxColumnHeight.value = Math.max(...columnHeightArray.value);
// };

// 更新列数组最小列下标
const updateMinIndex = () => {
  minIndex.value = columnHeightArray.value.indexOf(Math.min(...columnHeightArray.value));
};

// 更新列数组
const updateColumnHeightArray = (waterfallItem) => {
  columnHeightArray.value[minIndex.value] =
    waterfallItem.getRect().y + waterfallItem.getRect().height + props.gapHeight;
};

const minIndex = ref(0);
const waterfallItemList = ref();
// 计算位置
const calcPosition = () => {
  props.waterfallList.forEach((item) => {
    let dom = null;
    let waterfallItem = waterfallMap.get(item.id);
    const y = columnHeightArray.value[minIndex.value];
    const x = minIndex.value * (CLOUMNWIDTH + props.gapWidth);
    dom = waterfallItemList.value.find((i) => item.id == i.id);
      waterfallItem = new WaterfallItem(
        x,
        y,
        CLOUMNWIDTH,
        dom.offsetHeight,
        item.id,
        dom
      );
      waterfallMap.set(item.id, waterfallItem);
    // if (waterfallItem) {
    //   dom = waterfallItem.dom;
    // } else {
    //   dom = waterfallItemList.value.find((i) => item.id == i.id);
    //   waterfallItem = new WaterfallItem(
    //     x,
    //     y,
    //     CLOUMNWIDTH,
    //     dom.offsetHeight,
    //     item.id,
    //     dom
    //   );
    //   waterfallMap.set(item.id, waterfallItem);
    // }
    dom.style.transform = `translate(${x}px, ${y}px)`;
    updateColumnHeightArray(waterfallItem);
    updateMinIndex();
    // updateMaxColumnHeight();
  });
};

const CLOUMNWIDTH = 400;
const columns = ref(0);
const waterfallViewport = ref(null);
const columnHeightArray = ref([]);
// 计算列数
const calcColumns = () => {
  const waterfallViewportWidth = window.innerWidth;
  columns.value = Math.floor(waterfallViewportWidth / (CLOUMNWIDTH + props.gapWidth));
  columnHeightArray.value = Array(columns.value).fill(0);
};

const layoutHandle = () => {
  calcColumns();
  calcPosition();
}

onMounted(() => {
  layoutHandle();
  window.addEventListener('resize', _.debounce(layoutHandle, 300));
});


defineExpose({
  layoutHandle,
})
</script>

<template>
  <div class="waterfall-viewport" ref="waterfallViewport">
    <div class="waterfall-container" :style="{ height: `${maxColumnHeight}px` }">
      <div
        v-for="item in waterfallList"
        ref="waterfallItemList"
        :key="item.id"
        :id="item.id"
        class="waterfall-item"
      >
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.waterfall-viewport {
  height: 100%;
  .waterfall-container {
    width:auto;
    position: relative;
    .waterfall-item {
      position: absolute;
      width: 400px;
    }
  }
}
</style>
