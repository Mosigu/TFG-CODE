import {
  Text,
  Heading,
  Flex,
  Box,
  Card,
  Table,
  Container,
} from "@radix-ui/themes";
import { MainMenu } from "../components/MainMenu";
import { TaskCategory } from "../components/TaskCategory";

export default function userTasks() {
  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%">
        <Heading as="h1" size="8" weight="bold" highContrast>
          Profile
        </Heading>
      </Box>
    </Flex>
  );
}
