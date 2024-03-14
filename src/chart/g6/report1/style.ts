import G6 from "@antv/g6";
import insertCss from "insert-css";
const darkBackColor = "rgb(43, 47, 51)";
const disableColor = "#777";
const theme = "dark";
const subjectColors = [
  "#5F95FF", // blue
  "#61DDAA",
  "#65789B",
  "#F6BD16",
  "#7262FD",
  "#78D3F8",
  "#9661BC",
  "#F6903D",
  "#008685",
  "#F08BB4",
];

const colorSets = G6.Util.getColorSetsBySubjectColors(
  subjectColors,
  darkBackColor,
  theme,
  disableColor
);

// TOOD: 重复，待优化
const realEdgeOpacity = 0.2;

const global = {
  node: {
    style: {
      fill: "#2B384E",
    },
    labelCfg: {
      style: {
        fill: "#acaeaf",
        stroke: "#191b1c",
      },
    },
    stateStyles: {
      focus: {
        fill: "#2B384E",
      },
    },
  },
  edge: {
    style: {
      stroke: "#acaeaf",
      realEdgeStroke: "#acaeaf", //'#f00',
      realEdgeOpacity,
      strokeOpacity: realEdgeOpacity,
    },
    labelCfg: {
      style: {
        fill: "#acaeaf",
        realEdgeStroke: "#acaeaf", //'#f00',
        realEdgeOpacity: 0.5,
        stroke: "#191b1c",
      },
    },
    stateStyles: {
      focus: {
        stroke: "#fff", // '#3C9AE8',
      },
    },
  },
};

function insertCssClass() {
  insertCss(`
    .g6-component-contextmenu {
      position: absolute;
      z-index: 2;
      list-style-type: none;
      background-color: #363b40;
      border-radius: 6px;
      font-size: 14px;
      color: hsla(0,0%,100%,.85);
      width: fit-content;
      transition: opacity .2s;
      text-align: center;
      padding: 0px 20px 0px 20px;
          box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.6);
          border: 0px;
    }
    .g6-component-contextmenu ul {
          padding-left: 0px;
          margin: 0;
    }
    .g6-component-contextmenu li {
      cursor: pointer;
      list-style-type: none;
      list-style: none;
      margin-left: 0;
      line-height: 38px;
    }
    .g6-component-contextmenu li:hover {
      color: #aaaaaa;
      }
  `);
}

export { insertCssClass, colorSets, global };
