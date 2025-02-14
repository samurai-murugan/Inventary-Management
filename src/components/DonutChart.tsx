import React, { useState, useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from 'axios';

interface ProductData {
  productname: string;
  price: string;
}

interface ChartData {
  ProductName: string;
  Price: number;
}

const DonutChart = () => {
  const [data, setData] = useState<ChartData[]>([]); 

  useEffect(() => {
    axios.get<ProductData[]>('http://localhost:5000/charts/products') 
      .then(response => {
        const formattedData: ChartData[] = response.data.map(item => ({
          ProductName: `${item.productname} Price:${item.price}`, 
          Price: Number(item.price)    
        }));

        setData(formattedData); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const root = am5.Root.new('chartDiv');
    
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          endAngle: 270,
          layout: root.verticalLayout,
          innerRadius: am5.percent(60)
        })
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'Price',
          categoryField: 'ProductName',
          endAngle: 270
        })
      );

      series.set("colors", am5.ColorSet.new(root, {
        colors: [
          am5.color(0x73556E),
          am5.color(0x9FA1A6),
          am5.color(0xF2AA6B),
          am5.color(0xF28F6B),
          am5.color(0xA95A52),
          am5.color(0xE35B5D),
          am5.color(0xFFA446)
        ]
      }));

      var gradient = am5.RadialGradient.new(root, {
        stops: [
          { color: am5.color(0x000000) },
          { color: am5.color(0x000000) },
          {}
        ]
      });

      series.slices.template.setAll({
        fillGradient: gradient,
        strokeWidth: 2,
        stroke: am5.color(0xffffff),
        cornerRadius: 10,
        shadowOpacity: 0.1,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowColor: am5.color(0x000000),
        fillPattern: am5.GrainPattern.new(root, {
          maxOpacity: 0.2,
          density: 0.5,
          colors: [am5.color(0x000000)]
        })
      });

      series.slices.template.states.create("hover", {
        shadowOpacity: 1,
        shadowBlur: 10
      });

      series.ticks.template.setAll({
        strokeOpacity: 0.4,
        strokeDasharray: [2, 2]
      });

      series.states.create("hidden", {
        endAngle: -90
      });

      var legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));
      legend.markerRectangles.template.adapters.add("fillGradient", function() {
        return undefined;
      });

      series.data.setAll(data);
      series.appear(1000, 100);

      series.labels.template.setAll({
        text:'{category}'
      });

      return () => {
        root.dispose();
      };
    }
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
    {data.length === 0 ? (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        fontSize: '20px', 
        color: 'gray' 
      }}>
        No Products Available
      </div>
    ) : (
      <div id="chartDiv" style={{ width: "100%", height: '200px' }}></div>
    )}
  </div>
 
  );
};

export default DonutChart;
