import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Links from "./Links";
import "./user.css";
import ClipLoader from "react-spinners/ClipLoader";
import Page from "./Page";
// import "./home.css";
const User = () => {
  const param = useParams();
  const [loading, setLoading] = useState(false);
  //   let data;
  const [state, setState] = useState();
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [userlink, setUserlink] = useState([]);
  const url = process.env.REACT_APP_URL;
  const fetch_user = async () => {
    setLoading(true);
    const res = await axios(url + "fetchSocials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { username: param.username },
    });
    // data = res.data;
    setState(res.data);
    setUserlink(res.data.socialData);
    console.log("fetched user = ", res.data);
    if (res.data.avatar) {
      setAvatar(
        `https://connect4img.blob.core.windows.net/avatar/${param.username}-profile.jpg`
      );
    } else {
      setAvatar("https://connect4img.blob.core.windows.net/avatar/avatar.png");
    }
    if (res.data.banner) {
      setBanner(
        `https://connect4img.blob.core.windows.net/banner/${param.username}-banner.jpg`
      );
    } else {
      setBanner(
        "https://connect4img.blob.core.windows.net/banner/defaultbanner.png"
      );
    }
    // console.log("type = ", typeof res.data.avatar);
    // console.log("type = ", typeof res.data.banner);
    setLoading(false);
  };
  useEffect(() => {
    document.title = "Preview | Connect";
    fetch_user();
    console.log("state = ", state);
  }, []);
  if (loading) {
    return (
      <ClipLoader
        color={"black"}
        loading={loading}
        css={{ display: "block", margin: "3rem auto" }}
        size={40}
      />
    );
  }
  if (state) {
    if (state.stcode === 107) {
      return <Page />;
    }
  }
  return (
    <>
      <div className="user-outer">
        <div className="user-inner">
          <div className="user-inner2">
            <div className="user-about">
              <div className="photos">
                <div className="app-logo">
                  <img src="logo-removebg-preview.png" alt="logo" />
                </div>
                <div className="user-banner">
                  <img src={banner} alt="" />
                </div>
                <div className="user-info">
                  <div className="user-avatar">
                    <img src={avatar} alt="" />
                  </div>

                  <div className="user-data">
                    {state && <p>{state.name}</p>}
                    <span>@{param.username}</span>
                  </div>
                </div>
              </div>
              <div className="user-bio">
                {state && <span>{state.bio}</span>}
              </div>
            </div>
            <div className="user-links">
              {userlink &&
                userlink.map((e, i) => {
                  if (e.title === "Instagram") {
                    console.log("instagram");
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
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
