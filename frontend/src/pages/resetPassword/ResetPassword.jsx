import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useResetPassword from "../../hooks/auth/useResetPassword.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loading, resetPassword } = useResetPassword();

  const [inputs, setInputs] = useState({ password: "", confirmPassword: "" });
  const [done, setDone] = useState(false);

  const passwordsMatch = inputs.password === inputs.confirmPassword || inputs.confirmPassword === "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await resetPassword(token, inputs.password, inputs.confirmPassword);
    if (ok) {
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    }
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

      {done ? (
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div style={{ fontSize: "56px", filter: "drop-shadow(0 0 20px #00FF7B)" }}>✅</div>
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
            PASSWORD RESET!
          </h2>
          <p className="font-mono text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Redirecting you to login...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center justify-center gap-3 xl:w-2/3"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-3 mt-8 z-10">
            <div className="w-5/6 flex flex-col space-y-3 mx-auto">
              <label className="text-2xl showUpAnimate">NEW PASSWORD</label>
              <input
                type="password"
                required
                minLength={6}
                className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              />
            </div>

            <div className="w-5/6 flex flex-col space-y-3 mx-auto">
              <label className="text-2xl showUpAnimate" style={{ color: passwordsMatch ? "inherit" : "#FF00EE" }}>
                CONFIRM PASSWORD {!passwordsMatch && "— NO MATCH"}
              </label>
              <input
                type="password"
                required
                className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
                style={{ borderColor: passwordsMatch ? "" : "#FF00EE" }}
                value={inputs.confirmPassword}
                onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 xl:w-1/4 transition duration-300 ease-out m-auto mt-10 cursor-pointer"
            style={
              !loading && passwordsMatch
                ? { borderColor: "#00FF7B", color: "#00FF7B" }
                : { borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.3)" }
            }
            onMouseEnter={(e) => {
              if (!loading && passwordsMatch) {
                e.currentTarget.style.background = "#00FF7B";
                e.currentTarget.style.color = "#000";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && passwordsMatch) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#00FF7B";
              }
            }}
          >
            {loading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
            ) : (
              "RESET"
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

export default ResetPassword;
