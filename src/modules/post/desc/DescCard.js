import React from "react";
import styled from "styled-components";

const DescCardStyles = styled.div`
  .desc {
    color: ${(props) => props.color};
    font-weight: 500;
    font-size: ${(props) => props.size};
  }
`;

export default function DescCard({ children, color, size, ...props }) {
  return (
    <DescCardStyles color={color} size={size}>
      <div className="desc" {...props}>
        {children}
      </div>
    </DescCardStyles>
  );
}
