import React, { useState, useEffect } from "react";
import topIcon from "../images/arrow_top.svg";
import styled from "styled-components";

const Img = styled.img`
  width: 8px;
  transition: all ease-out 0.15s;
  -webkit-transition: all ease-out 0.15s;
  transform: ${props => (props.isTop ? null : "rotate(180deg)")};
  -webkit-transform: ${props => (props.isTop ? null : "rotate(180deg)")};
`;

const ToggleTableHeader = ({
  header,
  onClick,
  index,
  currentSelected,
  width
}) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    currentSelected !== index && setIsTop(true);
  }, [currentSelected]);

  return (
    <th
      style={{
        textAlign: header.align,
        color: currentSelected === index && "#1098ad",
        width
      }}
      onClick={() => {
        setIsTop(!isTop);
        onClick(header.value, isTop, index);
      }}
    >
      {header.title} <Img src={topIcon} alt="" isTop={isTop} />
    </th>
  );
};

export default ToggleTableHeader;
