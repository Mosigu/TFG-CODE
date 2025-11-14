import { Card, Box, Text, Flex, ScrollArea, Badge } from "@radix-ui/themes";

type TaskCategoryProps = {
  title: string;
  count: number;
  children?: React.ReactNode;
};

export const TaskCategory = ({ title, count, children }: TaskCategoryProps) => {
  return (
    <Box
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: "280px",
      }}
    >
      <Flex align="center" gap="3" mb="3">
        <Text size="5" weight="bold">
          {title}
        </Text>
        <Badge color="gray" size="2" radius="full">
          {count}
        </Badge>
      </Flex>
      <Card
        size="3"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "1.25rem",
          minHeight: "60vh",
          maxHeight: "70vh",
        }}
      >
        <ScrollArea
          type="auto"
          scrollbars="vertical"
          style={{ height: "100%", width: "100%" }}
        >
          <Flex direction="column" gap="3">
            {children && children}
            {!children && (
              <Text size="3" color="gray" align="center" mt="6">
                No tasks
              </Text>
            )}
          </Flex>
        </ScrollArea>
      </Card>
    </Box>
  );
};
