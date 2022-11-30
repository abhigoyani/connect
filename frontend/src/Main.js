import React, { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import "./main.css";
import Box from "./Box";
import Preview from "./Preview";
import axios from "axios";
import fetchdata from "./Global";
import validator from "validator";
import loading from "./loader2.gif";
import $ from "jquery";
import ClipLoader from "react-spinners/ClipLoader";
const Main = () => {
  const ref = useRef();
  const Url = process.env.REACT_APP_URL;
  const d = document.cookie
    .split(";")
    .map((e) => e.split("="))
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
      {}
    );
  // const $ = window.$;
  // const [title, setTitle] = useState("");
  const [loader, setLoader] = useState();
  // const [msg, setmsg] = useState("");
  const [checklink, setChecklink] = useState(0);
  const [state, setState] = useState(false);
  const [link, setLink] = useState({
    icon: "",
    title: "",
    url: "",
    load: false,
  });
  const [links, setLinks] = useState([]);
  // const [final, setFinal] = useState(undefined);
  const [msg, setMsg] = useState("");
  let res, da;
  const [insta, setInsta] = useState({
    name: "insta",
    title: "Instagram",
    url: "",
    load: false,
  });
  const [fb, setFb] = useState({
    name: "fb",
    title: "Facebook",
    url: "",
    load: false,
  });
  const [tt, setTt] = useState({
    name: "tt",
    title: "Twitter",
    url: "",
    load: false,
  });
  const [ld, setLd] = useState({
    name: "ld",
    title: "Linkedin",
    url: "",
    load: false,
  });
  // const change_url = (key) => {};
  const adddata = () => {
    // console.log("clicked");
    // setLink();
    setLink({ ...link, title: "", url: "" });
    $(".box3").fadeIn(500);
  };

  const send_links = async (ob) => {
    $(".alert-add").slideUp();
    if (
      !validator.isURL(ob.url) ||
      ob.url.length === 0 ||
      ob.title.length === 0
    ) {
      if (ob.title.length === 0) {
        setMsg("Enter Title");
      } else {
        setMsg("invalid url");
      }
      $(`.${ob.name}`).slideDown();
      $(".alert-add").slideDown();
      console.log("not valid");
    } else {
      $(".alert-add").slideUp();
      if (ob.name === "insta") {
        setInsta({ ...insta, load: true });
      } else if (ob.name === "fb") {
        setFb({ ...fb, load: true });
      } else if (ob.name === "ld") {
        setLd({ ...ld, load: true });
      } else {
        setTt({ ...tt, load: true });
      }
      setLoader(true);
      $(`.${ob.name}`).slideUp();
      // console.log("object = ", title, " = ", url);
      const d = document.cookie
        .split(";")
        .map((e) => e.split("="))
        .reduce(
          (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
          {}
        );
      // console.log("token = ", d.token);
      const fdata = new FormData();
      fdata.append("token", d.token);
      fdata.append("title", ob.title);
      fdata.append("socialURL", ob.url);
      fdata.append("icon", ob.icon);
      // console.log("formdata = ", fdata);
      const res = await axios(Url + "add_socials", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: fdata,
      });
      console.log(res);
      $(".box3").fadeOut();
      // console.log("hello world = ", res.data);
      // $(`.hide-${ob.name}`).show();
      // $(`.${ob.name}-url`).hide();
      // }
      setInsta({ ...insta, load: false });
      setFb({ ...fb, load: false });
      setLd({ ...ld, load: false });
      setTt({ ...tt, load: false });
      // setLink({ ...ob, load: false });
      setLoader(false);
      setChecklink(Math.random());
    }
  };
  const fetch_links = async () => {
    setState(true);
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    const res = await axios(Url + "fetchSocials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { username: d.username },
    });
    setLinks(res.data.socialData);
    // console.log("fetch socials = ", res.data);
    $(".box3").fadeOut(500);
    // console.log("links main = ", links);
    setState(false);
  };
  useEffect(() => {
    document.title = "Home | Connect";
    // console.log("callled checklink");
    try {
      const data = fetchdata(res, da);
      document.querySelector(".name").value = data.name;
      document.querySelector(".bio").value = data.bio;
    } catch (e) {
      // console.log(e);
    }
    fetch_links();
  }, [checklink]);
  return (
    <div className="wrapper">
      <Menu />
      <div className="edit-profile">
        <ClipLoader
          color={"black"}
          loading={state}
          css={{
            display: "block",
            top: "10px",
            width: "30px",
            height: "30px",
            margin: "auto",
            position: "absolute",
          }}
          size={40}
        />
        <div className="add-links">
          <button className="add-link" onClick={adddata}>
            Add New Link
          </button>
        </div>

        {/* <form method="post" onSubmit={(e) => e.preventDefault()}> */}
        <div className="boxes">
          <div className="box box3">
            <div className="alert-add">
              <i className="fas fa-times"></i> <span>{msg}</span>
            </div>
            <input
              type="text"
              name=""
              id=""
              value={link.title}
              placeholder="Title Here"
              onChange={(e) => {
                setLink({ ...link, title: e.target.value });
              }}
            />
            <input
              type="text"
              name=""
              id=""
              value={link.url}
              placeholder="Url Here"
              onChange={(e) => {
                setLink({ ...link, url: e.target.value });
              }}
            />
            <button
              onClick={() => {
                send_links(link);
              }}
            >
              {loader && <img src={loading} alt="loading" />}
              {!loader && <span>Add</span>}
            </button>
            <input
              type="file"
              name=""
              id=""
              onChange={(e) => {
                setLink({ ...link, icon: e.target.files[0] });
              }}
              ref={ref}
              style={{ display: "none" }}
            />
            <button onClick={() => ref.current.click()}>
              <i className="fas fa-image"></i>
            </button>
            <button
              onClick={() => {
                $(".box3").fadeOut(500);
              }}
            >
              <i className="fas fa-trash-alt delete"></i>
            </button>
          </div>
          {links &&
            links.map((e, i) => {
              return (
                <Box
                  data={e}
                  k={i}
                  change={send_links}
                  // load={link.load}
                  page_ref={setChecklink}
                />
              );
            })}
          <div className="box show instabox">
            <div className="text">
              <h3>Instagram</h3>
            </div>
            <div className="alert insta">
              <i className="fas fa-times"></i> <span>URL not valid</span>
            </div>
            <input
              type="text"
              className="insta-url"
              name="url"
              id=""
              value={insta.url}
              placeholder="Url Here"
              onChange={(e) => setInsta({ ...insta, url: e.target.value })}
            />
            <div className="text">
              <p className="hide hide-insta">{insta.url}</p>
            </div>
            <button
              className="load-btn"
              onClick={() => {
                send_links(insta);
              }}
            >
              {insta.load && <img src={loading} alt="loading" />}
              {!insta.load && <span>Add</span>}
            </button>
            {/* <button>
              <i
                className="fas fa-pencil-alt edit"
                onClick={() => {
                  edit("insta");
                }}
              ></i>
            </button> */}
            {/* <button
              onClick={() => {
                del("insta");
              }}
            >
              <i className="fas fa-trash-alt delete"></i>
            </button> */}
          </div>
          <div className="box show fbbox">
            <div className="text">
              <h3>Facebook</h3>
            </div>
            <div className="alert fb">
              <i className="fas fa-times"></i> <span>URL not valid</span>
            </div>
            <input
              type="text"
              className="fb-url"
              name="url"
              id=""
              value={fb.url}
              onChange={(e) => setFb({ ...fb, url: e.target.value })}
              placeholder="Url Here"
            />
            <div className="text">
              <p className="hide hide-fb">{fb.url}</p>
            </div>
            <button
              className="load-btn"
              onClick={() => {
                send_links(fb);
              }}
            >
              {fb.load && <img src={loading} alt="loading" />}
              {!fb.load && <span>Add</span>}
            </button>
            {/* <button>
              <i
                className="fas fa-pencil-alt edit"
                onClick={() => {
                  edit("fb");
                }}
              ></i>
            </button> */}
            {/* <button
              onClick={() => {
                // this.remove();
                del("fb");
              }}
            >
              <i className="fas fa-trash-alt delete"></i>
            </button> */}
            {/* <button>
              <i className="fas fa-image"></i>
            </button> */}
          </div>
          <div className="box show ttbox">
            <div className="text">
              <h3>Twitter</h3>
            </div>
            <div className="alert tt">
              <i className="fas fa-times"></i> <span>URL not valid</span>
            </div>
            <input
              type="text"
              className="tt-url"
              name="url"
              id=""
              value={tt.url}
              onChange={(e) => setTt({ ...tt, url: e.target.value })}
              placeholder="Url Here"
            />
            <div className="text">
              <p className="hide hide-tt">{tt.url}</p>
            </div>
            <button
              className="load-btn"
              onClick={() => {
                send_links(tt);
              }}
            >
              {tt.load && <img src={loading} alt="loading" />}
              {!tt.load && <span>Add</span>}
            </button>
            {/* <button>
              <i
                className="fas fa-pencil-alt edit"
                onClick={() => {
                  edit("tt");
                }}
              ></i>
            </button> */}
            {/* <button
              onClick={() => {
                del("twitter");
              }}
            >
              <i className="fas fa-trash-alt delete"></i>
            </button> */}
            {/* <button>
              <i className="fas fa-image"></i>
            </button> */}
          </div>
          <div className="box show ldbox">
            <div className="text">
              <h3>Linkedin</h3>
            </div>
            <div className="alert ld">
              <i className="fas fa-times"></i> <span>URL not valid</span>
            </div>
            <input
              type="text"
              className="ld-url"
              name="url"
              id=""
              value={ld.url}
              onChange={(e) => setLd({ ...ld, url: e.target.value })}
              placeholder="Url Here"
            />
            <div className="text">
              <p className="hide hide-ld">{ld.url}</p>
            </div>
            <button
              className="load-btn"
              onClick={() => {
                send_links(ld);
              }}
            >
              {ld.load && <img src={loading} alt="loading" />}
              {!ld.load && <span>Add</span>}
            </button>
            {/* <button>
              <i
                className="fas fa-pencil-alt edit"
                onClick={() => {
                  edit("ld");
                }}
              ></i>
            </button> */}
            {/* <button
              onClick={() => {
                // document.querySelector();
                del("ld");
              }}
            >
              <i className="fas fa-trash-alt delete"></i>
            </button> */}
            {/* <button>
              <i className="fas fa-image"></i>
            </button> */}
          </div>
        </div>
        {/* <button className="final">Apply</button> */}
        {/* </form> */}
      </div>
      <Preview
        name={d.name}
        bio={d.bio}
        username={d.username}
        check={checklink}
        // imgurl={`https://connect4img.blob.core.windows.net/avatar/${d.username}-profile.jpg`}
      />
    </div>
  );
};

export default Main;
