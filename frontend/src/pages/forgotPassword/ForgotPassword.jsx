import React, { useState } from "react";
import { Link } from "react-router-dom";
import useForgotPassword from "../../hooks/auth/useForgotPassword.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { loading, forgotPassword } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await forgotPassword(email);
    if (ok) setSent(true);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-screen w-full">
      <Link to="/">
        <img
          src="/zodomixLogo.png"
          alt="zodomix logo"
          className="lg:w-2/3 md:w-3/4 m-auto mt-10"
        />
      </Link>

      {sent ? (
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div
            style={{
              fontSize: "56px",
              filter: "drop-shadow(0 0 20px #00FF7B)",
            }}
          >
            ✉️
          </div>
          <h2
            className="pixel-font"
            style={{
              background: "linear-gradient(90deg, #00FF7B, #00F2FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "1.5rem",
              letterSpacing: "0.1em",
            }}
          >
            CHECK YOUR EMAIL
          </h2>
          <p className="font-mono text-lg" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "360px" }}>
            If that email exists in our system, a reset link has been sent. Check your inbox.
          </p>
          <Link
            to="/login"
            className="font-mono text-base transition-all duration-200"
            style={{ color: "#00F2FF" }}
          >
            ← BACK TO LOGIN
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center justify-center gap-6 xl:w-2/3 mt-8"
        >
          <div className="w-5/6 md:w-2/5 flex flex-col space-y-3 mx-auto">
            <label className="text-2xl showUpAnimate">EMAIL</label>
            <input
              type="email"
              required
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 xl:w-1/4 transition duration-300 ease-out m-auto cursor-pointer"
            style={
              !loading
                ? { borderColor: "#00FF7B", color: "#00FF7B" }
                : { borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.3)" }
            }
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "#00FF7B";
                e.currentTarget.style.color = "#000";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#00FF7B";
              }
            }}
          >
            {loading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
            ) : (
              "SEND LINK"
            )}
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="md:absolute md:mb-0 mb-10 bottom-5 left-5 text-3xl cursor-pointer transform duration-100 ease-in hover:font-bold xl:text-5xl sm:text-4xl"
      >
        ⇦ LOGIN
      </Link>
    </div>
  );
};

export default ForgotPassword;
