import { Flex, Text } from "@sanity/ui";

/** Studio wordmark shown top-left. */
export function Logo() {
  return (
    <Flex align="center" gap={2} paddingY={1}>
      <Text weight="semibold" size={2}>Naga</Text>
      <Text size={1} muted>Workspace</Text>
    </Flex>
  );
}
