import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

// color: ${props => props.color};
// background-color: ${props => props.backgroundColor};

const CustomButton = styled.button`
  height: auto;
  border: 0;
  padding: 9px 15px;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  width: ${(props) => props.width ?? "auto"};
  height: ${(props) => props.height ?? "auto"};
  background: ${(props) =>
    props.coloractive ? props.coloractive : props.colorbg};

  &:hover {
    border: none;
    background: ${(props) => props.hoverbg};
    transition: 0.2s;
  }
`;

export default function ButtonComponent({
  icon,
  title,
  width,
  height,
  handleClick,
  colorbg,
  hoverbg,
  coloractive,
  type,
  disabled,
}) {
  return (
    <CustomButton
      type={type}
      disabled={disabled}
      width={width}
      height={height}
      colorbg={colorbg}
      hoverbg={hoverbg}
      coloractive={coloractive}
      onClick={handleClick}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      &nbsp;
      {title && title}
    </CustomButton>
  );
}
