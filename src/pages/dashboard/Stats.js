import { useEffect, useState } from "react";
import { StatsContainer} from '../../components';
import React from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const Stats = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("profile"));
    const accessToken = user.token;
    const header = `Bearer ${accessToken}`;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://birdtrading-api.azurewebsites.net/api/Charts/${user.id}`,
          {
            headers: {
              Authorization: header,
            },
          }
        );
        const data = res.data.data;
        setChartData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const formatTotalPrice = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    } else {
      return value;
    }
  };

  return (
    <>
      <div className="stats-container">
      <StatsContainer /> 
      </div>
      <h3 className="text-center">Chart Numbers of Order Income</h3>
      {chartData && (
        <div className="bar-chart-container">
          <BarChart width={1150} height={450} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatTotalPrice}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="totalPrice" tickFormatter={formatTotalPrice} fill="#8884d8" label={{ position: 'top', formatter: (value) => `${value} VND` }}/>
        </BarChart>
        </div>    
      )}
    </>
  );
};

export default Stats;
