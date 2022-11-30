import React, { useEffect, useState } from "react";
import "./home.css";
import "./home-responsive.css";
import { Link, useLocation } from "react-router-dom";
const Menu = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");
  useEffect(() => {
    const body = document.body;
    const bgColorsBody = [
      "#ffb457",
      "#ff96bd",
      "#9999fb",
      "#ffe797",
      "#cffff1",
    ];
    const menu = body.querySelector(".menu");
    const menuItems = menu.querySelectorAll(".menu__item");
    const menuBorder = menu.querySelector(".menu__border");
    let activeItem = menu.querySelector(".active");
    function clickItem(item, index) {
      menu.style.removeProperty("--timeOut");

      if (activeItem === item) return;

      if (activeItem) {
        activeItem.classList.remove("active");
      }
      item.classList.add("active");
      body.style.backgroundColor = bgColorsBody[index];
      activeItem = item;
      offsetMenuBorder(activeItem, menuBorder);
    }

    function offsetMenuBorder(element, menuBorder) {
      const offsetActiveItem = element.getBoundingClientRect();
      const left =
        Math.floor(
          offsetActiveItem.left -
            menu.offsetLeft -
            (menuBorder.offsetWidth - offsetActiveItem.width) / 2
        ) + "px";
      menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;
    }

    offsetMenuBorder(activeItem, menuBorder);

    menuItems.forEach((item, index) => {
      item.addEventListener("click", () => clickItem(item, index));
    });

    window.addEventListener("resize", () => {
      offsetMenuBorder(activeItem, menuBorder);
      menu.style.setProperty("--timeOut", "none");
    });
    const d = document.cookie
      .split(";")
      .map((e) => e.split("="))
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
        {}
      );
    setUsername(d.username);
  }, []);
  return (
    <aside>
      <menu className="menu">
        <button
          className={`menu__item active`}
          // style="--bgColorItem: #ff8c00;"
        >
          <Link to="/home">
            <svg
              className={`icon ${location.pathname === "/home" ? "visit" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 26 26"
            >
              <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
            </svg>
          </Link>
        </button>
        <button
          className="menu__item"
          //   style="--bgColorItem: #f54888;"
        >
          <Link to="/scan">
            <svg
              className={`icon ${location.pathname === "/scan" ? "visit" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M7 0c-1.105 0-2 .896-2 2v18.678c-.002 2.213 3.503 3.322 7.006 3.322 3.498 0 6.994-1.106 6.994-3.322v-18.678c0-1.104-.895-2-2-2h-10zm5 22c-.553 0-1-.448-1-1s.447-1 1-1 1 .448 1 1-.447 1-1 1zm5-4h-10v-14h10v14zm-2.75-4.75v.75h.75v-.75h-.25v-.25h-.25v.25h-.25zm.5.25v.25h-.25v-.25h.25zm-5.75.5h2v-2h-2v2zm.25-1.75h1.5v1.5h-1.5v-1.5zm5 .75v-.25h.25v.25h-.25zm-4.75-.5h1v1h-1v-1zm2-.75v.5h-.25v-.5h.25zm.5-2h.25v.25h-.25v-.25zm.25-.25h.25v.25h-.25v-.25zm.25.5v-.25h.25v.25h-.25zm0-.5h.25v-1.5h-.75v.25h-.75v.25h.75v.25h.5v.75zm-.25-1v-.25h.25v.25h-.25zm-1.75 1h-1v-1h1v1zm1.5 0h-.25v-.5h-.5v-.25h.75v.25h.25v.25h-.25v.25zm-1-1.5h-2v2h2v-2zm-.25 1.75h-1.5v-1.5h1.5v1.5zm.75 0h-.25v-.25h.5v.5h-.25v-.25zm-.75.75v.25h-.25v-.25h.25zm3.75 1.5h.5v.75h-.25v-.25h-.5v.25h-.25v-.25h-.25v-.25h.25v-.25h.25v.25h.25v-.25zm-1 .5h-.25v.25h-.25v-.25h-.25v-.25h.25v-.25h-.5v-.25h-.25v.25h-.25v.25h-.5v.25h-.25v1.5h1.25v-.25h-.25v-.5h-.25v.5h-.5v-.25h.25v-.25h-.25v-.25h.75v-.25h.5v.5h-.25v.25h.25v.5h.25v-.5h.25v.25h.25v-.25h.25v-.5h.25v-.25h-.5v-.25zm-.25.75h-.25v-.25h.25v.25zm1.5-1.5v-.5h.25v.5h-.25zm-2.25 1.25v.25h-.25v-.25h.25zm1.25.75v-.25h.25v.5h-.5v-.25h.25zm-.75-5.75v2h2v-2h-2zm1.75 1.75h-1.5v-1.5h1.5v1.5zm-.25-.25h-1v-1h1v1zm.25 1h.25v.5h-.25v.25h-.5v-1h.25v.5h.25v-.25zm-1 1.5v-.75h.25v.75h-.25zm-3.25-1.75v.25h-.5v.25h.25v.25h-.75v-.25h.25v-.25h-.5v.25h-.25v-.5h1.5zm-.25 1v-.25h.25v.75h-.25v-.25h-.25v.25h-.25v-.25h-.25v.25h-.5v-.25h.25v-.25h1zm-1-.25v.25h-.25v-.25h.25zm4.75-.5h-.25v-.25h.25v.25zm-3.25 1h.25v.25h-.25v-.25zm3.75.5h-.25v-.25h.25v.25zm-1.25.25v-.25h.25v.25h-.25zm-.25-.25h.25v-.75h.5v-.25h.25v-.25h-.25v-.25h-.5v-.25h-.25v.25h-.25v-.25h-.25v.25h-.25v-.25h-.25v.25h-.25v.25h-.25v-.25h.25v-.25h-1v.25h.5v.25h-.5v.25h.25v.5h.25v-.25h.5v.5h.25v-1h.25v.5h.75v.25h-.5v.25h.5v.25zm.25-1.25h.25v.25h-.25v-.25zm-.5.25h-.25v-.25h.25v.25z" />
            </svg>
          </Link>
        </button>

        <button
          className="menu__item"
          //   style="--bgColorItem: #4343f5;"
        >
          <Link to="/profile">
            <svg
              className={`icon ${
                location.pathname === "/profile" ? "visit" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-5.083 0-8.465 4.949-3.733 13.678 1.596 2.945-1.725 3.641-5.09 4.418-3.073.709-3.187 2.235-3.177 4.904l.004 1h23.99l.004-.969c.012-2.688-.093-4.223-3.177-4.935-3.438-.794-6.639-1.49-5.09-4.418 4.719-8.912 1.251-13.678-3.731-13.678m0 1c1.89 0 3.39.764 4.225 2.15 1.354 2.251.866 5.824-1.377 10.06-.577 1.092-.673 2.078-.283 2.932.937 2.049 4.758 2.632 6.032 2.928 2.303.534 2.412 1.313 2.401 3.93h-21.998c-.01-2.615.09-3.396 2.401-3.93 1.157-.266 5.138-.919 6.049-2.94.387-.858.284-1.843-.304-2.929-2.231-4.115-2.744-7.764-1.405-10.012.84-1.412 2.353-2.189 4.259-2.189" />
            </svg>
          </Link>
        </button>

        <button
          className="menu__item pre"
          //   style="--bgColorItem: #e0b115;"
        >
          <Link
            to={`/${username}`}
            // onClick={() => {
            //   document.title = "Preview | Connect";
            // }}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path
                d="M5.1,3.9h13.9c0.6,0,1.2,0.5,1.2,1.2v13.9c0,0.6-0.5,1.2-1.2,1.2H5.1c-0.6,0-1.2-0.5-1.2-1.2V5.1
                  C3.9,4.4,4.4,3.9,5.1,3.9z"
              />
              <path d="M4.2,9.3h15.6" />
              <path d="M9.1,9.5v10.3" />
            </svg>
          </Link>
        </button>

        <button
          className="menu__item"
          //   style="--bgColorItem:#65ddb7;"
        >
          <Link to="/setting">
            <svg
              className={`icon ${
                location.pathname === "/setting" ? "visit" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 26 24"
              fill-rule="evenodd"
              clip-rule="evenodd"
            >
              <path d="M12 8.666c-1.838 0-3.333 1.496-3.333 3.334s1.495 3.333 3.333 3.333 3.333-1.495 3.333-3.333-1.495-3.334-3.333-3.334m0 7.667c-2.39 0-4.333-1.943-4.333-4.333s1.943-4.334 4.333-4.334 4.333 1.944 4.333 4.334c0 2.39-1.943 4.333-4.333 4.333m-1.193 6.667h2.386c.379-1.104.668-2.451 2.107-3.05 1.496-.617 2.666.196 3.635.672l1.686-1.688c-.508-1.047-1.266-2.199-.669-3.641.567-1.369 1.739-1.663 3.048-2.099v-2.388c-1.235-.421-2.471-.708-3.047-2.098-.572-1.38.057-2.395.669-3.643l-1.687-1.686c-1.117.547-2.221 1.257-3.642.668-1.374-.571-1.656-1.734-2.1-3.047h-2.386c-.424 1.231-.704 2.468-2.099 3.046-.365.153-.718.226-1.077.226-.843 0-1.539-.392-2.566-.893l-1.687 1.686c.574 1.175 1.251 2.237.669 3.643-.571 1.375-1.734 1.654-3.047 2.098v2.388c1.226.418 2.468.705 3.047 2.098.581 1.403-.075 2.432-.669 3.643l1.687 1.687c1.45-.725 2.355-1.204 3.642-.669 1.378.572 1.655 1.738 2.1 3.047m3.094 1h-3.803c-.681-1.918-.785-2.713-1.773-3.123-1.005-.419-1.731.132-3.466.952l-2.689-2.689c.873-1.837 1.367-2.465.953-3.465-.412-.991-1.192-1.087-3.123-1.773v-3.804c1.906-.678 2.712-.782 3.123-1.773.411-.991-.071-1.613-.953-3.466l2.689-2.688c1.741.828 2.466 1.365 3.465.953.992-.412 1.082-1.185 1.775-3.124h3.802c.682 1.918.788 2.714 1.774 3.123 1.001.416 1.709-.119 3.467-.952l2.687 2.688c-.878 1.847-1.361 2.477-.952 3.465.411.992 1.192 1.087 3.123 1.774v3.805c-1.906.677-2.713.782-3.124 1.773-.403.975.044 1.561.954 3.464l-2.688 2.689c-1.728-.82-2.467-1.37-3.456-.955-.988.41-1.08 1.146-1.785 3.126" />
            </svg>
          </Link>
        </button>

        <div className="menu__border"></div>
      </menu>
    </aside>
  );
};

export default Menu;
