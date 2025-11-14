import { Box } from "@radix-ui/themes";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: string;
}

/**
 * PageContainer - Componente centralizado para páginas
 * Proporciona un layout consistente, centrado y responsive
 */
export const PageContainer = ({
  children,
  maxWidth = "1400px",
}: PageContainerProps) => {
  return (
    <Box
      width="100%"
      px={{ initial: "4", sm: "6", md: "8" }}
      py="6"
      style={{
        maxWidth,
        margin: "0 auto",
      }}
    >
      {children}
    </Box>
  );
};
