import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

  const colors = [
    "#FF5959",
    "#F5AC78",
    "#FAE078",
    "#9DB7F5",
    "#A7DB8D",
    "#FA92B2",
  ];

  return (
    <section className="statChart">
      <h2>Stats</h2>
      <BarChart width={800} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="stat" fill="#8884d8" label={{ position: "top" }}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
      <p>Base stat total: {bst}</p>
    </section>
  );
};

export default StatsChart;
