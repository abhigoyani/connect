import React, { useRef } from "react";

const Links = (props) => {
  const ref = useRef();
  return (
    <>
      <div className="link">
        <div className="link-icon">
          <img src={props.icon} alt="" />
        </div>
        <button
          onClick={() => {
            ref.current.click();
          }}
        >
          <a href={props.link} rel="noreferrer" target="_blank" ref={ref}>
            {props.title}
          </a>
        </button>
      </div>
    </>
  );
};

export default Links;
