export default {
  blue: {
    50: "#E6F1FE",
    100: "#CCE3FD",
    200: "#99C7FB",
    300: "#66AAF9",
    400: "#338EF7",
    500: "#006FEE",
    600: "#005BC4",
    700: "#004493",
    800: "#002E62",
    900: "#001731",
  },
  purple: {
    50: "#F2EAFA",
    100: "#E4D4F4",
    200: "#C9A9E9",
    300: "#AE7EDE",
    400: "#9353D3",
    500: "#7828C8",
    600: "#6020A0",
    700: "#481878",
    800: "#301050",
    900: "#180828",
  },
  cyan: {
    50: "#F0FCFF",
    100: "#E6FAFE",
    200: "#D7F8FE",
    300: "#C3F4FD",
    400: "#A5EEFD",
    500: "#7EE7FC",
    600: "#06B7DB",
    700: "#09AACD",
    800: "#0E8AAA",
    900: "#053B48",
  },
  red: {
    50: "#FEE7EF",
    100: "#FDD0DF",
    200: "#FAA0BF",
    300: "#F871A0",
    400: "#F54180",
    500: "#F31260",
    600: "#C20E4D",
    700: "#920B3A",
    800: "#610726",
    900: "#310413",
  },
  yellow: {
    50: "#FEFCE8",
    100: "#FDF7D1",
    200: "#FBEFA4",
    300: "#F9E57A",
    400: "#F7DB50",
    500: "#F5D124",
    600: "#C4A61D",
    700: "#937B16",
    800: "#62500F",
    900: "#312808",
  },
  green: {
    50: "#F1F9F1",
    100: "#E2F3E3",
    200: "#C8E9CA",
    300: "#A9DEAF",
    400: "#87D294",
    500: "#6BC67C",
    600: "#569E66",
    700: "#40784B",
    800: "#2A5133",
    900: "#15291A",
  },
  gray: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },
  nocturnal: {
    200: "#4A4B57",
    300: "#292A32",
    400: "#1A1B23",
    500: "#0B0C14",
  },
  button: {
    secondary: {
      bg: {
        default: "#f5f5f5",
        _dark: "nocturnal.400",
      },
      border: {
        default: "#5a5a5a40",
        _dark: "nocturnal.300",
      },
    },
  },

  body: {
    dark: "nocturnal.500",
    light: "#fffffff",
  },
  text: {
    body: {
      default: "#000000",
      _dark: "#ffffff",
    },
  },
  // --- card
  card: {
    bg: {
      default: "body.light",
      _dark: "body.dark",
    },
    border: {
      default: "#5a5a5a30",
      _dark: "nocturnal.400",
    },
  },
  // --- checknox
  checkbox: {
    border: {
      default: "#5a5a5a30",
      _dark: "nocturnal.200",
    },
    bg: {
      default: "#5a5a5a40",
      _dark: "nocturnal.300",
    },
  },
  // --- sidebar
  sidebar: {
    button: {
      default: "#5a5a5a90",
      _dark: "#ffffff80",
    },
    buttonActive: {
      default: "#000",
      _dark: "#fff",
    },
  },
  // --- menu
  menu: {
    bg: {
      default: "#f5f5f5",
      _dark: "nocturnal.400",
    },
    border: {
      default: "#5a5a5a30",
      _dark: "nocturnal.300",
    },
  },
  // --- divider
  divider: {
    border: {
      default: "#5a5a5a50",
      _dark: "#ffffff15",
    },
  },
  // -- dateselect
  dateleSelect: {
    calendarBadge: {
      default: "#5a5a5a30",
      _dark: "nocturnal.300",
    },
    items: {
      inactive: {
        default: "#5a5a5a90",
        _dark: "#ffffff50",
      },
      active: {
        default: "nocturnal.400",
        _dark: "#fff",
      },
      range: {
        default: "#5a5a5a30",
        _dark: "nocturnal.200",
      },
    },
  },
  // --- loading-content
  loadingContent: {
    background: {
      default: "#5a5a5a20",
      _dark: "#1A1B2390",
    },
    progress: {
      default: "#5a5a5a60",
      _dark: "#292A32",
    },
  },
  // --- switch
  switch: {
    bg: {
      light: "#5a5a5a50",
      dark: "nocturnal.300",
    },
  },
  // --- modal
  modal: {
    overlay: {
      default: "#f5f5f5",
      _dark: "#0B0C1490",
    },
    bg: {
      default: "#f5f5f5",
      _dark: "nocturnal.400",
    },
    border: {
      default: "#f5f5f5",
      _dark: "nocturnal.500",
    },
  },
  // --- drawer
  drawer: {
    bg: {
      default: "#f5f5f5",
      _dark: "nocturnal.500",
    },
    border: {
      default: "#f5f5f5",
      _dark: "nocturnal.400",
    },
    closeButton: {
      default: "#f5f5f5",
      _dark: "nocturnal.400",
    },
  },
  input: {
    bg: {
      default: "#f5f5f5",
      _dark: "nocturnal.500",
    },
    border: {
      default: "#f5f5f5",
      _dark: "nocturnal.400",
    },
  },
  // --- table
  table: {
    body: {
      default: "#f5f5f5",
      _dark: "body.dark",
    },
    th: {
      default: "#f5f5f5",
      _dark: "nocturnal.400",
    },
    thColor: {
      default: "#00000080",
      _dark: "#ffffff90",
    },
    border: {
      default: "#5a5a5a40",
      _dark: "nocturnal.300",
    },
    caption: {
      default: "#ffffff80",
      _dark: "red",
    },
  },
};
