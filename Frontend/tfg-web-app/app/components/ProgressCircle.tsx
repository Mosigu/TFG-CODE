"use client";
import { Box } from "@radix-ui/themes";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { iris, whiteA } from "@radix-ui/colors";
import "react-circular-progressbar/dist/styles.css";

type ProgressCircleProps = {
  value?: number;
  size?: number;
  text?: string;
};

export const ProgressCircle = ({
  value = 40,
  size = 200,
  text,
}: ProgressCircleProps) => {
  return (
    <Box style={{ width: size, height: size }}>
      <CircularProgressbar
        value={value}
        text={text ?? `${value}`}
        strokeWidth={8}
        styles={buildStyles({
          pathColor: iris.iris9, // progresS Color
          textColor: iris.iris9,
          trailColor: iris.iris3, // bg Color
          textSize: "1rem",
        })}
      />
    </Box>
  );
};
