import { Stack } from "@chakra-ui/react";
import Banner from "../components/Banner";
import TableLibs from "../components/TableLibs";

export default function Home() {
  return (
    <Stack gap={5}>
      <Banner />
      <TableLibs />
    </Stack>
  );
}
