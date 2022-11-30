import intlTelInput from "intl-tel-input";
import { useEffect, useState } from "react";
import "./login.css";
import "./responsive.css";
import "../node_modules/intl-tel-input/build/css/intlTelInput.css";
import ParticlesBg from "particles-bg";
import fetchdata from "./Global";
import Spinner from "./Spinner";
import $ from "jquery";
const Login = () => {
  const url = process.env.REACT_APP_URL;
  // const $ = window.$;
  const [num, setNum] = useState("");
  const [ccode, setCcode] = useState("");
  const [Otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [msg, setMsg] = useState("");
  let r, da;
  // const [final, setFinal] = useState(undefined);

  const send = async () => {
    setLoader(true);
    setNum("+" + ccode + num);
    // console.log("main = " + num);
    // $(".bbtn").animate({ opacity: "0" }, 200);
    // $(".bbtn").animate({ opacity: "1" }, 250);
    // $(".bbtn").animate({ opacity: "0" }, 300);
    // $(".bbtn").animate({ opacity: "1" }, 350);
    const res = await fetch(url + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNo: "+" + ccode + num }),
    });
    // console.log("fetching");
    const data = await res.json();
    // console.log("fetched = ", data);
    if (data.stcode === 100) {
      if (data.status === 20023) {
        // setLoader(false);
        setMsg("Invalid phone number");
        $(".alert-msg").slideDown();
        setLoader(false);
      } else if (data.status === 19057) {
        setLoader(false);
        setMsg("Server Down");
        $(".alert-msg").slideDown();
      } else if (data.status === 19034) {
        setLoader(false);
        setMsg(" Invalid Country code");
        $(".alert-msg").slideDown();
      } else if (data.status === 60200) {
        setLoader(false);
        setMsg("Enter Number");
        $(".alert-msg").slideDown();
      } else if (data.status === 20429) {
        setLoader(false);
        setMsg("Too many requests");
        $(".alert-msg").slideDown();
      } else {
        $(".alert-msg").slideUp();
        document.cookie = `num=+${ccode}${num}`;
        document.cookie = `sid=${data["sid"]}`;
        $(".form-outer").animate({ left: "-94%" });
        setTimeout(() => {
          $(".form-outer-otp").animate({ left: "0" });
        }, 0);
      }
    } else if (data.stcode === 101) {
      setLoader(false);
      setMsg("user does not exists");
      $(".alert-msg").slideDown();
    } else if (data.stcode === 103 || data.stcode === 104) {
      setLoader(false);
      setMsg("database error");
      $(".alert-msg").slideDown();
    }
    setLoader(false);
    //// console.log("called");
  };
  const resend_otp = async () => {
    setLoader(false);
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    // setLimit(limit + 1);
    // if (limit > 6) {
    //   $(".alert-msg-limit").slideDown();
    // } else {
    $(".alert-msg").slideUp();
    $(".alert-msg-otp").slideDown();
    const res = await fetch(url + "resendOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobileNo: d.num,
        sid: d.sid,
      }),
    });
    console.log(res);
    $(".alert-msg-otp").slideUp();
    // console.log("fetching");
    // }
    //// console.log("number = ", d.num);
    //// console.log("number = ", d.sid);
    // const data = await res.json();
  };
  // const fetchdata = async (token) => {
  //   const d = document.cookie
  //     .split(";")
  //     .map((e) => e.split("="))
  //     .reduce(
  //       (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
  //       {}
  //     );
  //   if (!d.token || d.token.length === 0) {
  //     window.location.href = "/";
  //   }
  //  // console.log("fetch called");
  //   const res = await fetch(url + "user-profile-fetch", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ token: token }),
  //   });
  //   const data = await res.json();
  //   if (data.stcode === 105) {
  //     window.location.href = "/";
  //   } else if (data.stcode === 100) {
  //    // console.log("data fetch = ", data);
  //     document.cookie = `name=${data.name}`;
  //     document.cookie = `bio=${data.bio}`;
  //     document.cookie = `username=${data.username}`;
  //   }
  // };
  const check = async () => {
    setLoader(true);
    // console.log("login called");
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobileNo: d.num,
        sid: d.sid,
        otp: Otp,
        msg: "login",
        device: "chrome",
      }),
    };
    const res = await fetch(url + "verifyOtp", request);
    const data = await res.json();
    // console.log("tokens = ", data);
    if (data.stcode === 100) {
      if (data.status === "approved") {
        document.cookie = `token=${data.token}`;
        // console.log("before cookie");
        const data2 = await fetchdata(r, da);
        // console.log("data fetch = ", data2);
        if (data2.stcode === 105) {
          window.location.href = "/";
        } else if (data2.stcode === 100) {
          // console.log("data = ", data2);
          // console.log("stcode = ", data2.stcode);
          // console.log("stcode = ", data2.name);
          // console.log("stcode = ", data2.bio);
          // console.log("stcode = ", data2.username);
          document.cookie = `name=${data2.name}`;
          document.cookie = `bio=${data2.bio}`;
          document.cookie = `username=${data2.username}`;
          // console.log("after cookie");
          window.location.href = "/home";
        }
      } else {
        setMsg("invalid otp");
        setLoader(false);
        $(".alert-msg").slideDown();
      }
    } else if (data.stcode === 103) {
      setLoader(false);
      setMsg("database error");
      $(".alert-msg").slideDown();
    }
    // setstatus(data.status);
    else if (data.status === 60200) {
      setLoader(false);
      setMsg("please enter otp");
      $(".alert-msg").slideDown();
      // console.log("status = ", data.status);
    } else if (data.status === 14107) {
      setLoader(false);
      setMsg("OTP Limit exceeded try again after sometime");
      $(".alert-msg").slideDown();
      // console.log("status = ", data.status);
    } else if (data.status === 19057) {
      setLoader(false);
      setMsg("server down");
      $(".alert-msg").slideDown();
      // console.log("status = ", data.status);
    } else if (data.status === "pending" || data.status === 20404) {
      setLoader(false);
      setMsg("Invalid Otp");
      $(".alert-msg").slideDown();
      // console.log("status = ", data.status);
    } else {
      $(".alert-msg").slideUp();
    }
    // console.log("status = ", data.status);
    setLoader(false);
  };
  const tokencheck = () => {
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    if (d) {
      if (d.token) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    document.title = "Login | Connect";
    // fetchdata(res, data);
    if (tokencheck()) {
      window.location.href = "/home";
    } else {
      // to get the country details
      var input = document.querySelector("#phone");
      var iti = intlTelInput(input, {
        initialCountry: "in",
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
      var c = iti.getSelectedCountryData().dialCode;
      setCcode(c);
      input.addEventListener("countrychange", function () {
        c = iti.getSelectedCountryData().dialCode;
        setCcode(c);
      });
    }
  }, []);

  return (
    <>
      <ParticlesBg num={100} type="cobweb" bg={true} />
      <div className="main-outer-container">
        <div className="main-outer-login" id="particles-js">
          <div className="login-box-outer">
            <div className="logo-login">
              <img src="logo.png" alt="" />
            </div>
            <div className="slider-content">
              {/* <div className="form-outer-signup slideform">
                <h2>Sign Up</h2>
                <span>to start connecting!</span>
                <br />
                <div className="form-inner">
                  <div id="login" className="login-frm">
                    <i className="fas fa-user user"></i>
                    <div className="alert-msg">
                      <i className="fas fa-times"></i> <span>{msg}</span>
                    </div>
                    <input
                      id="signup"
                      name="signup"
                      placeholder="Username"
                      onChange={(e) => {
                        setNum(e.target.value);
                      }}
                    />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      className="sphone"
                      placeholder="Your phone"
                      onChange={(e) => {
                        setNum(e.target.value);
                      }}
                      maxLength={10}
                    />
                    <button
                      className="bbtn"
                      onClick={() => {
                        $(".form-outer-signup").animate({ left: "-100%" });
                        setTimeout(() => {
                          $(".form-outer").animate({ left: "0%" });
                        }, 500);
                        // setTimeout(() => {
                        //   $(".form-outer-otp").animate({ left: "0" });
                        // }, 500);
                      }}
                    >
                      <img src="https://img.icons8.com/ios-filled/28/000000/long-arrow-right.png" />
                    </button>
                  </div>
                </div>
              </div> */}
              <div className="form-outer slideform">
                <h2>Sign In</h2>
                <span>to start connecting!</span>
                <br />
                <div className="form-inner">
                  <div id="login" className="login-frm">
                    <div className="alert-msg">
                      <i className="fas fa-times"></i> <span>{msg}</span>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Your phone"
                      onChange={(e) => {
                        setNum(e.target.value);
                      }}
                      maxLength={10}
                    />
                    <button className="bbtn" onClick={send}>
                      {loader && <Spinner />}
                      {!loader && (
                        <img
                          src="https://img.icons8.com/ios-filled/28/000000/long-arrow-right.png"
                          alt=""
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-outer-otp slideform">
                <h2>Enter Otp</h2>
                <span>to start connecting!</span>
                <br />
                <div className="form-inner">
                  <div id="login" className="login-frm btn">
                    <div className="alert-msg">
                      <i className="fas fa-times"></i> <span>{msg}</span>
                    </div>
                    <div className="alert-msg-otp">
                      <i className="fas fa-check"></i>
                      <span>Otp Sent</span>
                    </div>
                    <input
                      id="otp"
                      type="tel"
                      name="otp"
                      placeholder="Your otp"
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                      maxLength={6}
                    />
                    <br />
                    <span className="resend" onClick={resend_otp}>
                      Resend Otp
                    </span>{" "}
                    <br />
                    <div className="btns">
                      <button
                        className="btn1"
                        onClick={() => {
                          $(".alert-msg").slideUp();
                          $(".form-outer-otp").animate({ left: "96%" });
                          $(".form-outer").animate({ left: "0" });
                        }}
                      >
                        <img
                          src="https://img.icons8.com/ios-filled/28/000000/long-arrow-left.png"
                          alt=""
                        />
                      </button>
                      {loader && (
                        <button className="btn2">
                          <Spinner />
                        </button>
                      )}
                      {!loader && (
                        <button className="btn2" onClick={check}>
                          LOGIN
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
