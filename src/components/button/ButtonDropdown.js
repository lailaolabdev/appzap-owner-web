import React, { useEffect, useState, Children } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { BsCaretDown } from "react-icons/bs";

export default function ButtonDropdown({ children, variant, onChange }) {
  const [select, setSelect] = useState(
    children?.[0]?.props?.children ?? "ButtonDropdown"
  );
  const [value, setValue] = useState();
  const [showList, setShowList] = useState(false);

  const handleChange = (value, children) => {
    setSelect(children);
    setValue(value);
    if (onChange) {
      onChange(value);
    }
    setShowList(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        variant={variant}
        onFocusCapture={() => {
          setShowList(true);
        }}
        onBlurCapture={() => {
          setTimeout(() => setShowList(false), 300);
        }}
      >
        {select} <BsCaretDown />
      </Button>

      <ListGroup
        style={{
          display: showList ? "block" : "none",
          position: "absolute",
          zIndex: 999,
          width: "100%",
        }}
      >
        {Children?.map(children, (child, index) => {
          return (
            <ListGroup.Item
              action
              value={child?.props?.value}
              onClick={() =>
                handleChange(child?.props?.value, child?.props?.children)
              }
            >
              {child?.props?.children}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
