import axios from "axios";
import React, { useEffect, useState } from "react";
import "./main-responsive.css";
import fetchdata from "./Global";
import Links from "./Links";
import ClipLoader from "react-spinners/ClipLoader";
const Preview = (props) => {
  const [avatar, setavatar] = useState(undefined);
  const [banner, setbanner] = useState(undefined);
  const [loader, setLoader] = useState(false);
  const [links, setLinks] = useState([]);
  const { temp, check } = props;
  const url = process.env.REACT_APP_URL;
  let res, data;
  const img_pr = `https://connect4img.blob.core.windows.net/avatar/${props.username}-profile.jpg`;
  const img_b = `https://connect4img.blob.core.windows.net/banner/${props.username}-banner.jpg`;
  const checkavatars = (flag, url, setfn, def) => {
    if (flag === 1) {
      setfn(url + "?time=" + new Date());
    } else {
      setfn(def);
    }
  };
  const update = async () => {
    setLoader(true);
    console.log("fetchdata called");
    data = await fetchdata(res, data);
    checkavatars(
      data.avatarflag,
      img_pr,
      setavatar,
      "https://connect4img.blob.core.windows.net/avatar/avatar.png"
    );
    checkavatars(
      data.bannerflag,
      img_b,
      setbanner,
      "https://connect4img.blob.core.windows.net/banner/defaultbanner.png"
    );
    console.log("data = ", data);
    console.log("fetchdata called 2");
    setLoader(false);
  };
  const fetch_links = async () => {
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const res = await axios(url + "fetchSocials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { username: d.username },
    });
    setLinks(res.data.socialData);
    console.log("fetched user 2", res.data);
    console.log("links = ", links);
  };
  useEffect(() => {
    // document.title = "Preview | Connect";
    update();
    fetch_links();
  }, [temp, check]);
  return (
    <div className="preview">
      {/* <span>{props.temp}</span> */}
      <div className="profile-url">
        <p>
          <strong> My url :</strong> <span>www.google.com</span>
        </p>
      </div>
      <div className="mobile">
        <div className="iphone">
          {/* <div className="p-photo">
              <img src="snappng.png" alt="" />
              <div className="username">
                <h4>Admin</h4>
              </div>
            </div> */}
          <div className="content">
            {/* <!--LOGO--> */}
            <div className="home-logo-cnt">
              <ClipLoader
                color={"black"}
                loading={loader}
                css={{
                  width: "30px",
                  height: "30px",
                  left: "1rem",
                  position: "absolute",
                  top: "1rem",
                }}
                size={40}
              />
              <img src="logo-removebg-preview.png" alt="" />
            </div>

            {/* <!--PROFILE AND BANNER--> */}
            <div className="home-main-back-banner">
              <div className="main-back-banner-img">
                {/* <!--Background Image to be made Dynamic in React--> */}
                <img src={banner} alt="" />
              </div>

              <div className="home-main-profile">
                <div className="home-main-profile-img">
                  {/* <!--Profile Image to be made Dynamic in React--> */}
                  <img src={avatar} alt="" />
                </div>

                <div className="home-main-profile-username">
                  {/* <!--Name and username to be made Dynamic in React--> */}
                  <h2>{props.name}</h2>
                  {props.username && <span>@{props.username}</span>}
                </div>
              </div>
            </div>

            {/* <!--BIO--> */}
            <div className="home-main-bio">
              <span>{props.bio}</span>
              <br />
              {/* <i className="fas fa-map-marker-alt"></i>
              <span className="home-profile-loc">New York, US</span> */}
            </div>

            {/* <!--CONNECT AND ADD BUTTON--> */}
            <div className="home-main-connect-add">
              {links &&
                links.map((e, i) => {
                  if (e.title === "Instagram") {
                    return (
                      <Links
                        icon="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png"
                        link={e.link}
                        title={e.title}
                      />
                    );
                  } else if (e.title === "Facebook") {
                    return (
                      <Links
                        icon="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png"
                        link={e.link}
                        title={e.title}
                      />
                    );
                  } else if (e.title === "Twitter") {
                    return (
                      <Links
                        icon="https://www.pngitem.com/pimgs/m/630-6308222_image-transparent-twitter-icon-png-png-download.png"
                        link={e.link}
                        title={e.title}
                      />
                    );
                  } else if (e.title === "Linkedin") {
                    return (
                      <Links
                        icon="https://brandlogos.net/wp-content/uploads/2016/06/linkedin-logo.png"
                        link={e.link}
                        title={e.title}
                      />
                    );
                  } else {
                    return (
                      <Links
                        icon={
                          "https://connect4img.blob.core.windows.net/icons/" +
                          e.icon +
                          "?time=" +
                          new Date()
                        }
                        link={e.link}
                        title={e.title}
                      />
                    );
                  }
                })}
            </div>

            {/* <!--Socials--> */}
            {/* <div className="toggle-tab">
                <div>
                  <div className="section">
                    <div className="icon-logo">
                      <i className="fas fa-file-signature ic"></i>
                    </div>
                    <input
                      type="text"
                      name="link"
                      id=""
                      placeholder="Handle Name"
                    />
                  </div>
                </div>
                <div className="section">
                  <div className="icon-logo">
                    <i className="far fa-image ic"></i>
                  </div>
                  <input
                    type="file"
                    name="photo"
                    id=""
                    // placeholder="upload photo"
                  />
                </div>
                <div className="section">
                  <div className="icon-logo">
                    <i className="fas fa-link ic"></i>
                  </div>
                  <input
                    type="text"
                    name="url"
                    id=""
                    placeholder="Profile url"
                  />
                </div>
              </div> */}
            <div className="home-main-socials slide">
              <div className="home-main-social-link">
                <div className="social-link-logo">
                  <i className="fas fa-file-signature ic"></i>
                </div>
                <div className="social-link-desc drop">
                  <input
                    type="text"
                    name="link"
                    id=""
                    placeholder="Handle Name"
                  />
                </div>
              </div>

              <div className="home-main-social-link">
                <div className="social-link-logo">
                  <i className="far fa-image ic"></i>
                </div>
                <div className="social-link-desc drop">
                  <input
                    type="file"
                    name="photo"
                    id=""
                    // placeholder="upload photo"
                  />
                </div>
              </div>

              <div className="home-main-social-link">
                <div className="social-link-logo">
                  <i className="fas fa-link ic"></i>
                </div>
                <div className="social-link-desc drop">
                  <input
                    type="text"
                    name="url"
                    id=""
                    placeholder="Profile url"
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="home-btn">
                  Submit
                </button>
              </div>
            </div>
            {/* <div className="home-main-socials">
                <div className="home-main-social-link">
                  <div className="social-link-logo">
                    <img src="download.png" />
                  </div>
                  <div className="social-link-desc">
                    <span>Instagram</span>
                  </div>
                </div>

                <div className="home-main-social-link">
                  <div className="social-link-logo">
                    <img src="snappng.png" />
                  </div>
                  <div className="social-link-desc">
                    <span>Snapchat</span>
                  </div>
                </div>

                <div className="home-main-social-link">
                  <div className="social-link-logo">
                    <img src="fb.png" />
                  </div>
                  <div className="social-link-desc">
                    <span>Facebook</span>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
