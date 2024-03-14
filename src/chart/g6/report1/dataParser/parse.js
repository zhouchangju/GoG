const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

// 读取Excel文件
const workbook = xlsx.readFile(path.resolve(__dirname, "./000063.xlsx"));
const sheetName = workbook.SheetNames[0]; // 假设我们只处理第一个工作表
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// 初始化nodes和edges数组
let nodes = [];
let edges = [];

for (let i = 1; i < data.length; i++) {
  let row = data[i];
  const cause = row[1];
  const effect = row[2];
  const type = row[9];

  if (cause && effect) {
    nodes.push({ id: cause, label: cause });
    nodes.push({ id: effect, label: effect });
    edges.push({
      source: cause,
      target: effect,
      label: type,
      description: `${cause}产生的${type}影响，导致了${effect}`,
    });
  }
}

// 去除nodes中的重复项
nodes = nodes.filter((item, index, self) => {
  return self.findIndex(x => x.id === item.id) === index;
});

// 生成最终的JSON结果
const result = {
  nodes: nodes,
  edges: edges,
};

// 打印结果或将其保存到文件
console.log(JSON.stringify(result, null, 2));

console.log(path.resolve(__dirname, "./../data1.ts"));

fs.writeFileSync(
  path.resolve(__dirname, "./../data1.ts"),
  `export default ${JSON.stringify(result, null, 2)}`
);
