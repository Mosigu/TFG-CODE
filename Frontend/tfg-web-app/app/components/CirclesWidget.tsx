import { Text, Flex } from "@radix-ui/themes";
import { ProgressCircle } from "./ProgressCircle";

interface CirclesWidgetProps {
  activeProjects: number;
  pendingTasks: number;
  openIncidences: number;
}

export const CirclesWidget = ({
  activeProjects,
  pendingTasks,
  openIncidences,
}: CirclesWidgetProps) => {
  return (
    <Flex
      align="center"
      justify="center" // center the circles
      width="100%"
      style={{ marginTop: "5rem", gap: "8rem" }}
    >
      <Flex direction="column" align="center" gap="3">
        <ProgressCircle value={activeProjects} size={200} />
        <Text size="7" weight="bold">
          Active projects
        </Text>
      </Flex>

      <Flex direction="column" align="center" gap="3">
        <ProgressCircle value={pendingTasks} size={200} />
        <Text size="7" weight="bold">
          Pending Tasks
        </Text>
      </Flex>

      <Flex direction="column" align="center" gap="3">
        <ProgressCircle value={openIncidences} size={200} />
        <Text size="7" weight="bold">
          Open Incidences
        </Text>
      </Flex>
    </Flex>
  );
};
