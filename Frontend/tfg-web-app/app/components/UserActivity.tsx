import { Card, Box, Flex, Text } from "@radix-ui/themes";
import { UserEvent } from "./UserEvent";

interface UserActivityProps {
  text?: string;
}

export const UserActivity: React.FC<UserActivityProps> = ({
  text = "User activity in project/task/incidence",
}) => {
  return (
    <Box width="35%">
      <Card>
        <UserEvent />
        <Text size="3">{text}</Text>
      </Card>
    </Box>
  );
};
