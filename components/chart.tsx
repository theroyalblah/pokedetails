import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from "recharts";
import React, { useState, useEffect } from "react";

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

const getWindowWidth = () => window.innerWidth;

const StatsChart = ({ stats, bst }: Stats) => {
  const [width, setWidth] = useState(getWindowWidth());

  useEffect(() => {
    const handleResize = () => {
      setWidth(getWindowWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopData = [
    { name: "Health", stat: stats.hp },
    { name: "Attack", stat: stats.atk },
    { name: "Defense", stat: stats.def },
    { name: "Special Attack", stat: stats.spa },
    { name: "Special Defense", stat: stats.spd },
    { name: "Speed", stat: stats.spe },
  ];

  const mobileData = [
    { name: "HP", stat: stats.hp },
    { name: "Atk", stat: stats.atk },
    { name: "Def", stat: stats.def },
    { name: "SpA", stat: stats.spa },
    { name: "SpD", stat: stats.spd },
    { name: "Spe", stat: stats.spe },
  ];

  const colors = [
    "#FF5959",
    "#F5AC78",
    "#FAE078",
    "#9DB7F5",
    "#A7DB8D",
    "#FA92B2",
  ];

  const isDesktop = width > 1200;
  const widthThreshold = 576;

  return (
    <section className="statChart">
      <h2>Stats</h2>

      <BarChart
        width={width > widthThreshold ? width * 0.6 : width - 50}
        height={250}
        data={isDesktop ? desktopData : mobileData}
        margin={{ top: 25 }}
      >
        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="stat" label={{ position: "top" }}>
          {desktopData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
      <p>Base stat total: {bst}</p>
    </section>
  );
};

export default StatsChart;
