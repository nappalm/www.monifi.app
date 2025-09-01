import { Global, css } from "@emotion/react";
import { useEffect } from "react";

export default function GlobalStyle() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      if (!target.closest("button")) return;

      const button = target.closest("button")!;
      const circle = document.createElement("span");

      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
      circle.classList.add("ripple");

      const oldRipple = button.querySelector(".ripple");
      if (oldRipple) oldRipple.remove();

      button.appendChild(circle);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      const button = target.closest("button");
      if (button) button.classList.add("pressed");
    };

    const handleMouseUpOrLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      const button = target.closest("button");
      if (button) button.classList.remove("pressed");
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUpOrLeave);
    document.addEventListener("mouseleave", handleMouseUpOrLeave);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUpOrLeave);
      document.removeEventListener("mouseleave", handleMouseUpOrLeave);
    };
  }, []);

  return (
    <Global
      styles={css`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");

        #root,
        html,
        body,
        main {
          min-height: 100%;
          height: 100%;
        }

        button {
          position: relative;
          overflow: hidden;
        }

        button.pressed {
          transform: scale(0.98);
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 600ms linear;
          background-color: rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}
    />
  );
}
