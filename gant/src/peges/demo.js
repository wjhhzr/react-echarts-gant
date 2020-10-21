import React, { useEffect, useState } from 'react'
import '../static/demo.css'
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入地图
import 'echarts/lib/component/geo'
// 引入饼图
import 'echarts/lib/chart/pie'
// 引入graphic
import 'echarts/lib/component/graphic'
// 引入graphic
import 'echarts/lib/component/axisPointer'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// 引入legend
import 'echarts/lib/component/legend'


function Demo() {
    // 二charts数据变量
    let data = [];
    // dataSource为原始数据，横轴为startTime,和endTime，其他数据为纵轴展示项，可以替换
    const dataSource = [
        { workpiece: 0, process: 0, machine: 0, startTime: 2, endTime: 5 },
        { workpiece: 0, process: 1, machine: 1, startTime: 5, endTime: 7 },
        { workpiece: 0, process: 2, machine: 2, startTime: 7, endTime: 9 },
        { workpiece: 1, process: 0, machine: 0, startTime: 0, endTime: 2 },
        { workpiece: 1, process: 1, machine: 2, startTime: 2, endTime: 3 },
        { workpiece: 1, process: 2, machine: 1, startTime: 7, endTime: 11 },
        { workpiece: 2, process: 0, machine: 1, startTime: 0, endTime: 4 },
        { workpiece: 2, process: 1, machine: 2, startTime: 4, endTime: 7 }
    ];
    // 一堆颜色集，画每一个图块需要
    const Colors = [
        "#BB86D7",
        "#FFAFF0",
        "#5BC3EB",
        "#B5E2FA",
        "#A9D5C3",
        "#73DCFF",
        "#DCB0C6",
        "#F9CDA5",
        "#FBE6D2",
        "#B5E2FA",
        "#B8FFCE",
        "#FFE4E2",
        "#F7AF9D",
        "#BBF9B4",
        "#FFEE93",
        "#2CEAA3",
        "#ECC2C2",
        "#C8CACA"
    ];
    // 解构赋值，keys可以取对象（字典）的key
    const { keys } = Object;

    // 以machine为纵坐标轴绘制甘特图（这里还可以以工件为坐标轴）
    let machines = dataSource.reduce((acc, cur) => {
        acc[cur.machine] ? acc[cur.machine].push(cur) : acc[cur.machine] = [cur];
        return acc;
    }, {});
    // 这里可以替换为自己想绘制的数据项，如果你们只显示飞行计划的话，这里只需要用一个就好了
    let workpieces = dataSource.reduce((acc, cur) => {
        acc[cur.workpiece] ? acc[cur.workpiece].push(cur) : acc[cur.workpiece] = [cur];
        return acc;
    }, {});

    // 存储颜色映射的变量
    let workpieceColors = {};
    // 循环映射颜色
    keys(machines).forEach((v, i) => workpieceColors[v] = Colors[i]);
    // 关键
    keys(machines).forEach((k) => {
        machines[k].forEach(v => {
            let duration = v.endTime - v.startTime;
            data.push({
                name: v.workpiece, // 图块名称
                value: [k, v.startTime, v.endTime, duration], // 名称， 起始时间， 终止时间，持续时间
                itemStyle: {
                    normal: {
                        color: workpieceColors[v.workpiece] // 图块颜色
                    }
                }
            });
        });
    });


    function renderItem(params, api) {
        // 通过params可得到data中渲每一项数据在图表中的信息，包括索引，encode映射等等
        console.log(params);
        // 通过api，数据项的宽，高，值，样式等等
        console.log(api);
        // 具体文档地址https://echarts.apache.org/zh/option.html#series-custom
        var categoryIndex = api.value(0);
        var start = api.coord([api.value(1), categoryIndex]);
        var end = api.coord([api.value(2), categoryIndex]);
        var height = api.size([0, 1])[1] * 0.6;
        // graphic是原生图形元素组件，echarts查文档，这里可以控制色块的宽高
        var rectShape = echarts.graphic.clipRectByRect(
            {
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
            },
            {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            }
        );

        return rectShape && {
            // type rect表示绘制矩形。api.style表示获取data数据项中的样式
            type: 'rect',
            shape: rectShape,
            style: api.style()
        };
    }

    let option = {
        // 鼠标移入时的提示
        tooltip: {
            formatter: function (params) {
                return params.marker + params.name + ': ' + params.value[3] + ' ms';
            }
        },
        // 设置整体背景颜色，这里是透明
        backgroundColor: 'transparent',
        title: {
            // 标题
            text: '飞机飞行计划',
            // 位置，left,right,center
            left: 'center',
            // 文字样式
            textStyle: {
                color: 'rgba(23,24,25)',
                fontFamily: 'Microsoft YaHei',
                fontWeight: 600,
                fontSize: 25,
            },
        },
        // 这是图例，把你想要的图例做成数组放在data里，我先注释掉
        // legend: {
        //     data: [],
        //     textStyle: {
        //         color: '#fff',
        //     }
        // },
        // 此处可以设置图标在dom中绘制的位置，可以设置left，right，bottom，top
        // grid: {
        //     height: 300
        // },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            nameTextStyle: {
                color: '#fff',
            },
            axisLabel: {
                interval: 0,//代表显示所有x轴标签显示间隔，坐标轴数据文字太密集可以设置这里
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0,0,0,1)',
                },
            },
            // 缩放
            scale: true,
        },
        yAxis: {
            data: keys(machines) // 机器编号为纵坐标轴
        },
        series: [{
            // custom用于创建自定义的图表
            type: 'custom',
            // 在renderItem中自定义图像处理逻辑，包含参数为params, api。params为data中的当前数据项
            renderItem: renderItem,
            itemStyle: {
                normal: {
                    opacity: 0.8
                }
            },
            encode: {
                x: [1, 2],
                y: 0
            },
            data: data
        }]
    };
    console.log(option);
    // 此处监听option的变化，对图表数据进行渲染
    useEffect(() => {
        let gantChart = echarts.init(document.getElementById('demo-gant'), 'light');
        gantChart.setOption(option);
        // 监听屏幕变化，重绘图表
        window.addEventListener('resize', () => {
            gantChart.resize()
        });
    }, [option])
    return (
        <div className="demo-wapper">
            <div id="demo-gant" style={{ width: '80vw', height: '80vh' }}></div>
        </div>
    )
}

export default Demo