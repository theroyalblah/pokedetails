import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Stats = {
  stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  bst: number;
};

const StatsChart = ({ stats, bst }: Stats) => {
  const data = [
    { name: "Health", stat: stats.hp },
    { name: "Attack", stat: stats.atk },
    { name: "Defense", stat: stats.def },
    { name: "Special Attack", stat: stats.spa },
    { name: "Special Defense", stat: stats.spd },
    { name: "Speed", stat: stats.spe },
  ];

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
