import React from "react";
import { Navigate } from "react-router-dom";
import styled, { css } from "styled-components";

const CategoryStyles = styled.div`
  display: block;
  background-color: rgba(255, 165, 0, 0.8);
  margin: 5px 0;
  color: #fff;
  padding: 2px 5px;
  font-size: 12px;
  border-radius: 8px;
  text-align: center;
  max-width: 100px;
  width: 100%;
  overflow: hidden;
`;

export default function Category({ children, kind, to = "/", ...props }) {
  if (to !== "" && typeof to === "string") {
    return (
      <CategoryStyles kind={kind}>
        <span className={`${props.className} `}>{children}</span>
      </CategoryStyles>
    );
  }
  return (
    <CategoryStyles kind={kind}>
      <span className={props.className}>{children}</span>
    </CategoryStyles>
  );
}
