import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/backdrop.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000",
          mixBlendMode: "color",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <SignInForm />
      </div>
    </div>
  );
}
