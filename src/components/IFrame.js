// iframe.js

import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { createPortal } from "react-dom";
import useChecksum from "../helpers/useChecksum";
import { serialize, deserialize } from "react-serialize";

export default function IFrame({ ui, keyCount = 34, ...props }) {
  const checksum = useChecksum(keyCount);
  const [contentRef, setContentRef] = useState(null);
  let mountNode = contentRef?.contentWindow?.document?.body;
  let headNode = contentRef?.contentWindow?.document?.head;

  useEffect(() => {
    console.log("test", keyCount);
  }, [keyCount]);
  useEffect(() => {
    if (mountNode) {
      mountNode.setAttribute(
        "style",
        "margin:0;zoom: 0.80;@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao&display=swap');font-family: 'Noto Sans Lao', sans-serif;"
      );
      // a.setAttribute("href", "somelink url");
      let link = document.createElement("link");
      link.href = "https://fonts.googleapis.com";
      link.rel = "preconnect";
      let link2 = document.createElement("link");
      link2.href = "https://fonts.gstatic.com";
      link2.rel = "preconnect";
      link2.crossorigin = true;
      let link3 = document.createElement("link");
      link3.href =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+Lao&display=swap";
      link3.rel = "stylesheet";

      let _style = document.createElement("style");
      _style.type = "text/css"; // Set the type attribute to "text/css"
      _style.textContent = `
  /* Your CSS styles go here */
  * { scrollbar-width: none; }
  *::-webkit-scrollbar { display: none;  width: 0 !important; } 
`;
      _style.appendChild = "";
      headNode.appendChild(_style);
      headNode.appendChild(link);
      headNode.appendChild(link2);
      headNode.appendChild(link3);
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";

      headNode.appendChild(linkElement);
    }
  }, [mountNode]);

  // function

  return (
    <>
      <iframe key={checksum} ref={setContentRef} {...props}>
        {mountNode && createPortal(deserialize(ui), mountNode, checksum)}
      </iframe>
    </>
  );
}
