import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import theme from "../theme";

const Title = styled.p`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.textColor};
  font-weight: bold;
`;

export default function TitleComponent({ icon, title, fontSize, textColor }) {
  return (
    <Title
      fontSize={fontSize ?? "25px"}
      textColor={textColor ?? theme.primaryColor}
    >
      {icon && <FontAwesomeIcon className="icon" icon={icon} />}
      {title && title}
    </Title>
  );
}
