import { useMemo } from "react";

interface BackgroundImageProps {
  children: React.ReactNode;
}

export default function BackgroundImage({ children }: BackgroundImageProps) {
  // Generar estrellas aleatorias
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.2 + 0.1,
    }));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Círculo degradado en la parte superior */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "100vw",
          maxWidth: "1400px",
          maxHeight: "1400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(40, 40, 40, 0.4) 0%, rgba(30, 30, 30, 0.2) 30%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Estrellas estáticas */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            backgroundColor: "#fff",
            opacity: star.opacity,
            pointerEvents: "none",
          }}
        />
      ))}

      {children}
    </div>
  );
}
