import { Button, ButtonGroup } from "@chakra-ui/react";
import { useState } from "react";

type Language = "en" | "es";

type Props = {
  onChange: (lang: Language) => void;
};

export default function LanguageOptions({ onChange }: Props) {
  const [language, setLanguage] = useState<Language>("en");

  const handleClick = (lang: Language) => {
    setLanguage(lang);
    onChange(lang);
  };

  return (
    <ButtonGroup size="sm">
      <Button
        colorScheme={language === "en" ? "cyan" : "gray"}
        variant={language === "en" ? "outline" : "ghost"}
        onClick={() => handleClick("en")}
      >
        English
      </Button>
      <Button
        colorScheme={language === "es" ? "cyan" : "gray"}
        variant={language === "es" ? "outline" : "ghost"}
        onClick={() => handleClick("es")}
      >
        Español
      </Button>
    </ButtonGroup>
  );
}
