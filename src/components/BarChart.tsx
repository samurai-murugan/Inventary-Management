import React, { useEffect, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from 'axios';


interface ProductData {
  productname: string;
  quantity: string; 
}

interface ChartData {
  product: string;
  quantity: number;
}

const BarChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]); 

  useEffect(() => {
    axios.get<ProductData[]>('http://localhost:5000/charts/quantity') 
      .then(response => {
        
        const formattedData: ChartData[] = response.data.map(item => ({
          product: item.productname,  
          quantity: parseInt(item.quantity, 10) 
        }));
        setData(formattedData); // Set the formatted data into the state
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return; 

    let root = am5.Root.new("BarChart");
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the XY chart
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0,
      paddingRight: 1
    }));

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create the X-axis
    let xRenderer = am5xy.AxisRendererX.new(root, {
      stroke:  am5.color("#000"),
      minGridDistance: 20,
      minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    xRenderer.grid.template.setAll({
      location: 1
    });
     
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "product",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    xAxis.children.moveValue(
      am5.Label.new(root, {
        text: "Product",
        x: am5.p50,
        centerX: am5.p50,
      }),
      xAxis.children.length - 1
    );

    
     
    // Create the Y-axis
    let yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1,
      stroke:  am5.color("#000")
    });

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      
      renderer: yRenderer
    }));


    yAxis.children.moveValue(
      am5.Label.new(root, {
        rotation: -90,
        text: "Quantity",
        y: am5.p50,
        centerX: am5.p50,
      }),
      0
    );
  // yAxis.get('renderer').grid.template.setAll({
  //   strokeWidth:0,
  //   visible:false,
  // })
   

  
yAxis.get('renderer').grid.template.setAll({

  visible: false,
});

xAxis.get('renderer').grid.template.setAll({
  location:1,
  visible: false, 
});

    // Create the column series (bar chart)
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "quantity",
      categoryXField: "product",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

    series.columns.template.adapters.add("fill", function (fill, target) {
      return am5.color(0x67b7dc);
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return am5.color(0x67b7dc);
    });

    // Use the fetched and formatted data to populate the chart
    xAxis.data.setAll(data);
    series.data.setAll(data);

    // Make the chart appear with animation
    series.appear(1000, 100);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
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
        <div id="BarChart" style={{ width: "100%", height: '200px' }}></div>
      )}
    </div>
   
  );
};

export default BarChart;
