import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav.jsx";
import { useNavigate, useParams } from "react-router-dom";
import useGetGroupInfo from "../../hooks/group/useGetGroupInfo.js";
import useEditGroup from "../../hooks/group/useEditGroup.js";

const EditGroup = () => {
  const { groupId } = useParams();

  const [inputs, setInputs] = useState({
    groupId: groupId,
    name: "",
    isPublic: true,
    password: "",
    description: "",
  });

  const [submitHovered, setSubmitHovered] = useState(false);
  const { loading, editGroup } = useEditGroup();
  const { getGroupInfo } = useGetGroupInfo();
  const navigate = useNavigate();

  useEffect(() => {
    const gettingGroupInfo = async () => {
      const data = await getGroupInfo({ groupId });
      setInputs({
        groupId: data?._id,
        name: data?.name,
        description: data?.description,
        isPublic: data?.isPublic,
        password: "",
      });
    };
    gettingGroupInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await editGroup(inputs);
    if (res) {
      localStorage.setItem("zdm-group", JSON.stringify(inputs.name));
      navigate(`/chatZone/${inputs.name}`);
    }
  };

  useEffect(() => {
    if (typeof inputs.name === "string") {
      const nameWithDash = inputs.name.replace(/\s+/g, "-");
      if (nameWithDash !== inputs.name) {
        setInputs((prev) => ({ ...prev, name: nameWithDash }));
      }
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

  return (
    <>
      <Nav />
      <div className="bg-black min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden"
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
              className="pixel-font font-bold text-center pb-4 truncate"
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                background: "linear-gradient(90deg, #FF00EE, #00F2FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                borderBottom: "1px solid rgba(0,242,255,0.15)",
              }}
            >
              Edit — {inputs.name}
            </h1>

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
              />
            </div>

            {/* Password (private only) */}
            {!inputs.isPublic && (
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>NEW PASSWORD</span>
                <input
                  type="password"
                  maxLength={25}
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  className="rounded-full py-3 px-6 font-mono text-base"
                  style={inputStyle}
                  placeholder="Leave blank to keep current"
                />
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-2">
              <span style={labelStyle}>DESCRIPTION</span>
              <textarea
                maxLength={200}
                rows={3}
                value={inputs.description}
                onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                className="rounded-2xl py-3 px-6 font-mono text-base resize-none"
                style={inputStyle}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              className="w-full rounded-full font-mono font-bold py-3.5 text-base transition-all duration-200 cursor-pointer mt-2"
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
                : "SAVE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditGroup;
