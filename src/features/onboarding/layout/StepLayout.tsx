import { Logo } from "@/shared";
import {
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconCircleCheckFilled,
  IconCircleDotFilled,
  IconCircleFilled,
} from "@tabler/icons-react";
import { PropsWithChildren } from "react";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";

const steps = [
  {
    title: "Welcome",
    description: "Start your journey to financial freedom",
  },
  {
    title: "Setup your profile",
    description: "Personalize your experience",
  },
  {
    title: "Wallets",
    description: "Connect your accounts and wallets",
  },
  {
    title: "Categories",
    description: "Organize your income and expenses",
  },
  {
    title: "Resume",
    description: "Review and confirm your setup",
  },
];

type Props = {
  activeStep: number;
} & PropsWithChildren;

export default function StepLayout({ children, activeStep = 1 }: Props) {
  const isSmallScreen =
    useBreakpointValue({ base: true, lg: false }, { ssr: false }) ?? false;

  const stepActiveColor = useColorModeValue("#000", "#fff");

  return (
    <Grid
      gridAutoFlow="column"
      gridTemplateColumns={
        isSmallScreen ? "minmax(0, 80px) 1fr" : "minmax(0, 400px) 1fr"
      }
      gridGap={isSmallScreen ? "12px" : "24px"}
      py={5}
    >
      <Card height="95vh" variant="solid" position="sticky" top="20px">
        <CardBody
          p={{ base: 0, lg: 10 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <HStack
            position="absolute"
            left={{
              base: 7,
              lg: 5,
            }}
            top={5}
            opacity={0.5}
          >
            <Logo height={6} width={6} />
            <Text
              textTransform="uppercase"
              fontFamily="Geist Mono"
              display={{
                base: "none",
                lg: "block",
              }}
            >
              Monifi.app
            </Text>
          </HStack>
          <Stepper
            index={activeStep}
            orientation="vertical"
            height="400px"
            gap="0"
            colorScheme="gray"
            width={{
              base: "auto",
              lg: "100%",
            }}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator
                  border="none"
                  sx={{
                    "[data-status=complete] &": {
                      background: "transparent",
                      color: "inherit",
                    },
                    "[data-status=active] &": {
                      background: "transparent",
                      color: "inherit",
                    },
                    "[data-status=incomplete] &": {
                      background: "transparent",
                      color: "gray.600",
                    },
                  }}
                >
                  <StepStatus
                    complete={<IconCircleCheckFilled size={18} />}
                    incomplete={<IconCircleFilled size={13} />}
                    active={<IconCircleDotFilled size={18} />}
                  />
                </StepIndicator>

                <Box
                  minWidth="0"
                  flex="1"
                  display={{ base: "none", lg: "block" }}
                >
                  <StepTitle
                    textTransform="uppercase"
                    fontFamily="Geist Mono"
                    fontSize="lg"
                    wordBreak="break-word"
                    sx={{
                      "[data-status=active] &": {
                        color: stepActiveColor,
                      },
                      "[data-status=incomplete] &": {
                        color: "gray.500",
                      },
                    }}
                  >
                    {step.title}
                  </StepTitle>
                  <StepDescription
                    fontFamily="Geist Mono"
                    fontSize="md"
                    wordBreak="break-word"
                    sx={{
                      "[data-status=active] &": {
                        color: stepActiveColor,
                      },
                      "[data-status=incomplete] &": {
                        color: "gray.500",
                      },
                    }}
                  >
                    {step.description}
                  </StepDescription>
                </Box>

                <StepSeparator
                  bg="transparent"
                  borderLeft="2px dashed"
                  borderColor="inherit"
                />
              </Step>
            ))}
          </Stepper>
        </CardBody>
      </Card>
      <OnboardingAnimatedPage>{children}</OnboardingAnimatedPage>
    </Grid>
  );
}
