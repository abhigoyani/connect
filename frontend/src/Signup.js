import intlTelInput from "intl-tel-input";
import { useEffect, useState } from "react";
import "./login.css";
import "./responsive.css";
import "../node_modules/intl-tel-input/build/css/intlTelInput.css";
import ParticlesBg from "particles-bg";
import { Link } from "react-router-dom";
import fetchdata from "./Global";
import Spinner from "./Spinner";
import $ from "jquery";
const Signup = () => {
  const url = process.env.REACT_APP_URL;
  // const $ = window.$;
  const [num, setNum] = useState("");
  const [ccode, setCcode] = useState("");
  const [Otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const [username, setusername] = useState("");
  let res2, data2;
  const signup = async () => {
    setLoader(true);
    $(".alert-msg").slideUp();
    $(".user").animate({ top: "1rem" });
    if (username.length === 0) {
      setLoader(false);
      setMsg("please enter name");
      $(".alert-msg-user").slideDown();
      $(".user").animate({ top: "2.6rem" });
    } else if (username.length < 4) {
      setLoader(false);
      setMsg("username must be 4 characters");
      $(".alert-msg-user").slideDown();
      $(".user").animate({ top: "2.6rem" });
    } else if (num.length === 0) {
      setLoader(false);
      setMsg("enter mobile");
      $(".alert-msg-phone").slideDown();
      // $(".user").animate({ top: "2.6rem" });
    } else {
      //s console.log("clicked");
      //s console.log("+" + ccode + num);
      const res = await fetch(url + "signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNo: "+" + ccode + num,
          username: username,
        }),
      });
      const data = await res.json();
      //s console.log("data = ", data);
      if (data.stcode === 100) {
        if (data.status === "pending") {
          $(".form-outer-signup").animate({ left: "-100%" });
          $(".signup-otp").animate({ left: "0" });
          document.cookie = `num=+${ccode}${num}`;
          document.cookie = `sid=${data["sid"]}`;
        }
        if (data.status === "approved") {
        } else if (data.status === 60200) {
          setLoader(false);
          setMsg("invalid mobile");
          $(".alert-msg-phone").slideDown();
        }
      } else if (data.stcode === 104) {
        setLoader(false);
        setMsg("username already taken");
        $(".user").animate({ top: "2.6rem" });
        $(".alert-msg-user").slideDown();
      } else if (data.stcode === 101) {
        setLoader(false);
        setMsg("mobile already exists");
        $(".alert-msg-phone").slideDown();
      } else if (data.stcode === 102) {
        setLoader(false);
        setMsg("username already exists");
        $(".alert-msg-user").slideDown();
        $(".user").animate({ top: "2.6rem" });
      } else if (data.stcode === 103) {
        setLoader(false);
        setMsg("database error");
        $(".alert-msg-user").slideDown();
        $(".user").animate({ top: "2.6rem" });
      }
      // }
    }
    // $(".alert-msg").slideDown();
    // $(".user").animate({ top: "2.6rem" });
    // setTimeout(() => {
    //   $(".alert-msg").slideUp();
    //   $(".user").animate({ top: "1rem" });
    // }, 3000);
    setLoader(false);
  };
  const verify = async () => {
    setLoader(true);
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const res = await fetch(url + "verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobileNo: d.num,
        sid: d.sid,
        otp: Otp,
        device: "chrome",
        msg: "signup",
      }),
    });
    const data = await res.json();
    //s console.log("data2 = ", data);
    if (data.stcode === 100) {
      document.cookie = `token=${data.token}`;
      data2 = await fetchdata(res2, data2);
      //s console.log("before fetch ");
      if (data2.stcode === 105) {
        window.location.href = "/";
      } else if (data2.stcode === 100) {
        //s console.log("data = ", data2);
        //s console.log("stcode = ", data2.stcode);
        //s console.log("stcode = ", data2.name);
        //s console.log("stcode = ", data2.bio);
        //s console.log("stcode = ", data2.username);
        document.cookie = `name=${data2.name}`;
        document.cookie = `bio=${data2.bio}`;
        document.cookie = `username=${data2.username}`;
        //s console.log("after cookie");
        window.location.href = "/home";
      }
    } else if (data.stcode === 103) {
      setLoader(false);
      setMsg("database error");
      $(".alert-msg").slideDown();
    }
  };
  const tokencheck = () => {
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    //s console.log("data cookie = ", d);
    if (d) {
      if (d.token) {
        return true;
      }
      return false;
    }
    return false;
  };
  useEffect(() => {
    document.title = "SignUp | Connect";
    ////s console.log(tokencheck());
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
          <div className="login-box-outer signup-box">
            <div className="logo-login">
              <img src="logo.png" alt="" />
            </div>
            <div className="slider-content">
              <div className="form-outer-signup slideform">
                <h2>Sign Up</h2>
                <span>to start connecting!</span>
                <br />
                <div className="form-inner">
                  <div id="login" className="login-frm">
                    <i className="fas fa-user user"></i>
                    <div className="alert-msg alert-msg-user">
                      <i className="fas fa-times"></i> <span>{msg}</span>
                    </div>
                    <input
                      id="signup"
                      name="signup"
                      placeholder="Username"
                      onChange={(e) => {
                        setusername(e.target.value);
                      }}
                    />
                    <div className="alert-msg alert-msg-phone">
                      <i className="fas fa-times"></i> <span>{msg}</span>
                    </div>
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
                    <div className="btns">
                      <Link to="/login">
                        <button>Login</button>
                      </Link>
                      <button className="bbtn sbtn" onClick={signup}>
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
              </div>
              <div className="form-outer-otp signup-otp slideform">
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
                    <span className="resend">Resend Otp</span> <br />
                    <div className="btns">
                      <button
                        className="btn1"
                        onClick={() => {
                          $(".signup-otp").animate({ left: "100%" });
                          setTimeout(() => {
                            $(".form-outer-signup").animate({ left: "0" });
                          }, 200);
                        }}
                      >
                        <img
                          src="https://img.icons8.com/ios-filled/28/000000/long-arrow-left.png"
                          alt=""
                        />
                      </button>
                      <button className="btn2" onClick={verify}>
                        {loader && <Spinner />}
                        {!loader && <span>Login</span>}
                        {/* LOGIN */}
                      </button>
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

export default Signup;
