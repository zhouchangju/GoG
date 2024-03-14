import G6 from "@antv/g6";
import insertCss from "insert-css";
import data from "./data";

export default function render() {
  const container = document.getElementById("container");
  const width = container.scrollWidth;
  const height = container.scrollHeight || 1000;

  // 参数文档：https://g6.antv.antgroup.com/api/graph-layout/force
  const graph = new G6.Graph({
    container: "container",
    width,
    height,
    groupByTypes: false,
    layout: {
      // comboCombined
      // type: "force",
      // linkDistance: 300, // 可选，边长
      // nodeStrength: 30, // 可选
      // edgeStrength: 1, // 可选
      // preventOverlap: true, // 可选
      // nodeSize: 100,
      // collideStrength: 1, // 可选
      // alpha: 0.3, // 可选
      // alphaDecay: 0.028, // 可选
      // alphaMin: 0.01, // 可选
      // forceSimulation: null, // 可选

      type: "radial",
      linkDistance: 300, // 可选，边长
      maxIteration: 1000, // 可选
      focusNode: "科兴制药", // 可选
      unitRadius: 200, // 可选
      preventOverlap: true, // 可选，必须配合 nodeSize
      nodeSize: 70, // 可选
      strictRadial: false, // 可选
      // workerEnabled: true, // 可选，开启 web-worker
    },
    defaultNode: {
      size: 70,
      type: "circle",
      style: {
        fill: "#fff",
        fontSize: 14,
      },
    },
    defaultEdge: {
      type: "line-with-arrow",
      style: {
        fill: "#f00",
        fontSize: 20,
        lineWidth: 2, // 线宽
        stroke: "#778899", // 线的颜色
        endArrow: {
          // 设置终点箭头
          path: G6.Arrow.vee(5, 10, 10), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
          d: 15,
        },
      },
      labelCfg: {
        autoRotate: true,
        style: {
          background: {
            fill: "#eee",
            stroke: "#000000",
            padding: [2, 2, 2, 2],
            radius: 2,
          },
        },
      },
    },
  });

  // 个性化关键节点的样式
  // https://g6.antv.antgroup.com/manual/middle/elements/nodes/default-node#%E4%BD%BF%E7%94%A8-graphnode
  graph.node(node => {
    if (node.id === "科兴制药") {
      node.style.fill = "lightblue";
    }

    return node;
  });

  graph.data({
    nodes: data.nodes,
    edges: data.edges.map(function (edge, i) {
      edge.id = "edge" + i;
      return Object.assign({}, edge);
    }),
  });
  graph.render();

  graph.on("node:dragstart", function (e) {
    graph.layout();
    refreshDragedNodePosition(e);
  });
  graph.on("node:drag", function (e) {
    const forceLayout = graph.get("layoutController").layoutMethods[0];
    forceLayout.execute();
    refreshDragedNodePosition(e);
  });
  graph.on("node:dragend", function (e) {
    e.item.get("model").fx = null;
    e.item.get("model").fy = null;
  });

  if (typeof window !== "undefined")
    window.onresize = () => {
      if (!graph || graph.get("destroyed")) return;
      if (!container || !container.scrollWidth || !container.scrollHeight)
        return;
      graph.changeSize(container.scrollWidth, container.scrollHeight);
    };

  function refreshDragedNodePosition(e) {
    const model = e.item.get("model");
    model.fx = e.x;
    model.fy = e.y;
  }
}
