import React from "react";
import styled from "styled-components";
import left from "../images/left_arrow.svg";
import right from "../images/right_arrow.svg";

const Container = styled.div`
  display: flex;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  user-select: none;
`;
const Page = styled.div`
  margin: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #aaa;
`;

const Pagination = ({ lastPage, page, onPrev, onNext, onClickPage }) => {
  return (
    <Container style={{ marginTop: "1rem" }}>
      <img src={right} style={{ width: "12px" }} onClick={onPrev} alt="" />
      <Container style={{ width: "200px" }}>
        {page >= lastPage - 1 && <Page />}
        {page !== 1 ? (
          <Page
            onClick={() => {
              onClickPage(page - 1);
            }}
          >
            {page - 1}
          </Page>
        ) : (
          <Page />
        )}
        <Page style={{ color: "#1098ad" }}>{page}</Page>
        {lastPage !== 0 && page !== lastPage && (
          <Page
            onClick={() => {
              onClickPage(page + 1);
            }}
          >
            {page + 1}
          </Page>
        )}
        {page < lastPage - 1 && <Page>...</Page>}
        {page < lastPage - 1 ? (
          <Page
            onClick={() => {
              onClickPage(lastPage);
            }}
          >
            {lastPage}
          </Page>
        ) : (
          <Page />
        )}
      </Container>
      <img src={left} style={{ width: "12px" }} onClick={onNext} alt="" />
    </Container>
  );
};

export default Pagination;
