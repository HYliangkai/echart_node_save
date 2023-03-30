let echarts = require('echarts')
const {createCanvas} = require('canvas')

//读取配置和数据即可，其他配置本地来生成

// node读取echartOption.json文件
const option = require('./echartOption.json')

const chart_option = {
  // 标题
  title: {
    text: '',
  },
  // 暗黑模式
  darkMode: true,
  // grid布局设置x轴,实现不等分
  grid: {
    x: 150,
    // y:45,
    x2: 50,
    y2: 210,
    // borderWidth:1
  },
  // 数据提示
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
    valueFormatter: value => `${value} mm`,
  },
  toolbox: {
    show: false,
    feature: {
      dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar']},
      restore: {show: true},
      saveAsImage: {show: true},
    },
  },
  legend: {
    // 边框显示
    borderWidth: 1,
    borderColor: 'rgb(0,0,0)',
    align: 'left',
    itemGap: 30,
    orient: 'horizontal',
    textStyle: {color: '#000'},
    top: 10,
    left: 'center',
  },
  xAxis: [
    {
      type: 'category',
      max: 179,
      interval: 1,
      axisTick: {
        length: 0,
        interval: 6,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: option.option.grid_color || '#999999',
          width: Number(option.option.grid_width || 1),
        },
      },
      //刻度显示配置
      axisLabel: {
        fontWeight: 'bold',
        show: true,
        interval: (index, val) => {
          if ((index + 1) % 3 == 0 && (index + 1) % 6 != 0 && index != 0) {
            return true
          }
          return false
        },
        textStyle: {
          fontSize: '14px',
        },
      },
      // Note:需要变更数据
      data: option?.x_data?.first_line ?? [],
      axisPointer: {
        type: 'shadow',
      },
    },
    // 第一列线条
    {
      position: 'bottom', // 将分组x轴位置定至底部，不然默认在顶部
      offset: 0, // 向下偏移，使分组文字显示位置不与原x轴重叠
      axisTick: {
        length: -25, // 延长刻度线做分组线
        inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
        lineStyle: {color: '#000'}, // 非必须，仅为了演示，明显标示出分组刻度线
        interval: 5, //Note:每6条数据显示一个
      },
      // min: -30,
      max: 179,
      interval: 6,
      axisLabel: {
        inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
        interval: 6, // 强制显示全部刻度名
      },
      data: new Array(180).fill(''), //创造180条空数据
    },
    // 第二列数据
    {
      fontWeight: 'bold',
      position: 'bottom', // 将分组x轴位置定至底部，不然默认在顶部
      offset: 50, // 向下偏移，使分组文字显示位置不与原x轴重叠 62
      axisTick: {
        length: 25, // 延长刻度线做分组线 //用刻度长度来做y轴线
        inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
        lineStyle: {color: '#000'}, // 非必须，仅为了演示，明显标示出分组刻度线
        interval: (index, value) => {
          // Note:根据需求分割线条//
          return index === 0 || index == Number(option?.x_data?.split_index ?? 0)
        },
        // interval: 1,
      },
      // min: -30,
      max: 179, // 最多允许存在的刻度条数(总数据量-1)
      interval: 1, //刻度
      axisLabel: {
        inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
        interval: 0, // 强制显示全部刻度名
        fontWeight: 'bold',
        lineHeight: 8,
      },
      // Note:需要改变的地方,data的数据
      data: option?.x_data?.last_line ?? [],
    },

    // 第二条x轴的线,用于分割两条x轴
    {
      position: 'bottom', // 将分组x轴位置定至底部，不然默认在顶部
      offset: 24, // 向下偏移，使分组文字显示位置不与原x轴重叠
      max: 179,
      interval: 1,
      axisTick: {
        length: 0, // 延长刻度线做分组线
        inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
        lineStyle: {color: '#000'}, // 非必须，仅为了演示，明显标示出分组刻度线
      },
      axisLabel: {
        inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
        interval: 0, // 强制显示全部刻度名
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: option.option.yaxis_name || '',
      min: 0,
      width: 1,
      //Todo：改变y轴的分隔符
      // max: 100,
      // interval: 20,
      // 网格线
      splitLine: {
        show: true,

        lineStyle: {
          color: option.option.grid_color || '#999999',
          width: Number(option.option.grid_width || 1),
          type: 'dashed',
        },
      },
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          // color: "#f4f4f4",
          fontSize: '14px',
        },
      },
    },
  ],
  series: option.y_data,
}

function renderChart() {
  const canvas = createCanvas(Number(option.option.chart_width), Number(option.option.chart_height))

  const chart = echarts.init(canvas)

  chart.setOption(chart_option)
  return canvas
}
//将canvas存储为图片
function saveImage(canvas) {
  const fs = require('fs')
  const out = fs.createWriteStream(
    require('path').resolve(
      __dirname,
      (option.option.save_path || './') + (option.option.save_name || 'chart.png')
    )
  )
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () => console.log('保存成功'))
}
saveImage(renderChart())
