"use client";

import Link from "next/link";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Home() {
  return (
    <StyledDiv>
      <h1>Investment for crypto and stocks</h1>
      <p>View top gainers and losers in the stock market</p>
      <Link href="/stocks">
        <button>View Market Data</button>
      </Link>
    </StyledDiv>
  );
}