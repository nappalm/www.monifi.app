import { useClickSound } from "@/shared/hooks";
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";

export function ButtonSound({ onClick, ...props }: ButtonProps) {
  const playSound = useClickSound();

  const handleClick: ButtonProps["onClick"] = (e) => {
    playSound();
    onClick?.(e);
  };

  return <Button onClick={handleClick} {...props} />;
}

export function IconButtonSound({ onClick, ...props }: IconButtonProps) {
  const playSound = useClickSound();

  const handleClick: IconButtonProps["onClick"] = (e) => {
    playSound();
    onClick?.(e);
  };

  return <IconButton onClick={handleClick} {...props} />;
}
