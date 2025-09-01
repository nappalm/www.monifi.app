import {
  Heading,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const technologies = [
  {
    name: "React",
    description: "A JavaScript library for building user interfaces.",
    url: "https://reactjs.org/",
  },
  {
    name: "Vite",
    description:
      "A fast build tool and development server for modern web projects.",
    url: "https://vitejs.dev/",
  },
  {
    name: "TypeScript",
    description:
      "A typed superset of JavaScript that compiles to plain JavaScript.",
    url: "https://www.typescriptlang.org/",
  },
  {
    name: "Chakra UI",
    description:
      "A simple, modular and accessible component library for React.",
    url: "https://chakra-ui.com/",
  },
  {
    name: "React Router",
    description: "A standard library for routing in React.",
    url: "https://reactrouter.com/",
  },
  {
    name: "TanStack Query",
    description: "A powerful data-fetching and state management library.",
    url: "https://tanstack.com/query/latest",
  },
  {
    name: "React Hook Form",
    description:
      "A performant, flexible and extensible forms library for React.",
    url: "https://react-hook-form.com/",
  },
  {
    name: "Yup",
    description:
      "A JavaScript schema builder for value parsing and validation.",
    url: "https://github.com/jquense/yup",
  },
  {
    name: "Supabase",
    description:
      "An open source Firebase alternative for building secure and scalable backends.",
    url: "https://supabase.io/",
  },
  {
    name: "Axios",
    description: "A promise-based HTTP client for the browser and Node.js.",
    url: "https://axios-http.com/",
  },
  {
    name: "MSW (Mock Service Worker)",
    description: "An API mocking library for seamless development and testing.",
    url: "https://mswjs.io/",
  },
  {
    name: "Vitest",
    description: "A blazing fast unit-test framework powered by Vite.",
    url: "https://vitest.dev/",
  },
  {
    name: "ESLint & Prettier",
    description:
      "Tools for identifying and reporting on patterns in JavaScript and code formatting.",
    url: "https://eslint.org/",
  },
  {
    name: "Husky",
    description: "A tool that makes it easy to use Git hooks.",
    url: "https://typicode.github.io/husky/",
  },
  {
    name: "Plop.js",
    description:
      "A tiny generator framework that makes it easy to create files from templates.",
    url: "https://plopjs.com/",
  },
];

export default function TableLibs() {
  return (
    <Stack>
      <Heading as="h2" size="lg">
        Technologies Used
      </Heading>
      <TableContainer>
        <Table size="sm" variant="striped">
          <Thead>
            <Tr>
              <Th>Technology</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {technologies.map((tech) => (
              <Tr key={tech.name}>
                <Td>
                  <Link href={tech.url} isExternal>
                    {tech.name}
                  </Link>
                </Td>
                <Td>{tech.description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
