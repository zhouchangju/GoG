import G6 from "@antv/g6";
import { isNumber, isArray } from "@antv/util";

import { colorSets, global } from "./style";
function registry() {
  const duration = 2000;
  const animateOpacity = 0.6;
  const animateBackOpacity = 0.1;
  const virtualEdgeOpacity = 0.1;
  const realEdgeOpacity = 0.2;

  // Custom super node
  G6.registerNode(
    "aggregated-node",
    {
      draw(cfg, group) {
        const width = 53,
          height = 27;
        const style = cfg.style || {};
        const colorSet = cfg.colorSet || colorSets[0];

        // halo for hover
        group.addShape("rect", {
          attrs: {
            x: -width * 0.55,
            y: -height * 0.6,
            width: width * 1.1,
            height: height * 1.2,
            fill: colorSet.mainFill,
            opacity: 0.9,
            lineWidth: 0,
            radius: (height / 2 || 13) * 1.2,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "halo-shape",
          visible: false,
        });

        // focus stroke for hover
        group.addShape("rect", {
          attrs: {
            x: -width * 0.55,
            y: -height * 0.6,
            width: width * 1.1,
            height: height * 1.2,
            fill: colorSet.mainFill, // '#3B4043',
            stroke: "#AAB7C4",
            lineWidth: 1,
            lineOpacty: 0.85,
            radius: (height / 2 || 13) * 1.2,
          },
          name: "stroke-shape",
          visible: false,
        });

        const keyShape = group.addShape("rect", {
          attrs: {
            ...style,
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            fill: colorSet.mainFill, // || '#3B4043',
            stroke: colorSet.mainStroke,
            lineWidth: 2,
            cursor: "pointer",
            radius: height / 2 || 13,
            lineDash: [2, 2],
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "aggregated-node-keyShape",
        });

        let labelStyle = {};
        if (cfg.labelCfg) {
          labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
        }
        group.addShape("text", {
          attrs: {
            text: `${cfg.count}`,
            x: 0,
            y: 0,
            textAlign: "center",
            textBaseline: "middle",
            cursor: "pointer",
            fontSize: 12,
            fill: "#fff",
            opacity: 0.85,
            fontWeight: 400,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "count-shape",
          className: "count-shape",
          draggable: true,
        });

        // tag for new node
        if (cfg.new) {
          group.addShape("circle", {
            attrs: {
              x: width / 2 - 3,
              y: -height / 2 + 3,
              r: 4,
              fill: "#6DD400",
              lineWidth: 0.5,
              stroke: "#FFFFFF",
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: "typeNode-tag-circle",
          });
        }
        return keyShape;
      },
      setState: (name, value, item) => {
        const group = item.get("group");
        if (name === "layoutEnd" && value) {
          const labelShape = group.find(e => e.get("name") === "text-shape");
          if (labelShape) labelShape.set("visible", true);
        } else if (name === "hover") {
          if (item.hasState("focus")) {
            return;
          }
          const halo = group.find(e => e.get("name") === "halo-shape");
          const keyShape = item.getKeyShape();
          const colorSet = item.getModel().colorSet || colorSets[0];
          if (value) {
            halo && halo.show();
            keyShape.attr("fill", colorSet.activeFill);
          } else {
            halo && halo.hide();
            keyShape.attr("fill", colorSet.mainFill);
          }
        } else if (name === "focus") {
          const stroke = group.find(e => e.get("name") === "stroke-shape");
          const keyShape = item.getKeyShape();
          const colorSet = item.getModel().colorSet || colorSets[0];
          if (value) {
            stroke && stroke.show();
            keyShape.attr("fill", colorSet.selectedFill);
          } else {
            stroke && stroke.hide();
            keyShape.attr("fill", colorSet.mainFill);
          }
        }
      },
      update: undefined,
    },
    "single-node"
  );

  // Custom real node
  G6.registerNode(
    "real-node",
    {
      draw(cfg, group) {
        let r = 30;
        if (isNumber(cfg.size)) {
          r = cfg.size / 2;
        } else if (isArray(cfg.size)) {
          r = cfg.size[0] / 2;
        }
        const style = cfg.style || {};
        const colorSet = cfg.colorSet || colorSets[0];

        // halo for hover
        group.addShape("circle", {
          attrs: {
            x: 0,
            y: 0,
            r: r + 5,
            fill: style.fill || colorSet.mainFill || "#2B384E",
            opacity: 0.9,
            lineWidth: 0,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "halo-shape",
          visible: false,
        });

        // focus stroke for hover
        group.addShape("circle", {
          attrs: {
            x: 0,
            y: 0,
            r: r + 5,
            fill: style.fill || colorSet.mainFill || "#2B384E",
            stroke: "#fff",
            strokeOpacity: 0.85,
            lineWidth: 1,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "stroke-shape",
          visible: false,
        });

        const keyShape = group.addShape("circle", {
          attrs: {
            ...style,
            x: 0,
            y: 0,
            r,
            fill: colorSet.mainFill,
            stroke: colorSet.mainStroke,
            lineWidth: 2,
            cursor: "pointer",
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "aggregated-node-keyShape",
        });

        let labelStyle = {};
        if (cfg.labelCfg) {
          labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
        }

        if (cfg.label) {
          const text = cfg.label;
          let labelStyle = {};
          let refY = 0;
          if (cfg.labelCfg) {
            labelStyle = Object.assign(labelStyle, cfg.labelCfg.style);
            refY += cfg.labelCfg.refY || 0;
          }
          let offsetY = 0;
          const fontSize = labelStyle.fontSize < 8 ? 8 : labelStyle.fontSize;
          const lineNum = cfg.labelLineNum || 1;
          offsetY = lineNum * (fontSize || 12);
          group.addShape("text", {
            attrs: {
              text,
              x: 0,
              y: r + refY + offsetY + 5,
              textAlign: "center",
              textBaseLine: "alphabetic",
              cursor: "pointer",
              fontSize,
              fill: "#fff",
              opacity: 0.85,
              fontWeight: 400,
              stroke: global.edge.labelCfg.style.stroke,
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: "text-shape",
            className: "text-shape",
          });
        }

        // tag for new node
        if (cfg.new) {
          group.addShape("circle", {
            attrs: {
              x: r - 3,
              y: -r + 3,
              r: 4,
              fill: "#6DD400",
              lineWidth: 0.5,
              stroke: "#FFFFFF",
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: "typeNode-tag-circle",
          });
        }

        return keyShape;
      },
      setState: (name, value, item) => {
        const group = item.get("group");
        if (name === "layoutEnd" && value) {
          const labelShape = group.find(e => e.get("name") === "text-shape");
          if (labelShape) labelShape.set("visible", true);
        } else if (name === "hover") {
          if (item.hasState("focus")) {
            return;
          }
          const halo = group.find(e => e.get("name") === "halo-shape");
          const keyShape = item.getKeyShape();
          const colorSet = item.getModel().colorSet || colorSets[0];
          if (value) {
            halo && halo.show();
            keyShape.attr("fill", colorSet.activeFill);
          } else {
            halo && halo.hide();
            keyShape.attr("fill", colorSet.mainFill);
          }
        } else if (name === "focus") {
          const stroke = group.find(e => e.get("name") === "stroke-shape");
          const label = group.find(e => e.get("name") === "text-shape");
          const keyShape = item.getKeyShape();
          const colorSet = item.getModel().colorSet || colorSets[0];
          if (value) {
            stroke && stroke.show();
            keyShape.attr("fill", colorSet.selectedFill);
            label && label.attr("fontWeight", 800);
          } else {
            stroke && stroke.hide();
            keyShape.attr("fill", colorSet.mainFill); // '#2B384E'
            label && label.attr("fontWeight", 400);
          }
        }
      },
      update: undefined,
    },
    "aggregated-node"
  ); // 这样可以继承 aggregated-node 的 setState

  // Custom the quadratic edge for multiple edges between one node pair
  G6.registerEdge(
    "custom-quadratic",
    {
      setState: (name, value, item) => {
        const group = item.get("group");
        const model = item.getModel();
        if (name === "focus") {
          const back = group.find(ele => ele.get("name") === "back-line");
          if (back) {
            back.stopAnimate();
            back.remove();
            back.destroy();
          }
          const keyShape = group.find(ele => ele.get("name") === "edge-shape");
          const arrow = model.style.endArrow;
          if (value) {
            if (keyShape.cfg.animation) {
              keyShape.stopAnimate(true);
            }
            keyShape.attr({
              strokeOpacity: animateOpacity,
              opacity: animateOpacity,
              stroke: "#fff",
              endArrow: {
                ...arrow,
                stroke: "#fff",
                fill: "#fff",
              },
            });
            if (model.isReal) {
              const { lineWidth, path, endArrow, stroke } = keyShape.attr();
              const back = group.addShape("path", {
                attrs: {
                  lineWidth,
                  path,
                  stroke,
                  endArrow,
                  opacity: animateBackOpacity,
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: "back-line",
              });
              back.toBack();
              const length = keyShape.getTotalLength();
              keyShape.animate(
                ratio => {
                  // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                  const startLen = ratio * length;
                  // Calculate the lineDash
                  const cfg = {
                    lineDash: [startLen, length - startLen],
                  };
                  return cfg;
                },
                {
                  repeat: true, // Whether executes the animation repeatly
                  duration, // the duration for executing once
                }
              );
            } else {
              let index = 0;
              const lineDash = keyShape.attr("lineDash");
              const totalLength = lineDash[0] + lineDash[1];
              keyShape.animate(
                () => {
                  index++;
                  if (index > totalLength) {
                    index = 0;
                  }
                  const res = {
                    lineDash,
                    lineDashOffset: -index,
                  };
                  // returns the modified configurations here, lineDash and lineDashOffset here
                  return res;
                },
                {
                  repeat: true, // whether executes the animation repeatly
                  duration, // the duration for executing once
                }
              );
            }
          } else {
            keyShape.stopAnimate();
            const stroke = "#acaeaf";
            const opacity = model.isReal ? realEdgeOpacity : virtualEdgeOpacity;
            keyShape.attr({
              stroke,
              strokeOpacity: opacity,
              opacity,
              endArrow: {
                ...arrow,
                stroke,
                fill: stroke,
              },
            });
          }
        }
      },
    },
    "quadratic"
  );

  // Custom the line edge for single edge between one node pair
  G6.registerEdge(
    "custom-line",
    {
      setState: (name, value, item) => {
        const group = item.get("group");
        const model = item.getModel();
        if (name === "focus") {
          const keyShape = group.find(ele => ele.get("name") === "edge-shape");
          const back = group.find(ele => ele.get("name") === "back-line");
          if (back) {
            back.stopAnimate();
            back.remove();
            back.destroy();
          }
          const arrow = model.style.endArrow;
          if (value) {
            if (keyShape.cfg.animation) {
              keyShape.stopAnimate(true);
            }
            keyShape.attr({
              strokeOpacity: animateOpacity,
              opacity: animateOpacity,
              stroke: "#fff",
              endArrow: {
                ...arrow,
                stroke: "#fff",
                fill: "#fff",
              },
            });
            if (model.isReal) {
              const { path, stroke, lineWidth } = keyShape.attr();
              const back = group.addShape("path", {
                attrs: {
                  path,
                  stroke,
                  lineWidth,
                  opacity: animateBackOpacity,
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: "back-line",
              });
              back.toBack();
              const length = keyShape.getTotalLength();
              keyShape.animate(
                ratio => {
                  // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                  const startLen = ratio * length;
                  // Calculate the lineDash
                  const cfg = {
                    lineDash: [startLen, length - startLen],
                  };
                  return cfg;
                },
                {
                  repeat: true, // Whether executes the animation repeatly
                  duration, // the duration for executing once
                }
              );
            } else {
              const lineDash = keyShape.attr("lineDash");
              const totalLength = lineDash[0] + lineDash[1];
              let index = 0;
              keyShape.animate(
                () => {
                  index++;
                  if (index > totalLength) {
                    index = 0;
                  }
                  const res = {
                    lineDash,
                    lineDashOffset: -index,
                  };
                  // returns the modified configurations here, lineDash and lineDashOffset here
                  return res;
                },
                {
                  repeat: true, // whether executes the animation repeatly
                  duration, // the duration for executing once
                }
              );
            }
          } else {
            keyShape.stopAnimate();
            const stroke = "#acaeaf";
            const opacity = model.isReal ? realEdgeOpacity : virtualEdgeOpacity;
            keyShape.attr({
              stroke,
              strokeOpacity: opacity,
              opacity: opacity,
              endArrow: {
                ...arrow,
                stroke,
                fill: stroke,
              },
            });
          }
        }
      },
    },
    "single-edge"
  );
}

export { registry };
