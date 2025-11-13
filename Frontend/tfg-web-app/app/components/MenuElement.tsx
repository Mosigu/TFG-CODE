"use client";

import { Text, Box, IconButton } from "@radix-ui/themes";
import Link from "next/link";

type MenuElementProps = {
  Icon: React.ElementType;
  label: string;
  href?: string;
};

export const MenuElement = ({ Icon, label, href }: MenuElementProps) => {
  const buttonContent = (
    <IconButton
      variant="ghost"
      size="4"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <Icon style={{ width: "50%", height: "50%" }} />
      <Text weight="bold" size="3" align="center">
        {label}
      </Text>
    </IconButton>
  );

  return (
    <Box
      style={{
        width: "100%",
        aspectRatio: "1 / 1.2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {href ? (
        <Link href={href} style={{ display: "contents" }}>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </Box>
  );
};
