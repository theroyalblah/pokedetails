import { BarChart } from "@mui/x-charts/BarChart";
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
  isSmall?: boolean;
};

const getWindowWidth = () => window.innerWidth;

const StatsChart = ({ stats, bst, isSmall }: Stats) => {
  const [width, setWidth] = useState(getWindowWidth());

  useEffect(() => {
    const handleResize = () => {
      setWidth(getWindowWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopLabels = [
    "Health",
    "Attack",
    "Defense",
    "Special Attack",
    "Special Defense",
    "Speed",
  ];
  const mobileLabels = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];

  const statValues = [
    stats.hp,
    stats.atk,
    stats.def,
    stats.spa,
    stats.spd,
    stats.spe,
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

  const baseStatTotal = bst
    ? bst
    : stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

  const labels = isDesktop && !isSmall ? desktopLabels : mobileLabels;

  const series = statValues.map((value, index) => ({
    data: statValues.map((_, i) => (i === index ? value : 0)),
    label: labels[index],
    id: `stat-${index}`,
    color: colors[index],
    stack: "total",
  }));

  return (
    <>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: labels,
          },
        ]}
        hideLegend={true}
        series={series}
        height={isSmall ? 150 : 300}
        slotProps={{ tooltip: { trigger: "item" } }}
      />
      <p style={{textAlign: "center"}}>Base Stat Total (BST): {baseStatTotal}</p>
    </>
  );
};

export default StatsChart;
