import React, { useEffect } from "react";
import Menu from "./Menu";
import Preview from "./Preview";
import "./barcode.css";
import "./barcode-responsive.css";
var QRCode = require("qrcode.react");
const Barcode = () => {
  let d = document.cookie
    .split(";")
    .map((e) => e.split("="))
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
      {}
    );
  useEffect(() => {
    // window.location.href='/'
    document.title = "Scan | Connect";
  }, []);
  return (
    <div className="wrapper">
      <Menu />
      <div className="barcode">
        <div className="b-title">
          <h1>Scan QR</h1>
          <p>Scan this QRcode to open Profile</p>
        </div>
        <div className="code">
          <QRCode
            value={`https://connect.com/${d.username}`}
            size={220}
            includeMargin={true}
            level="H"
            renderAs="canvas"
          />
        </div>
        {/* <div className="url">
          <h3>
            <a href="https://www.google.com">Google.com</a>
          </h3>
        </div> */}
      </div>
      <Preview name={d.name} bio={d.bio} username={d.username} />
    </div>
  );
};

export default Barcode;
