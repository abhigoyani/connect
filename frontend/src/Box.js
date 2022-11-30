import React, { useRef, useState } from "react";
import "./main.css";
import $ from "jquery";
import "./box.css";
import axios from "axios";
import loading from "./loader2.gif";
const Box = (props) => {
  const { link, title, icon } = props.data;
  if (title === "Instagram") $(".instabox").hide();
  if (title === "Facebook") $(".fbbox").hide();
  if (title === "Linkedin") $(".ldbox").hide();
  if (title === "Twitter") $(".ttbox").hide();
  // console.log("icon = ", icon);
  const ref = useRef();
  const [state, setState] = useState({
    url: link,
    title: title,
    iconurl: icon,
    icon: icon,
    load: false,
  });
  const [loader, setLoader] = useState();
  const [loader2, setLoader2] = useState();
  const url = process.env.REACT_APP_URL;
  const delete_link = async (uri) => {
    setLoader2(true);
    // console.log("loader", loader);
    // console.log("url = ", uri);
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const res = await axios(url + "deleteURL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { token: d.token, url: uri },
    });
    if (res.data.stcode === 105) {
      window.location.href = "/";
    }
    // console.log("deleted api = ", res.data);
    if (
      res.data.title === "Instagram" ||
      res.data.title === "Facebook" ||
      res.data.title === "Twitter" ||
      res.data.title === "Linkedin"
    ) {
      window.location.href = "/home";
    }
    setLoader2(false);
    // console.log("loader", loader);
    props.page_ref(Math.random());
  };
  const edit_link = async (uri, title, iconurl, icon) => {
    setLoader(true);
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const fdata = new FormData();
    fdata.append("token", d.token);
    fdata.append("url", uri);
    fdata.append("title", title);
    fdata.append("iconURL", iconurl);
    fdata.append("icon", icon);
    try {
      const res = await axios(url + "editURL", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: fdata,
      });
      console.log("edit api = ", res);
    } catch (e) {
      // console.log("error - ", e);
    }
    $(`.inp${props.k}`).hide();
    $(`.text${props.k}`).show();
    setLoader(false);
    props.page_ref(Math.random());
  };

  // useEffect(() => {
  //   // console.log("loader = ", loader);
  // }, []);
  return (
    <>
      <div className="box2">
        <input
          className={`hideb inp${props.k}`}
          type="text"
          name="title"
          id=""
          value={state.title}
          placeholder="Title Here"
          onChange={(e) => {
            setState({ ...state, title: e.target.value });
          }}
        />
        <input
          type="text"
          className={`hideb inp${props.k}`}
          name="url"
          id=""
          value={state.url}
          placeholder="Url Here"
          onChange={(e) => {
            setState({ ...state, url: e.target.value });
          }}
        />
        <div className={`textb text${props.k}`}>
          <h3>{title}</h3>
        </div>
        <div className={`textb text${props.k}`}>
          <p>{link}</p>
        </div>
        <button
          className="load-btn"
          onClick={() => {
            edit_link(state.url, state.title, state.iconurl, state.icon);
          }}
        >
          {loader && <img src={loading} alt="loading" />}
          {!loader && <span>Add</span>}
        </button>
        <button
          onClick={() => {
            $(`.inp${props.k}`).show();
            $(`.text${props.k}`).hide();
          }}
        >
          <i className="fas fa-pencil-alt edit"></i>
        </button>
        <button
          onClick={() => {
            delete_link(link);
          }}
        >
          {loader2 && <img src={loading} alt="loading" />}
          {!loader2 && <i className="fas fa-trash-alt delete"></i>}
        </button>
        <input
          type="file"
          name=""
          id=""
          onChange={(e) => {
            setState({ ...state, icon: e.target.files[0] });
            console.log("default = ", e.target.files[0]);
          }}
          ref={ref}
          style={{ display: "none" }}
        />
        <button
          className={
            title === "Instagram" ||
            title === "Facebook" ||
            title === "Twitter" ||
            title === "Linkedin"
              ? "upload"
              : ""
          }
          onClick={() => {
            ref.current.click();
          }}
        >
          <i className="fas fa-image"></i>
        </button>
      </div>
    </>
  );
};

export default Box;
