import {
  Card,
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Separator,
} from "@radix-ui/themes";

type UserEventProps = {
  userName?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  time?: string;
};

export const UserEvent = ({
  userName = "User Name",
  avatarSrc = "",
  avatarFallback = "U",
  time = "00:00",
}: UserEventProps) => {
  return (
    <Box>
      <Card variant="ghost">
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            src={avatarSrc}
            radius="full"
            fallback={avatarFallback}
          />
          <Flex gap="3" align="center">
            <Text as="div" size="2" weight="bold">
              {userName}
            </Text>
            <Separator orientation="vertical" />
            <Text as="div" size="2" color="gray">
              {time}
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};
