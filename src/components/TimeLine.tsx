import React, { useEffect } from 'react';
import am5index from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";

const productIcons: { [key: string]: string } = {
  "Laptop": "https://img.icons8.com/?size=100&id=2884&format=png&color=000000",
  "Headphone": "https://img.icons8.com/?size=100&id=100059&format=png&color=000000",
  "Keyboard": "https://img.icons8.com/?size=100&id=kS4IVuEzA1TQ&format=png&color=000000",
  "Mouse": "https://img.icons8.com/?size=100&id=13347&format=png&color=000000",
  "Mobile": "https://img.icons8.com/?size=100&id=UYmVJ09dKuF8&format=png&color=000000",
};

const TimeLine = () => {

  useEffect(() => {

    let root = am5.Root.new("TimeLineCharts");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        pinchZoomX: true,
        paddingLeft: 0
      })
    );

    // Add cursor
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none"
      })
    );
    cursor.lineY.set("visible", false);

    let colorSet = am5.ColorSet.new(root, {});

    // The data
    let data = [
      { date: "2021-12-31 18:00", value: 0, prductname: 'Laptop' },
      { date: "2021-12-31 19:00", value: 0, prductname: 'Mouse' },
      { date: "2021-12-31 20:00", value: 0, prductname: 'Keyboard' },
      { date: "2021-12-31 21:00", value: 0.3, prductname: 'Mouse' },
      { date: "2021-12-31 22:00", value: 0.8, prductname: 'Laptop' },
      { date: "2021-12-31 23:00", value: 1.2, prductname: 'Laptop' },
      { date: "2022-01-01 00:00", value: 2.2, prductname: 'Keyboard' },
    ];

    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 70
    });
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
      location: 0.5,
      multiLocation: 0.5
    });

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "hour", count: 1 },
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    let yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.set("forceHidden", true);
    yRenderer.labels.template.set("minPosition", 0.05);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxPrecision: 0,
        extraMin: 0.1,
        renderer: yRenderer
      })
    );

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
          labelText: "{valueY}"
        })
      })
    );

    // Set up data processor to parse string dates
    series.data.processor = am5.DataProcessor.new(root, {
      dateFormat: "yyyy-MM-dd HH:mm",
      dateFields: ["date"]
    });

    series.strokes.template.setAll({ strokeDasharray: [3, 3], strokeWidth: 2 });

    let i = -1;
    series.bullets.push(function () {
      i++;

      if (i > 7) {
        i = 0;
      }

      let container = am5.Container.new(root, {
        centerX: am5.p50,
        centerY: am5.p50
      });

      // Get product icon URL based on product name
      const productName = data[i].prductname; // use the corresponding product name for each data point
      const productIconUrl = productIcons[productName] || ""; // Default to empty string if no matching icon found

      container.children.push(
        am5.Circle.new(root, { radius: 20, fill: series.get("fill") })
      );

      if (productIconUrl) {
        container.children.push(
          am5.Picture.new(root, {
            centerX: am5.p50,
            centerY: am5.p50,
            width: 23,
            height: 23,
            src: productIconUrl
          })
        );
      }

      return am5.Bullet.new(root, {
        sprite: container
      });
    });

    series.data.setAll(data);
    series.appear(1000);

    // Make stuff animate on load
    chart.appear(1000, 100);
    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id='TimeLineCharts' style={{ width: "100%", height: '500px' }}></div>
  );
}

export default TimeLine;
