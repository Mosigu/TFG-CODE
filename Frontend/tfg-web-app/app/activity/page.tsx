import { Heading, Flex, Box, Button } from "@radix-ui/themes";
import { MainMenu } from "../components/MainMenu";
import { HeightIcon } from "@radix-ui/react-icons";

export default function userTasks() {
  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%">
        <Heading as="h1" size="8" weight="bold" highContrast>
          Activity
        </Heading>
      </Box>
    </Flex>
  );
}
