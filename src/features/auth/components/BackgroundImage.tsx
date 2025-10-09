interface BackgroundImageProps {
  children: React.ReactNode;
}

export default function BackgroundImage({ children }: BackgroundImageProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/backdrop.jpg)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%) brightness(3.8) contrast(1.8)",
          opacity: 0.3,
        }}
      />
      {children}
    </div>
  );
}
