import React from "react";
import "./home.css";
import "./home-responsive.css";
import Menu from "./Menu";
// useEffect

const Home = () => {
  const $ = window.$;

  return (
    <div>
      <div className="wrapper-outer">
        <div className="wrapper">
          <Menu />
          <div className="wrapper_inner"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
