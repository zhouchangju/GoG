import {
  clearFocusItemState,
  clearFocusEdgeState,
  stopLayout,
} from "./function";

let shiftKeydown = false;
function addEventListener(graph) {
  graph.on("keydown", evt => {
    const code = evt.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === "shift") {
      shiftKeydown = true;
    } else {
      shiftKeydown = false;
    }
  });
  graph.on("keyup", evt => {
    const code = evt.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === "shift") {
      shiftKeydown = false;
    }
  });
  graph.on("node:mouseenter", evt => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    model.oriFontSize = model.labelCfg.style.fontSize;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
    graph.setItemState(item, "hover", true);
    item.toFront();
  });

  graph.on("node:mouseleave", evt => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
    graph.setItemState(item, "hover", false);
  });

  graph.on("edge:mouseenter", evt => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
    item.toFront();
    item.getSource().toFront();
    item.getTarget().toFront();
  });

  graph.on("edge:mouseleave", evt => {
    const { item } = evt;
    const model = item.getModel();
    const currentLabel = model.label;
    item.update({
      label: model.oriLabel,
    });
    model.oriLabel = currentLabel;
  });
  // click node to show the detail drawer
  graph.on("node:click", evt => {
    stopLayout();
    if (!shiftKeydown) clearFocusItemState(graph);
    else clearFocusEdgeState(graph);
    const { item } = evt;

    // highlight the clicked node, it is down by click-select
    graph.setItemState(item, "focus", true);

    if (!shiftKeydown) {
      // 将相关边也高亮
      const relatedEdges = item.getEdges();
      relatedEdges.forEach(edge => {
        graph.setItemState(edge, "focus", true);
      });
    }
  });

  // click edge to show the detail of integrated edge drawer
  graph.on("edge:click", evt => {
    stopLayout();
    if (!shiftKeydown) clearFocusItemState(graph);
    const { item } = evt;
    // highlight the clicked edge
    graph.setItemState(item, "focus", true);
  });

  // click canvas to cancel all the focus state
  graph.on("canvas:click", () => {
    clearFocusItemState(graph);
    console.log(
      graph.getGroup(),
      graph.getGroup().getBBox(),
      graph.getGroup().getCanvasBBox()
    );
  });
}

export { addEventListener };
