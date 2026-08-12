 瀑布流布局思路

 1、计算容器的宽度viewportWidth
 2、根据容器的宽度以及每列的宽度columnWidth，计算列数columns
 3、初始化列高数组columnHeightArray
 4、确定宽度间隙gapWidth和高度间隙gapHeight
 5、遍历所有元素
    - 获取当前元素的实际宽度 
    - 查找列高数组中最小列的索引minIndex
    - 计算当前元素的位置 top = columnHeightArray[minIndex] + gapHeight ,left = minIndex * (columnWidth + gapWidth)
    - 更新列高数组 columnHeightArray[minIndex] = top + 当前元素的实际高度
    - 更新最小列的索引minIndex = columnHeightArray.indexOf(Math.min(...columnHeightArray))