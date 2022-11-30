import axios from "axios";
import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Preview from "./Preview";
import imageCompression from "browser-image-compression";
import loading from "./loader2.gif";

const Profile = () => {
  const d = document.cookie
    .split(";")
    .map((e) => e.split("="))
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
      {}
    );
  const url = process.env.REACT_APP_URL;
  const [name, setName] = useState("");
  const [uptext, setUptext] = useState(0);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarUp, setAvatarUp] = useState(0);
  const [bannerUp, setbannerUp] = useState(0);
  const [banner, setBanner] = useState();
  const [temp, setTemp] = useState(0);
  const [loada, setLoada] = useState(false);
  const [loadb, setloadb] = useState(false);
  const [loader, setLoader] = useState(false);
  // const [final, setFinal] = useState(undefined);
  // const [user, setUser] = useState({});
  const change_details = async () => {
    // console.log("chage details called");
    setLoader(true);
    if (avatar || banner) {
      const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      if (avatar) {
        const compressedFile = await imageCompression(avatar, options);
        console.log(
          `compressedFile size avatar ${compressedFile.size / 1024} KB`
        );
        // console.log("new file = ", compressedFile);
        setAvatar(compressedFile);
      }
      if (banner) {
        const compressedFile = await imageCompression(banner, options);
        console.log(
          `compressedFile size banner ${compressedFile.size / 1024} KB`
        );
        console.log("new file2 = ", compressedFile);
        setBanner(compressedFile);
      }
    }
    // setFinal({ name: name, bio: bio });
    var d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    if (name.length === 0) setName(d.name);
    if (bio.length === 0) setBio(d.bio);
    // console.log("change name = ", name.length);
    // console.log("change bio = ", bio.length);
    document.cookie = `name=${name.length === 0 ? d.name : name}`;
    document.cookie = `bio=${bio.length === 0 ? d.bio : bio}`;

    d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    // console.log("change name2 = ", d.name);
    // console.log("change bio2 = ", d.bio);
    const form = new FormData();
    // const x = checktextupdt();
    form.append("token", d.token);
    form.append("name", d.name);
    form.append("bio", d.bio);
    form.append("textUpdt", uptext);
    form.append("avatar", avatar);
    form.append("banner", banner);
    form.append("avatarUP", avatarUp);
    form.append("bannerUP", bannerUp);
    // form.append("isavatar", isavatar);
    // form.append("isbanner", isbanner);

    const res = await axios(url + "user-profile-update", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: form,
    });
    // const data = await res;
    console.log("res ----- ", res);
    setUptext(0);
    setbannerUp(0);
    setAvatarUp(0);
    // fetchdata();
    d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    document.querySelector(".name").value = d.name;
    document.querySelector(".bio").value = d.bio;
    setTemp(Math.random());
    setLoader(false);
    // console.log("after fetch profile");
  };
  const remove = async (endpoint) => {
    if (endpoint === "deleteBanner") {
      setloadb(true);
    } else {
      setLoada(true);
    }
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    try {
      const res = await fetch(url + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: d.token,
        }),
      });
      const data = await res.json();
      if (data.stcode === 105) {
        window.location.href = "/";
      }
      setTemp(Math.random());
      // console.log("data = =", data);
    } catch (e) {
      // console.log("error = ", e);
    }
    setloadb(false);
    setLoada(false);
  };
  useEffect(() => {
    document.title = "Profile | Connect";
    // console.log("use change called");
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    document.querySelector(".name").value = d.name;
    document.querySelector(".bio").value = d.bio;
    // console.log("temp = ", temp);
    // console.log("changed name = ", name);
    // console.log("changed bio = ", bio);
  }, [temp]);
  return (
    <div className="wrapper">
      <Menu />
      <div className="profile">
        <form
          method="post"
          // action={url + "user-profile-update"}
          // enctype="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="user-profile">
            <div className="p-title">
              <h2>User Profile</h2>
            </div>
            <div className="change-name">
              <p>Change Name</p>
              <input
                type="text"
                name=""
                className="name"
                id=""
                // value={final ? final.name : name}
                placeholder="Your Name"
                onChange={(e) => {
                  setUptext(1);
                  // console.log("name called");
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="avatar">
              <p>Change Avatar</p>
              <input
                type="file"
                className="custom-file-input"
                onChange={(e) => {
                  // console.log(e.target.files[0]);
                  setAvatarUp(1);
                  setAvatar(e.target.files[0]);
                }}
              />
              <button className="rmvbtn" onClick={() => remove("deleteAvatar")}>
                {loada && <img src={loading} width="20px" alt="loading" />}
                {!loada && <span>Remove</span>}
              </button>
            </div>
            <div className="banner">
              <p>Profile Banner</p>
              <input
                type="file"
                className="custom-file-input"
                onChange={(e) => {
                  // console.log(e.target.files[0]);
                  setbannerUp(1);
                  setBanner(e.target.files[0]);
                  // console.log("banner = ", banner);
                }}
              />
              <button className="rmvbtn" onClick={() => remove("deleteBanner")}>
                {loadb && <img src={loading} width="20px" alt="loading" />}
                {!loadb && <span>Remove</span>}
              </button>
            </div>
            <div className="about">
              <p>About</p>
              <textarea
                className="bio"
                name=""
                id=""
                cols="50"
                rows="8"
                // value={final ? final.bio : bio}
                placeholder="Tell the world a little bit about yourself"
                onChange={(e) => {
                  setUptext(1);
                  // console.log("bio called");
                  setBio(e.target.value);
                }}
              ></textarea>
            </div>
            <button className="apply load" onClick={change_details}>
              {loader && <img src={loading} alt="loading" width="24px" />}
              {!loader && <span>Apply</span>}
            </button>
          </div>
        </form>
      </div>
      <Preview name={d.name} bio={d.bio} username={d.username} temp={temp} />
    </div>
  );
};

export default Profile;
