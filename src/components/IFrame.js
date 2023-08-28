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

  useEffect(() => {
    console.log("test", keyCount);
  }, [keyCount]);
  useEffect(() => {
    if (mountNode) {
      mountNode.setAttribute("style", "margin:0");
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
