import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Text,
} from "@chakra-ui/react";

type Props = {
  onView?: VoidFunction;
};
export default function BudgetCart({ onView }: Props) {
  return (
    <Card size="sm">
      <CardHeader>
        <HStack justify="space-between">
          <Text fontSize="sm">My budget</Text>
          <Button size="sm" onClick={onView}>
            View
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Text>My budget</Text>
      </CardBody>
    </Card>
  );
}
