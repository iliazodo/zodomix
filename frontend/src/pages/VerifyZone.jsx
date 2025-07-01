import React, { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import useVerifyEmail from "../hooks/auth/useVerifyEmail.js";
import { useNavigate, useParams } from "react-router-dom";

const VerifyZone = () => {
  const { loading, verifyEmail } = useVerifyEmail();

  const { token } = useParams();

  const navigate = useNavigate();

useEffect(() => {
  const verify = async () => {
    if (token) {
      const res = await verifyEmail(token);
      console.log(res);
      if(res){
        navigate("/login");
        console.log("go");
      }
    }
  };

  verify();
}, [token]);


  return (
    <>
      <Nav />
      <div>
        {loading ? <p>Verifying...</p> : <p>Email verification in process.</p>}
      </div>
    </>
  );
};

export default VerifyZone;
