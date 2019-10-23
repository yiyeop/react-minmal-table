import React, { useState, useEffect } from "react";
import styled from "styled-components";
import queryString from "query-string";
import _ from "lodash";

const Container = styled.div`
  width: 100%;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  .grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 0.5rem;
    margin-bottom: 1rem;
    @media screen and (max-width: 800px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .grid-item {
    input[type="text"] {
      outline-style: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      height: auto;
      line-height: normal;
      border: none;
      width: 90%;
      border: 1px solid #ccc;
      padding: 0.5rem 5%;
      border-radius: 8px;
    }
  }
`;
const Button = styled.div`
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  text-align: center;
  color: white;
  width: fit-content;
  background: #0c8599;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  &:hover {
    opacity: 0.9;
  }
`;

const Search = ({ headers, data, setData, resetData, page, setPage }) => {
  const [keywords, setKeywords] = useState({});
  const [open, setOpen] = useState(false);

  const lastQuery = queryString.parse(window.location.search);

  const addQuery = keywords => {
    const query = queryString.stringify({ page, ...keywords });

    window.history.replaceState(
      { data: "replace" },
      "Save Search Data",
      `${window.location.pathname}?${query}`
    );
  };

  const doSearch = keywords => {
    addQuery(keywords);

    let result = data;
    Object.keys(keywords).forEach(condition => {
      result = result.filter(item => {
        return item[condition] && item[condition].includes(keywords[condition]);
      });
    });
    setData(result);
  };

  // 처음 로딩시 퀴리에 있는 값으로 바꿔줌
  useEffect(() => {
    let copiedQuery = _.cloneDeep(lastQuery);
    delete copiedQuery["page"];
    if (Object.keys(copiedQuery).length > 0) {
      setOpen(true);
    }
    setKeywords(copiedQuery);
    doSearch(copiedQuery);
    if (lastQuery.page) setPage(parseInt(lastQuery.page));
  }, [data]);

  useEffect(() => {
    addQuery(keywords);
  }, [page]);

  return (
    <>
      {!open && (
        <Container>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            검색창 열기
          </Button>
        </Container>
      )}
      {open && (
        <Container>
          <div
            style={{
              width: "100%",
              color: "#868e96",
              textAlign: "right",
              padding: "0.5rem 0",
              fontSize: "14px"
            }}
          >
            <span
              onClick={() => {
                setOpen(false);
              }}
            >
              X {/* <Icon name="window close" /> */}
            </span>
          </div>
          <div className="grid">
            {headers.map((header, index) => {
              if (!header.notSearch)
                return (
                  <div className="grid-item" key={index}>
                    <input
                      type="text"
                      name={header.value}
                      placeholder={header.title}
                      defaultValue={
                        keywords[header.value] && keywords[header.value]
                      }
                      onKeyDown={e => {
                        if (e.keyCode === 13) {
                          doSearch(keywords);
                        }
                      }}
                      onChange={e => {
                        setKeywords({
                          ...keywords,
                          [e.target.name]: e.target.value
                        });
                      }}
                    />
                  </div>
                );
              return null;
            })}
          </div>
          <Button
            onClick={() => {
              doSearch(keywords);
            }}
            style={{ width: "100%" }}
          >
            검색
          </Button>
          <Button
            onClick={() => {
              resetData();
              setKeywords({});
            }}
            style={{
              marginTop: "0.5rem",
              background: "#868e96",
              width: "100%"
            }}
          >
            초기화
          </Button>
        </Container>
      )}
    </>
  );
};

export default Search;
