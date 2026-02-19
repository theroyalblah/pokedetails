import { BarChart } from "@mui/x-charts/BarChart";
import React, { useState, useEffect } from "react";
import { STAT_LABELS_SHORT, STAT_LABELS_FULL, STAT_COLORS } from "../utils/constants";

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

  const statValues = [
    stats.hp,
    stats.atk,
    stats.def,
    stats.spa,
    stats.spd,
    stats.spe,
  ];

  const isDesktop = width > 1200;

  const baseStatTotal = bst
    ? bst
    : stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

  const labels = isDesktop && !isSmall ? STAT_LABELS_FULL : STAT_LABELS_SHORT;

  const series = statValues.map((value, index) => ({
    data: statValues.map((_, i) => (i === index ? value : 0)),
    label: labels[index],
    id: `stat-${index}`,
    color: STAT_COLORS[index],
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
