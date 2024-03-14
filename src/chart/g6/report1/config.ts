export const config = {
  NODESIZEMAPPING: "degree",
  SMALLGRAPHLABELMAXLENGTH: 5,
  labelMaxLength: 5,
  DEFAULTNODESIZE: 20,
  DEFAULTAGGREGATEDNODESIZE: 53,
  NODE_LIMIT: 40, // TODO: find a proper number for maximum node number on the canvas
  currentUnproccessedData: { nodes: [], edges: [] },
  nodeMap: {},
  aggregatedNodeMap: {},
  hiddenItemIds: [], // 隐藏的元素 id 数组
  largeGraphMode: true,
  cachePositions: {},
  manipulatePosition: undefined,
  descreteNodeCenter: undefined,
  layout: {
    type: "",
    instance: null,
    destroyed: true,
  },
  expandArray: [],
  collapseArray: [],
};
