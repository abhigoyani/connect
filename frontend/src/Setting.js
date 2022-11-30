import axios from "axios";
import React, { useEffect, useState } from "react";
import "./setting.css";
import $ from "jquery";
import fetchdata from "./Global";
import ClipLoader from "react-spinners/ClipLoader";
import Menu from "./Menu";
import loading from "./loader3.gif";
const Setting = () => {
  const url = process.env.REACT_APP_URL;
  let d, data, res;
  const [state, setState] = useState();
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [state2, setState2] = useState();
  const [flag, setFlag] = useState(0);
  const fetchdevice = async () => {
    setLoader(true);
    d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const res = await axios(url + "fetchDevice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { token: d.token },
    });

    console.log("result = ", res.data);
    setState(res.data);
    setState2({ name: d.name, mobile: d.num, username: d.username });
    setLoader(false);
  };
  const update = async () => {
    data = await fetchdata(res, data);
    setFlag(data.avatarflag);
  };
  const logout = async () => {
    setLoader2(true);
    d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const res = await axios(url + "signOut", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { token: d.token },
    });
    if (res.data.stcode === 100) {
      document.cookie = `bio="";expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `username="";expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `token="";expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `name="";expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `sid="";expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `num="";expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setLoader2(false);
      window.location.href = "/";
      // document.cookie = "";
    }
    console.log("logout = ", res.data);
  };
  useEffect(() => {
    document.title = "Account | Connect";
    fetchdevice();
    update();
    console.log("data = ", state);
  }, []);
  return (
    <>
      <div className="wrapper">
        <Menu />
        {loader && (
          <div style={{ width: "100%" }}>
            <ClipLoader
              color={"black"}
              loading={state}
              css={{
                display: "block",
                width: "30px",
                height: "30px",
                margin: "auto",
                marginTop: "1rem",
              }}
              size={40}
            />
          </div>
        )}
        {state2 && (
          <div className="container-setting">
            <div className="settings">
              <div className="head">
                <figure className="photo">
                  <img
                    src={
                      flag
                        ? `https://connect4img.blob.core.windows.net/avatar/${state2.username}-profile.jpg`
                        : "https://connect4img.blob.core.windows.net/avatar/avatar.png"
                    }
                    alt="profile"
                  />
                </figure>
                <div className="user_info">
                  <h2>{state2.name}</h2>
                  <small>@{state2.username}</small>
                </div>
              </div>
              <div className="body">
                <ul className="setting">
                  <li className="setting_item">
                    <div
                      className="setting-item-main"
                      onClick={(e) => {
                        console.log("called");
                        $(e.currentTarget).siblings().slideToggle();
                      }}
                    >
                      <i className="fas fa-user"></i>
                      <span className="item_options">Personal Details</span>
                      <span className="alink">
                        <i className="fas fa-angle-down"></i>
                      </span>
                    </div>
                    <div className="drop-setting-item s-phone">
                      <ul className="drop-item-list">
                        <li>
                          <span className="drop-item-head">Phone number</span>
                          <span className="drop-item-desc">
                            {state2.mobile}
                          </span>
                        </li>
                        <li>
                          <span className="drop-item-head">Username</span>
                          <span className="drop-item-desc">
                            {state2.username}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="setting_item">
                    <div
                      className="setting-item-main"
                      onClick={(event) => {
                        $(event.currentTarget).siblings().slideToggle();
                      }}
                    >
                      <i className="fas fa-mobile-alt"></i>
                      <span className="item_options">Devices</span>
                      <span className="alink">
                        <i className="fas fa-angle-down"></i>
                      </span>
                    </div>
                    <div className="drop-setting-item s-device">
                      <ul className="drop-item-list">
                        {state.devices &&
                          state.devices.map((e, i) => {
                            return (
                              <>
                                <li>
                                  <span className="drop-item-head">{e}</span>
                                  {/* <span className="drop-item-desc">Windows</span> */}
                                </li>
                              </>
                            );
                          })}
                      </ul>
                    </div>
                  </li>
                  <li className="setting_item">
                    <div
                      className="setting-item-main"
                      onClick={(e) => {
                        $(e.currentTarget).siblings().slideToggle();
                      }}
                    >
                      <i className="fas fa-id-badge"></i>
                      <span className="item_options">Contact us</span>
                      <span className="alink">
                        <i className="fas fa-angle-right"></i>
                      </span>
                    </div>
                  </li>
                  <li className="setting_item">
                    <div
                      className="setting-item-main"
                      onClick={(e) => {
                        $(e.currentTarget).siblings().slideToggle();
                      }}
                    >
                      <i className="fas fa-shield-alt"></i>
                      <span className="item_options">Terms and conditions</span>
                      <span className="alink">
                        <i className="fas fa-angle-right"></i>
                      </span>
                    </div>
                  </li>
                  <li
                    className="setting_item signout"
                    onClick={() => {
                      logout();
                    }}
                  >
                    {loader2 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={loading}
                          alt="loading"
                          style={{ width: "45px", margin: "-10px 0" }}
                        />
                      </div>
                    )}
                    {!loader2 && <span className="item_options">Sign out</span>}
                    <span className="alink"> </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Setting;
