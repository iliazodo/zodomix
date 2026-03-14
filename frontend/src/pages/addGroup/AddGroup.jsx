import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav.jsx";
import useAddGroup from "../../hooks/group/useAddGroup.js";
import CategoryTagInput from "../../components/CategoryTagInput.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddGroup = () => {
  const [inputs, setInputs] = useState({
    name: "",
    isPublic: true,
    password: "",
    isAnonymous: true,
    description: "",
    categories: [],
  });

  const [submitHovered, setSubmitHovered] = useState(false);
  const navigate = useNavigate();
  const { loading, addGroup } = useAddGroup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dangerousChars = /[?&=#]/;
    if (dangerousChars.test(inputs.name)) {
      toast.error("Group name cannot contain: ? & = #");
      return;
    }

    const res = await addGroup(inputs);
    if (res) {
      localStorage.setItem("zdm-group", JSON.stringify(inputs.name));
      navigate(`/chatZone/${inputs.name}`);
    }
  };

  useEffect(() => {
    const nameWithDash = inputs.name.replace(/\s+/g, "-");
    if (nameWithDash !== inputs.name) {
      setInputs((prev) => ({ ...prev, name: nameWithDash }));
    }
  }, [inputs.name]);

  const inputStyle = {
    background: "transparent",
    border: "1px solid rgba(0,242,255,0.3)",
    color: "#fff",
    outline: "none",
    fontFamily: "monospace",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    color: "#EAFF00",
    letterSpacing: "0.12em",
    fontFamily: "monospace",
    fontWeight: "bold",
  };

  const TogglePills = ({ options, value, name, color, onChange }) => (
    <div className="flex gap-3">
      {options.map(({ label, val }) => {
        const active = value === val;
        return (
          <label
            key={label}
            className="flex-1 text-center cursor-pointer rounded-full py-2.5 font-mono text-sm font-bold transition-all duration-200"
            style={{
              border: `1px solid ${active ? color : "rgba(255,255,255,0.12)"}`,
              color: active ? color : "rgba(255,255,255,0.35)",
              boxShadow: active ? `0 0 10px ${color}44` : "none",
              background: active ? `${color}0f` : "transparent",
            }}
          >
            <input type="radio" name={name} className="hidden" onChange={() => onChange(val)} />
            {label}
          </label>
        );
      })}
    </div>
  );

  return (
    <>
      <Nav />
      <div className="bg-black min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        <div
          className="w-full max-w-lg lg:max-w-3xl rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,242,255,0.3)",
            boxShadow: "0 4px 48px rgba(0,0,0,0.7), 0 0 16px rgba(0,242,255,0.07)",
          }}
        >
          {/* Gradient top bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-7 md:p-9">

            {/* Title */}
            <h1
              className="pixel-font font-bold text-center pb-4"
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                background: "linear-gradient(90deg, #00FF7B, #00F2FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                borderBottom: "1px solid rgba(0,242,255,0.15)",
              }}
            >
              Create a Group
            </h1>

            {/* Two-column on desktop, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── LEFT column: Name + Chat Mode ── */}
              <div className="flex flex-col gap-6">

                {/* Group Name */}
                <div className="flex flex-col gap-2">
                  <span style={labelStyle}>GROUP NAME</span>
                  <input
                    type="text"
                    maxLength={30}
                    value={inputs.name}
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                    className="rounded-full py-3 px-6 font-mono text-base"
                    style={inputStyle}
                    placeholder="my-awesome-group"
                  />
                </div>

                {/* Chat Mode */}
                <div className="flex flex-col gap-2">
                  <span style={labelStyle}>CHAT MODE</span>
                  <TogglePills
                    options={[{ label: "ANONYMOUS", val: true }, { label: "USERNAMES", val: false }]}
                    value={inputs.isAnonymous}
                    name="isAnonymous"
                    color="#FF00EE"
                    onChange={(val) => setInputs({ ...inputs, isAnonymous: val })}
                  />
                </div>

              </div>

              {/* ── RIGHT column: Visibility + Password ── */}
              <div className="flex flex-col gap-6">

                {/* Visibility */}
                <div className="flex flex-col gap-2">
                  <span style={labelStyle}>VISIBILITY</span>
                  <TogglePills
                    options={[{ label: "PUBLIC", val: true }, { label: "PRIVATE", val: false }]}
                    value={inputs.isPublic}
                    name="isPublic"
                    color="#00FF7B"
                    onChange={(val) => setInputs({ ...inputs, isPublic: val })}
                  />
                </div>

                {/* Password (private only) */}
                {!inputs.isPublic && (
                  <div className="flex flex-col gap-2">
                    <span style={labelStyle}>PASSWORD</span>
                    <input
                      type="password"
                      maxLength={25}
                      value={inputs.password}
                      onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                      className="rounded-full py-3 px-6 font-mono text-base"
                      style={inputStyle}
                      placeholder="••••••••"
                    />
                  </div>
                )}

              </div>

              {/* Description — full width */}
              <div className="flex flex-col gap-2 lg:col-span-2">
                <span style={labelStyle}>DESCRIPTION</span>
                <textarea
                  maxLength={200}
                  rows={3}
                  value={inputs.description}
                  onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                  className="rounded-2xl py-3 px-6 font-mono text-base resize-none"
                  style={inputStyle}
                  placeholder="What is this group about?"
                />
              </div>

              {/* Categories — full width */}
              <div className="lg:col-span-2">
                <CategoryTagInput
                  selected={inputs.categories}
                  onChange={(cats) => setInputs((prev) => ({ ...prev, categories: cats }))}
                />
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              className="w-full rounded-full font-mono font-bold py-3.5 text-base transition-all duration-200 cursor-pointer"
              style={
                loading
                  ? { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.3)" }
                  : submitHovered
                  ? { background: "#00FF7B", color: "#000", border: "1px solid #00FF7B", boxShadow: "0 0 20px #00FF7B88" }
                  : { background: "transparent", border: "1px solid #00FF7B", color: "#00FF7B" }
              }
            >
              {loading
                ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                : "CREATE"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddGroup;
