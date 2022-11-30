import React, { useEffect, useState } from "react";

const Otp = () => {
  const url = process.env.REACT_APP_URL;
  const d = document.cookie
    .split(";")
    .map((e) => e.split("="))
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
      {}
    );
  const [Otp, setOtp] = useState("");
  const [status, setstatus] = useState("");
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobileNo: d.num, sid: d.sid, otp: Otp }),
  };
  const check = async () => {
    const res = await fetch(url + "verifyOtp", request);
    const data = await res.json();
    setstatus(data.status);
    //  console.log("status = ", data.status);
  };
  return (
    <div>
      <input
        type="text"
        name=""
        id=""
        onChange={(e) => {
          setOtp(e.target.value);
        }}
      />
      <button type="submit" onClick={check}>
        Submit otp
      </button>
      {status === "approved" && <h1>Login successfully</h1>}
      {status === "pending" && <h1>Login failed</h1>}
    </div>
  );
};

export default Otp;
