"use client";
import { Box, Card, Flex } from "@radix-ui/themes";
import {
  BellIcon,
  CardStackIcon,
  HomeIcon,
  PersonIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { MenuElement } from "./MenuElement";
import Link from "next/link";

export const MainMenu = () => {
  return (
    <Box
      width="80px"
      height="100vh"
      style={{
        minWidth: "80px",
        maxWidth: "80px",
        flexShrink: 0,
      }}
    >
      <Card
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "1rem 0",
        }}
      >
        <MenuElement Icon={HomeIcon} label="Home" href="/" />
        <MenuElement Icon={ReaderIcon} label="Projects" href="/projects" />
        <MenuElement Icon={CardStackIcon} label="My Tasks" href="/userTasks" />
        <MenuElement Icon={BellIcon} label="Activity" href="/activity" />
        <MenuElement Icon={PersonIcon} label="" href="/profile" />
      </Card>
    </Box>
  );
};
