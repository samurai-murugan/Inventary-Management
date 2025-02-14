import React, { useEffect, useState } from 'react';
import am5index from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import axios from 'axios';

interface ProductData {
  product: string;
  quantity: number;
  created_date: string;
}

const TimeLineChart: React.FC = () => {
  const [data, setData] = useState<{ date: any; value: number }[]>([]);

  // Fetch data from the API
  useEffect(() => {
    axios.get<ProductData[]>('http://localhost:5000/charts/OrderDetails')
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          date: new Date(item.created_date),
          value: item.quantity,
        }));
        console.log(formattedData, "formatted Data");
        setData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) 
      
      return;  // Exit if there's no data

    let root = am5.Root.new("TimeLineCharts");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        pinchZoomX: true,
        paddingLeft: 0,
      })
    );

    // Add cursor
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    // Create X-axis renderer
    let xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 70,
    });
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
      location: 0.5,
      multiLocation: 0.5,
    });

    // Set the baseInterval to seconds (1 second precision)
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "second", count: 1 }, // Change from "hour" to "second"
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Create Y-axis renderer
    let yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.set("forceHidden", true);
    yRenderer.labels.template.set("minPosition", 0.05);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        extraMin: 0.1,
        renderer: yRenderer,
      })
    );

    // Create series
    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "vertical",
          dy: -20, 
          labelText: "{valueY}", 
         
        }),
      })
    );

    series.data.processor = am5.DataProcessor.new(root, {
      dateFormat: "yyyy-MM-dd HH:mm", // Match the format in your data
      dateFields: ["date"],
    });

    // Customize series appearance
    series.strokes.template.setAll({ strokeDasharray: [3, 3], strokeWidth: 2 });

    // Add bullets with images
    let i = -1;
    series.bullets.push(function () {
      i++;

      if (i > 7) {
        i = 0;
      }

      let container = am5.Container.new(root, {
        centerX: am5.p50,
        centerY: am5.p50,
      });

      container.children.push(
        am5.Circle.new(root, { radius: 20, fill: series.get("fill") })
      );

      container.children.push(
        am5.Picture.new(root, {
          centerX: am5.p50,
          centerY: am5.p50,
          width: 23,
          height: 23,
          src: "https://amcharts.com/wp-content/uploads/assets/timeline/timeline" + i + ".svg",
        })
      );

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Set the chart data when it's fetched
    series.data.setAll(data);
    series.appear(1000);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div id="TimeLineCharts" style={{ width: "100%", height: "400px" }}></div>
  );
};

export default TimeLineChart;
