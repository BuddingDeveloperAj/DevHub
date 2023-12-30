"use client";

import React from "react";
import HeatMap from "@uiw/react-heat-map";
import moment from "moment";
import { useTheme } from "@/context/ThemeProvider";
import Tooltip from "@uiw/react-tooltip";

interface Date {
  date: string;
  count: number;
}

const currentYear = moment().year();
const isLeapYear = moment([currentYear]).isLeapYear();
const totalDays = isLeapYear ? 366 : 365;

const value: Date[] = [];

for (let i = 0; i < totalDays; i++) {
  const obj = {
    date: moment()
      .year(2023)
      .dayOfYear(i + 1)
      .format("YYYY/MM/DD"),
    count: Math.round(Math.random() * 5),
  };
  value.push(obj);
}

console.log(value.length);

const LoginHeatMap = () => {
  const { mode } = useTheme();

  return (
    <div className="flex-center w-full p-5">
      <HeatMap
        value={value}
        weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
        width={800}
        rectSize={12}
        rectProps={{
          rx: 2.3,
        }}
        style={{
          backgroundColor: mode === "dark" ? "#000" : "#fff",
          color: mode === "dark" ? "#888" : "#000",
        }}
        space={2.5}
        legendCellSize={7}
        panelColors={
          mode === "dark"
            ? {
                1: "#343a40",
                2: "#70e000",
                3: "#38b000",
                4: "#007200", // Medium shade of green
                5: "#008000", // Darkest shade of green
              }
            : {
                1: "#FFE0B2",
                2: "#FFCC80",
                3: "#FFB74D",
                4: "#FFA726", // Medium shade of orange
                5: "#FF9800",
              }
        }
        startDate={moment().year(currentYear).dayOfYear(1).toDate()}
        rectRender={(props, data) => {
          return (
            <Tooltip
              placement="top"
              content={` ${data.count || 0} actions on ${moment(
                data.date
              ).format("MMM DD, YYYY")}`}
            >
              <rect {...props} />
            </Tooltip>
          );
        }}
        endDate={moment().year(currentYear).dayOfYear(totalDays).toDate()}
      />
    </div>
  );
};

export default LoginHeatMap;
