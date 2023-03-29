let echarts = require("echarts");
const { createCanvas } = require("canvas");

//node读取env文件
const chart_config = require("dotenv").config();
const res = chart_config.parsed

if (res.width && res.height && res.name && res.path) {
// node读取echartOption.json文件
const option = require("./echartOption.json");

function renderChart() {
  const canvas = createCanvas(Number(res.width), Number(res.height));
  const chart = echarts.init(canvas);
  chart.setOption(option);
  return canvas;
}
//将canvas存储为图片
function saveImage(canvas) {
  const fs = require("fs");
  const out = fs.createWriteStream(require('path').resolve(__dirname,res.path+res.name));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log("保存成功"));
}
saveImage(renderChart())
} else {
  console.log('请检查.env文件是否配置正确')
}
