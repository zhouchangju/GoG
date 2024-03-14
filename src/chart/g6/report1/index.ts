import G6 from "@antv/g6";

import { insertCssClass, colorSets } from "./style";
import { registry } from "./register";
import { addEventListener } from "./addEventListener";
import data from "./data1";
import {
  processNodesEdges,
  getForceLayoutConfig,
  showItems,
  handleRefreshGraph,
  getMixedGraph,
  getNeighborMixedGraph,
  manageExpandCollapseArray,
  cacheNodePositions,
} from "./function";

import { config } from "./config";

export default function render() {
  insertCssClass();

  const { louvain } = G6.Algorithm;
  const { uniqueId } = G6.Util;

  let graph = null;

  // const config.largeGraphMode = true;
  // let config.manipulatePosition = undefined;
  // let config.descreteNodeCenter;

  let {
    DEFAULTNODESIZE,
    currentUnproccessedData,
    nodeMap,
    aggregatedNodeMap,
    hiddenItemIds,
    cachePositions,
    layout,
    expandArray,
    collapseArray,
  } = config;

  let CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 800;

  registry();

  const container = document.getElementById("container");
  const descriptionDiv = document.createElement("div");
  descriptionDiv.innerHTML = `<a href='/en/largegraph' target='_blanck'>Click【HERE】To Full Demo</a>
      <br/>
      <a href='/zh/largegraph' target='_blanck'>点击【这里】进入完整 Demo</a>`;
  descriptionDiv.style.textAlign = "right";
  descriptionDiv.style.color = "#fff";
  descriptionDiv.style.position = "absolute";
  descriptionDiv.style.right = "32px";
  descriptionDiv.style.marginTop = "8px";
  // container.appendChild(descriptionDiv);

  container.style.backgroundColor = "#2b2f33";

  CANVAS_WIDTH = container.scrollWidth;
  CANVAS_HEIGHT = (container.scrollHeight || 500) - 30;

  // nodeMap = {};

  // 社区发现算法，聚合数据
  const clusteredData = louvain(data, false, "weight");
  const aggregatedData = { nodes: [], edges: [] };
  clusteredData.clusters.forEach((cluster, i) => {
    cluster.nodes.forEach(node => {
      node.level = 0;
      node.label = node.id;
      node.type = "";
      node.colorSet = colorSets[i];

      nodeMap[node.id] = node;
    });
    const cnode = {
      id: cluster.id,
      type: "aggregated-node",
      count: cluster.nodes.length,
      level: 1,
      label: cluster.id,
      colorSet: colorSets[i],
      idx: i,
    };
    aggregatedNodeMap[cluster.id] = cnode;
    aggregatedData.nodes.push(cnode);
  });
  clusteredData.clusterEdges.forEach(clusterEdge => {
    const cedge = {
      ...clusterEdge,
      size: Math.log(clusterEdge.count),
      label: "",
      id: uniqueId("edge"),
    };
    if (cedge.source === cedge.target) {
      cedge.type = "loop";
      cedge.loopCfg = {
        dist: 20,
      };
    } else cedge.type = "line";
    aggregatedData.edges.push(cedge);
  });

  // 边的label的文本
  data.edges.forEach(edge => {
    // edge.label = `${edge.source}-${edge.target}`;
    edge.id = uniqueId("edge");
  });

  currentUnproccessedData = aggregatedData;

  const { edges: processedEdges } = processNodesEdges(
    currentUnproccessedData.nodes,
    currentUnproccessedData.edges,
    // data.nodes,
    // data.edges,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    config.largeGraphMode,
    true,
    true
  );

  // 鼠标右键菜单
  const contextMenu = new G6.Menu({
    shouldBegin(evt) {
      if (evt.target && evt.target.isCanvas && evt.target.isCanvas())
        return true;
      if (evt.item) return true;
      return false;
    },
    getContent(evt) {
      const { item } = evt;
      if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
        return `<ul>
          <li id='show'>Show all Hidden Items</li>
          <li id='collapseAll'>Collapse all Clusters</li>
        </ul>`;
      } else if (!item) return;
      const itemType = item.getType();
      const model = item.getModel();
      if (itemType && model) {
        if (itemType === "node") {
          if (model.level !== 0) {
            return `<ul>
              <li id='expand'>Expand the Cluster</li>
              <li id='hide'>Hide the Node</li>
            </ul>`;
          } else {
            return `<ul>
              <li id='collapse'>Collapse the Cluster</li>
              <li id='neighbor-1'>Find 1-degree Neighbors</li>
              <li id='neighbor-2'>Find 2-degree Neighbors</li>
              <li id='neighbor-3'>Find 3-degree Neighbors</li>
              <li id='hide'>Hide the Node</li>
            </ul>`;
          }
        } else {
          return `<ul>
            <li id='hide'>Hide the Edge</li>
          </ul>`;
        }
      }
    },
    handleMenuClick: (target, item) => {
      const model = item && item.getModel();
      const liIdStrs = target.id.split("-");
      let mixedGraphData;
      switch (liIdStrs[0]) {
        case "hide":
          graph.hideItem(item);
          hiddenItemIds.push(model.id);
          break;
        case "expand":
          const newArray = manageExpandCollapseArray(
            graph,
            graph.getNodes().length,
            model,
            collapseArray,
            expandArray
          );
          expandArray = newArray.expandArray;
          collapseArray = newArray.collapseArray;

          const allClusters: { id: string; level: number }[] = [];
          clusteredData.clusters.forEach(cluster => {
            allClusters.push({
              id: cluster.id,
              level: 1,
            });
          });

          // 这里生成了新的数据，混合了集群节点和当前点击的集群的子节点
          mixedGraphData = getMixedGraph(
            clusteredData,
            data,
            nodeMap,
            aggregatedNodeMap,
            // 关键在于这个数组，用来控制要展开哪些集群节点，其元素的格式类似这样 {"id": "17","level": 1}
            // expandArray,
            // TODO:改为全部展开，方便快速查看结果
            allClusters,
            collapseArray
          );
          break;
        case "collapse":
          const aggregatedNode = aggregatedNodeMap[model.clusterId];
          config.manipulatePosition = {
            x: aggregatedNode.x,
            y: aggregatedNode.y,
          };
          collapseArray.push(aggregatedNode);
          for (let i = 0; i < expandArray.length; i++) {
            if (expandArray[i].id === model.clusterId) {
              expandArray.splice(i, 1);
              break;
            }
          }
          mixedGraphData = getMixedGraph(
            clusteredData,
            data,
            nodeMap,
            aggregatedNodeMap,
            expandArray,
            collapseArray
          );
          break;
        case "collapseAll":
          expandArray = [];
          collapseArray = [];
          mixedGraphData = getMixedGraph(
            clusteredData,
            data,
            nodeMap,
            aggregatedNodeMap,
            expandArray,
            collapseArray
          );
          break;
        case "neighbor":
          const expandNeighborSteps = parseInt(liIdStrs[1]);
          mixedGraphData = getNeighborMixedGraph(
            model,
            expandNeighborSteps,
            data,
            clusteredData,
            currentUnproccessedData,
            nodeMap,
            aggregatedNodeMap,
            10
          );
          break;
        case "show":
          showItems(graph);
          break;
        default:
          break;
      }
      if (mixedGraphData) {
        cachePositions = cacheNodePositions(graph.getNodes());
        currentUnproccessedData = mixedGraphData;
        handleRefreshGraph(
          graph,
          currentUnproccessedData,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          config.largeGraphMode,
          true,
          false
        );
      }
    },
    // offsetX and offsetY include the padding of the parent container
    // 需要加上父级容器的 padding-left 16 与自身偏移量 10
    offsetX: 16 + 10,
    // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
    offsetY: 0,
    // the types of items that allow the menu show up
    // 在哪些类型的元素上响应
    itemTypes: ["node", "edge", "canvas"],
  });

  graph = new G6.Graph({
    container: "container",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    linkCenter: true,
    minZoom: 0.1,
    groupByTypes: false,
    modes: {
      default: [
        {
          type: "drag-canvas",
          enableOptimize: true,
        },
        {
          type: "zoom-canvas",
          enableOptimize: true,
          optimizeZoom: 0.01,
        },
        "drag-node",
        "shortcuts-call",
      ],
      lassoSelect: [
        {
          type: "zoom-canvas",
          enableOptimize: true,
          optimizeZoom: 0.01,
        },
        {
          type: "lasso-select",
          selectedState: "focus",
          trigger: "drag",
        },
      ],
      fisheyeMode: [],
    },
    defaultNode: {
      type: "aggregated-node",
      size: DEFAULTNODESIZE,
    },
    plugins: [contextMenu],
  });

  graph.get("canvas").set("localRefresh", false);

  const layoutConfig = getForceLayoutConfig(graph, config.largeGraphMode);
  layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
  layout.instance = new G6.Layout["gForce"](layoutConfig);
  layout.instance.init({
    nodes: currentUnproccessedData.nodes,
    edges: processedEdges,
  });
  layout.instance.execute();

  addEventListener(graph);
  graph.data({ nodes: aggregatedData.nodes, edges: processedEdges });
  // graph.data({ nodes: data.nodes, data: processedEdges });
  graph.render();

  if (typeof window !== "undefined")
    window.onresize = () => {
      if (!graph || graph.get("destroyed")) return;
      const container = document.getElementById("container");
      if (!container) return;
      graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
    };
}
