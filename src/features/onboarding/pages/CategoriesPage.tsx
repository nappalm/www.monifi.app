import {
  Container,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import CategoriesForm from "../components/CategoriesForm";
import FormButtons from "../components/FormButtons";
import GridDotted from "../components/GridDotted";
import { ONBOARDING_PATHS } from "../router";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const onBack = () => navigate(ONBOARDING_PATHS.accounts);
  const onNext = () => navigate(ONBOARDING_PATHS.appFeatures);
  const onSkip = () => navigate(ONBOARDING_PATHS.appFeatures);

  return (
    <AnimatedPage>
      <GridDotted>
        <Container maxW={"500px"}>
          <Stack pt="30%">
            <Heading variant="onboarding-title" size="md">
              Categories
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Create categories to classify your income and expenses. This will
              help you understand where your money is coming from and where it
              is going.
            </Text>
            <CategoriesForm />
            <br />
            <FormButtons onBack={onBack} onNext={onNext} onSkip={onSkip} />
          </Stack>
        </Container>
      </GridDotted>
    </AnimatedPage>
  );
}
