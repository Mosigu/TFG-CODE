import { Text, Heading, Flex, Box } from "@radix-ui/themes";
import { MainMenu } from "./components/MainMenu";
import { CirclesWidget } from "./components/CirclesWidget";

export default function Home() {
  return (
    <Flex gap="5">
      <MainMenu />
      <Box width="100%">
        <Flex gap="9" direction="column">
          <Heading as="h1" size="8" weight="bold" highContrast>
            Home
          </Heading>
          <Heading as="h1" size="7" weight="bold" highContrast align="center">
            You have
          </Heading>
        </Flex>
        <CirclesWidget />
      </Box>
    </Flex>
  );
}
