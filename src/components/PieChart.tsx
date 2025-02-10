import React, { useState, useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import axios from 'axios';

interface ProductData {
  productname: string;
  price: string;
}

interface ChartData {
  ProductName: string;
  Price: number;
}

const PieChart = () => {
  const [data, setData] = useState<ChartData[]>([]); 


  useEffect(() => {
      axios.get<ProductData[]>('http://localhost:5000/charts/products') 
      .then(response => {
        
        const formattedData: ChartData[] = response.data.map(item => ({
          ProductName: item.productname, 
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

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {})
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'Price',
          categoryField: 'ProductName'
        })
      );

      series.data.setAll(data); 
      series.appear(1000,100)

      return () => {
        root.dispose();
      };
    }
  }, [data]);

  return <div id="chartDiv" style={{ width: "100%", height: '200px' }}></div>;
};

export default PieChart;
