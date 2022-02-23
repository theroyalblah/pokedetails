import Pokedex from "pokedex-promise-v2";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatsChartProps = {
  stats: Pokedex.StatElement[];
};

const StatsChart = ({ stats }: StatsChartProps) => {
  const statNames = [
    "Health",
    "Attack",
    "Defense",
    "Special Attack",
    "Special Defense",
    "Speed",
  ];

  let bst = 0;

  const data = stats.map((stat, i) => {
    bst += stat.base_stat;
    return {
      name: statNames[i],
      stat: stat.base_stat,
    };
  });

  return (
    <section className="statChart">
      <h2>Stats</h2>
      <BarChart width={800} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="#ADD8E6" />
            <stop offset="90%" stopColor="#82ca9d" />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="stat" fill="url(#colorPv)" />
      </BarChart>
      <p>Base stat total: {bst}</p>
    </section>
  );
};

export default StatsChart;
