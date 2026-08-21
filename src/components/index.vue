<script setup>
import { ref, onMounted, computed } from "vue";
import _ from "lodash";

const emits = defineEmits(["load"]);

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

const maxColumnHeight = computed(() => Math.max(...columnHeightArray.value));

// 更新列数组最小列下标
const updateMinIndex = () => {
  minIndex.value = columnHeightArray.value.indexOf(Math.min(...columnHeightArray.value));
};

// 更新列数组
const updateColumnHeightArray = (waterfallItem) => {
  columnHeightArray.value[minIndex.value] =
    waterfallItem.getRect().y + waterfallItem.getRect().height + props.gapHeight;
};

const positionOffset = ref(0);
const updatePositionOffset = () => {
  positionOffset.value = Math.floor(
    (waterfallViewportWidth.value -
      columns.value * CLOUMNWIDTH -
      (columns.value - 1) * props.gapWidth) /
      2
  );
};

const minIndex = ref(0);
const waterfallItemList = ref();
// 计算位置
const calcPosition = () => {
  props.waterfallList.forEach((item) => {
    let dom = null;
    let waterfallItem = waterfallMap.get(item.id);
    const y = columnHeightArray.value[minIndex.value];
    const x = minIndex.value * (CLOUMNWIDTH + props.gapWidth) + positionOffset.value;
    dom = waterfallItemList.value.find((i) => item.id == i.id);
    waterfallItem = new WaterfallItem(x, y, CLOUMNWIDTH, dom.offsetHeight, item.id, dom);
    waterfallMap.set(item.id, waterfallItem);
    dom.style.transform = `translate(${x}px, ${y}px)`;
    updateColumnHeightArray(waterfallItem);
    updateMinIndex();
  });
};

const CLOUMNWIDTH = 400;
const columns = ref(0);
const waterfallViewport = ref(null);
const waterfallContainer = ref(null);
const columnHeightArray = ref([]);
// 计算列数
const calcColumns = () => {
  columns.value = Math.floor(waterfallViewportWidth.value / (CLOUMNWIDTH + props.gapWidth));
  columnHeightArray.value = Array(columns.value).fill(0);
};

const waterfallViewportWidth = ref(0);
const layoutHandle = () => {
  waterfallViewportWidth.value = window.innerWidth;
  calcColumns();
  updatePositionOffset();
  calcPosition();
};

const scroll = () => {
  const clientHeight = waterfallViewport.value.clientHeight;
  const scrollTop = waterfallViewport.value.scrollTop;
  const scrollHeight = waterfallViewport.value.scrollHeight;
  if (scrollTop + clientHeight >= scrollHeight) {
    emits("load");
  }

  
};

onMounted(() => {
  layoutHandle();
  window.addEventListener("resize", _.debounce(layoutHandle, 300));
  waterfallViewport.value.addEventListener("scroll", _.debounce(scroll, 300));
});

defineExpose({
  layoutHandle,
});
</script>

<template>
  <div class="waterfall-viewport" ref="waterfallViewport">
    <div
      class="waterfall-container"
      ref="waterfallContainer"
      :style="{ height: `${maxColumnHeight}px` }"
    >
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
    <div class="footer">
      <div>{{ "正在加载中" }}</div>
    </div>
  </div>
</template>

<style scoped>
.waterfall-viewport {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  .waterfall-container {
    width: auto;
    position: relative;
    .waterfall-item {
      position: absolute;
      width: 400px;
    }
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
