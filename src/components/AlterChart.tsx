import { useEffect, useState } from 'react'; 
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import axios from 'axios';

interface ChartData {
  date: Date;
  value: number;
  product: string;
}

interface ProductData {
  product: string;
  quantity: number;
  created_date: string;
} 

const AlterChart = () => {
  const [datas, setDatas] = useState<ChartData[]>([]);

  const productIcons: { [key: string]: string } = {
    "Laptop": "https://img.icons8.com/?size=100&id=2884&format=png&color=000000",
    "Headphone": "https://img.icons8.com/?size=100&id=100059&format=png&color=000000",
    "Keyboard": "https://img.icons8.com/?size=100&id=519&format=png&color=000000",
    "Mouse": "https://img.icons8.com/?size=100&id=520&format=png&color=000000",
    "Mobile": "https://img.icons8.com/?size=100&id=UYmVJ09dKuF8&format=png&color=000000",
    "Bag": "https://img.icons8.com/?size=100&id=21821&format=png&color=000000",
    "Pen": "https://img.icons8.com/?size=100&id=15027&format=png&color=000000",
  };

  useEffect(() => {
    axios.get<ProductData[]>('http://localhost:5000/charts/OrderDetails')
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          date: new Date(item.created_date),
          value: item.quantity,
          product: item.product,
        }));
        console.log(formattedData, "formatted Data");
        setDatas(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  },[]);

  useEffect(() => {
    if (!datas.length) return; // Don't initialize the chart until data is available

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
        paddingLeft: 0
      })
    );

    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none"
      })
    );
    cursor.lineY.set("visible", false);

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
    xAxis.get('renderer').grid.template.setAll({
      location:0,
      visible: false, 
    });
    xAxis.children.moveValue(
      am5.Label.new(root, {
        text: "Created Order",
        x: am5.p50,
        centerX: am5.p50,
         fontSize:'12px'
      }),
      xAxis.children.length - 1
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
    yAxis.get('renderer').grid.template.setAll({
      location:0,
      visible: false, 
    });

    yAxis.children.moveValue(
      am5.Label.new(root, {
        rotation: -90,
        text: "Total Order",
        y: am5.p50,
        centerX: am5.p50,
        fontSize:'12px'
      }),
      0
    );

      let j=-1;
      
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
            labelText: "{product}: {valueY}"
          })
        })
      );

    series.data.processor = am5.DataProcessor.new(root, {
      dateFormat: "yyyy-MM-dd HH:mm",
      dateFields: ["date"]
    });

    series.strokes.template.setAll({ strokeDasharray: [3, 3], strokeWidth: 2 });
   
    let i = -1;
    // Bullet icons based on product
    series.bullets.push(function (root) {
      i++;
      let container = am5.Container.new(root, {
        centerX: am5.p50,
        centerY: am5.p50
      }); 

      const product = datas[i].product;
      const iconUrl = productIcons[product] || "https://amcharts.com/wp-content/uploads/assets/timeline/default.svg"; // Default icon if not found
      const tooltipText = `${product}: {valueY}`;

      container.children.push(
        am5.Circle.new(root, { radius: 20, fill: series.get("fill") })
      );


      const picture = am5.Picture.new(root, {
        centerX: am5.p50,
        centerY: am5.p50,
        width: 23,
        height: 23,
        src: iconUrl,
      });
      container.children.push(picture);
      picture.events.on("pointerover", function () {
        picture.set("tooltipText", tooltipText); // Set tooltip text on hover
      });

      picture.events.on("pointerout", function () {
        picture.set("tooltipText", ""); // Clear tooltip when not hovering
      });

      container.children.push(
        am5.Picture.new(root, {
          centerX: am5.p50,
          centerY: am5.p50,
          width: 23,
          height: 23,
          src: iconUrl,
         tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "vertical", 
            dy: -20,
            labelText:tooltipText
          })
        })    
      );

      return am5.Bullet.new(root, {
        sprite: container
      });
    });

    series.data.setAll(datas);
    series.appear(1000);

    chart.appear(1000, 100);

    return () => {
      root.dispose(); // Cleanup chart when component unmounts
    };
  }, [datas]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      {datas.length === 0 ? (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          fontSize: '13px', 
          color: 'gray' 
        }}>
          No Orders Available
        </div>
      ) : (
        <div id="TimeLineCharts" style={{ width: "100%", height: "100%" }}></div>
      )}
    </div>
  );
};

export default AlterChart;
