## 执行流程

整个代码主要分为以下几个部分:

引入依赖和数据
首先引入了 G6 库、一些工具函数,以及示例数据 data。

定义全局变量和配置
定义了一些全局变量和配置项,如节点大小、边样式、颜色等。同时注册了自定义节点类型 aggregated-node 和 real-node,以及自定义边类型 custom-quadratic 和 custom-line。

处理节点和边数据
定义了 processNodesEdges 函数,用于处理原始节点和边数据,计算出每个节点的度数、边的大小和样式等。同时,也会对节点和边进行一些布局操作,如离散节点的定位。

获取布局配置
定义了 getForceLayoutConfig 函数,用于根据当前模式(大图模式或小图模式)获取不同的布局配置,如节点引力、边长度等。

处理展开/折叠操作
定义了一系列函数,如 hideItems、showItems、handleRefreshGraph、getMixedGraph、getNeighborMixedGraph、getExtractNodeMixedGraph 等,用于处理节点的展开、折叠、隐藏、显示等操作,并更新图数据。

上下文菜单处理
使用 G6 的插件机制,创建了一个上下文菜单 contextMenu,用于响应不同的交互事件,如展开/折叠节点、查找邻居节点等。

创建 G6 实例并初始化
创建 G6 Graph 实例,设置画布大小、模式、默认节点类型等。同时,初始化布局实例 layout.instance,并执行布局。

绑定事件监听
使用 bindListener 函数,为 Graph 实例绑定了一系列事件监听,如节点/边的 hover、click 等,用于响应不同的交互行为。

渲染图形
最后,使用 graph.data 设置初始数据,并调用 graph.render 进行渲染。同时,还监听了 window.onresize 事件,用于自适应画布大小的变化。

总的来说,整个代码的执行流程是:

准备数据和配置
处理节点和边数据
根据模式获取布局配置
创建 G6 实例并初始化
绑定事件监听
渲染图形
响应用户交互,如展开/折叠节点、查找邻居节点等
根据交互行为更新图数据并重新渲染
代码的核心逻辑主要集中在数据处理、布局配置获取、交互事件处理和图形渲染这几个部分。其中,数据处理部分负责将原始数据转换为 G6 可识别的节点和边数据;布局配置部分则根据当前模式设置不同的布局参数;交互事件处理部分响应用户的各种操作,如展开/折叠节点、查找邻居节点等,并更新图数据;最后,图形渲染部分则将更新后的数据渲染到画布上。

总的来说,这个代码实现了一个交互式的关系图可视化应用,用户可以通过上下文菜单对图形进行各种操作,如展开/折叠节点、查找邻居节点等,代码会相应地更新数据并重新渲染图形。

## 技术拆解

### 节点的聚合

节点的聚合是通过使用 louvain 算法进行社区发现(Community Detection)来实现的。具体步骤如下:

引入数据并调用 louvain 算法

```javascript
const clusteredData = louvain(data, false, "weight");
```

这里使用 G6.Algorithm.louvain 算法对原始数据 data 进行社区发现,得到 clusteredData。"weight" 参数表示使用边的 weight 属性作为权重进行计算。

遍历 clusteredData 中的簇(cluster)数据

```javascript
clusteredData.clusters.forEach((cluster, i) => {
    cluster.nodes.forEach(node => {
        // 处理真实节点数据
        node.level = 0;
        ...
        nodeMap[node.id] = node;
    });

    // 创建聚合节点数据
    const cnode = {
    id: cluster.id,
    type: "aggregated-node",
    count: cluster.nodes.length,
    level: 1,
    ...
    };
    aggregatedNodeMap[cluster.id] = cnode;
    aggregatedData.nodes.push(cnode);
});
```

对于每个簇中的真实节点,将它们的 level 设置为 0,表示真实节点。同时,将它们存储在 nodeMap 中,方便后续查找。

然后,针对每个簇,创建一个对应的聚合节点 cnode,它的类型为 "aggregated-node",count 属性记录了该簇中真实节点的数量。这个聚合节点的 level 设置为 1,表示它是第一层聚合节点。将这个聚合节点存储在 aggregatedNodeMap 中,并添加到 aggregatedData.nodes 数组中。

处理簇间边数据

```javascript
clusteredData.clusterEdges.forEach(clusterEdge => {
    const cedge = {
        ...clusterEdge,
        size: Math.log(clusterEdge.count),
        label: "",
        id: uniqueId("edge"),
    };
    ...
    aggregatedData.edges.push(cedge);
});
```

对于 clusteredData 中记录的簇间边 clusterEdges,将它们转换为 aggregatedData.edges 中的边数据。

调用 processNodesEdges 进行数据预处理

```javascript
currentUnproccessedData = aggregatedData;
const { edges: processedEdges } = processNodesEdges(
  currentUnproccessedData.nodes,
  currentUnproccessedData.edges,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  largeGraphMode,
  true,
  true
);
```

将聚合后的节点数据 aggregatedData.nodes 和边数据 aggregatedData.edges 作为输入,调用 processNodesEdges 函数进行进一步的数据预处理,如计算节点度数、设置边样式等。

渲染节点和边

```javascript
graph.data({ nodes: aggregatedData.nodes, edges: processedEdges });
graph.render();
```

最后,将预处理后的节点数据 aggregatedData.nodes 和边数据 processedEdges 设置为 G6 实例的数据源,并调用 render 方法进行渲染。

在渲染时,根据节点的 type 属性,G6 会使用对应的节点类型进行渲染。对于 "aggregated-node" 类型的节点,将使用自定义的聚合节点渲染逻辑;对于 "real-node" 类型的节点,将使用自定义的真实节点渲染逻辑。

总的来说,节点的聚合是通过调用 louvain 算法进行社区发现,将属于同一个社区的节点聚合为一个聚合节点,从而实现了节点的层次化展示。同时,通过自定义节点的渲染逻辑,可以区分真实节点和聚合节点,并对它们进行不同的视觉表现。

#### 节点的展开和折叠

这是在`handleMenuClick`中的`getMixedGraph`函数调用里面，根据当前选中的节点，重新计算了要展示的节点输出，然后重新渲染了图形。

```javascript
// 这里生成了新的数据，混合了集群节点和当前点击的集群的子节点
mixedGraphData = getMixedGraph(
  clusteredData,
  data,
  nodeMap,
  aggregatedNodeMap,
  // 关键在于这个数组，用来控制要展开哪些集群节点，其元素的格式类似这样 {"id": "17","level": 1}
  expandArray,
  // 全部展开
  // allClusters,
  collapseArray
);
```

如需全部展开节点，只需要将`expandArray`设置为`allClusters`即可。`allClusters`的计算如下:

```javascript
const allClusters: { id: string; level: number }[] = [];
clusteredData.clusters.forEach(cluster => {
allClusters.push({
    id: cluster.id,
    level: 1,
});
});
```

### 流动的线条

连线的流动效果是通过自定义边 custom-quadratic 和 custom-line 以及状态切换的方式来实现的。具体实现步骤如下:

注册自定义边
代码中分别注册了 custom-quadratic 和 custom-line 两种自定义边类型,它们继承自 G6 内置的 quadratic 和 single-edge 边类型。

重写 setState 方法
在自定义边的定义中,重写了 setState 方法,用于在边的状态发生变化时更新边的渲染样式。当边处于 focus 状态时,会执行相应的动画效果。

添加背景路径
当边处于 focus 状态且为真实边时,会在该边的群组中添加一条背景路径 back-line,用于产生流动效果的背景。

执行路径动画
对于真实边,它会在边的 keyShape 上执行一个从 0 到总长度的路径动画,通过更新 lineDash 属性来模拟流动效果。

对于虚拟边,它会在边的 keyShape 上执行一个 lineDash 和 lineDashOffset 的循环动画,通过改变 lineDashOffset 的值来模拟流动效果。

设置动画参数
动画的持续时间 duration、不透明度 animateOpacity 和 animateBackOpacity 等参数都是可配置的,代码中使用了一些默认值。

总的来说,连线的流动效果是通过在边处于 focus 状态时,添加背景路径并执行路径动画或 lineDash 动画来实现的。真实边和虚拟边由于路径的不同,使用了不同的动画方式,但都达到了模拟流动的视觉效果。

需要注意的是,这种实现方式虽然视觉效果不错,但可能会对性能有一定影响,特别是在大规模的关系图中。在实际项目中,需要根据具体场景权衡动画效果和性能之间的平衡。

## CodeReview

这个文件中的代码是一个使用 AntV G6 库进行关系图可视化的示例,代码整体质量还不错,但是仍有一些可以优化的地方:

代码组织结构 虽然代码使用了一些函数封装,但整体而言,代码组织结构还是比较松散的。可以考虑将相关的功能和数据处理逻辑进一步封装,以提高代码的可读性和可维护性。
变量命名 有些变量命名不够直观,比如 currentUnproccessedData、cachePositions 等,可以使用更加直观的名称。
注释 代码中的注释并不充足,很多函数和复杂逻辑缺少注释说明,这会影响代码的可读性和可维护性。
重复代码 在一些地方存在一些重复的代码逻辑,比如节点和边的 hover 样式设置、布局停止等,可以考虑提取成公共函数。
性能优化 代码中有一些地方可能存在性能问题,比如频繁的 DOM 操作、大量的数据计算等,可以考虑使用一些性能优化的技巧,如虚拟化、懒加载等。
类型检查 代码中没有进行类型检查,可以考虑使用 TypeScript 或者 JavaScript 的类型检查工具,以提高代码的健壮性。
配置项抽离 一些配置项如颜色、大小等直接硬编码在代码中,可以考虑将这些配置项抽离出来,方便后期维护和修改。
异常处理 代码中缺少针对异常情况的处理,比如数据格式错误、节点过多等,可以考虑添加相应的异常处理逻辑。
测试覆盖 代码中没有添加任何单元测试或集成测试,可以考虑添加测试用例,以确保代码的正确性和健壮性。
总的来说,这个示例代码还是有一些需要优化的地方,主要包括代码结构、可读性、性能、健壮性等方面,对于一个生产级别的项目来说,这些优化是非常有必要的。
