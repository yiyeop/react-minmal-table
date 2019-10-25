import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import Pagination from "./components/Pagination";
import _ from "lodash";
import ToggleTableHeader from "./components/ToggleTableHeader";
import Search from "./Search";

const TableContainer = styled.table`
  font-size: 13px;
  border-collapse: separate;
  border-spacing: 0 6px;
  width: 100%;
  text-align: left;
  tr td:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  tr td:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  th {
    font-weight: normal;
    font-size: 14px;
    color: #373751;
    user-select: none;
  }
  th,
  td {
    padding: 0 0.4rem;
    overflow: hidden;
    max-width: 0;
    transition: 0.05s all linear;
  }
  td {
    padding: 0.5rem 0.4rem;
    color: #495057;
    @media screen and (max-width: 800px) {
      text-overflow: visible;
      white-space: pre-wrap;
    }
    border-bottom: 1px solid #dfdfdf;
  }
  tbody tr:hover {
    background: #fff;
    box-shadow: 0 1px 5px 0.5px rgba(0, 0, 0, 0.2);
    td {
      /* padding: 1rem; */
    }
  }
`;

const Table = ({
  headers,
  data,
  index,
  checkbox,
  perPage,
  setCheckedList,
  notSearch,
  notPagination
}) => {
  const [page, setPage] = useState(1);
  const [sortData, setSortData] = useState(data); // 전체 정렬용
  const [currentSelected, setCurrentSelected] = useState(null); // 상단 오름, 내림차순 정렬 선택
  const [selectedArr, setSelectedArr] = useState([]); // 체크된 열

  const LAST_PAGE = Math.ceil(sortData.length / parseInt(perPage));

  useEffect(() => {
    if (setCheckedList) setCheckedList(selectedArr);
  }, [selectedArr]);

  const viewData = useMemo(() => {
    // 페이지수마다 잘라서 보여줄 데이터
    return sortData
      .map((item, dataIndex) => {
        return {
          ...item,
          checkIndex: dataIndex
        };
      })
      .slice((page - 1) * perPage, (page - 1) * perPage + perPage);
  }, [page, sortData]);

  const changeSortData = (condition, desc, index) => {
    setCurrentSelected(index);
    desc
      ? setSortData(_.sortBy(data, [condition]).reverse())
      : setSortData(_.sortBy(data, [condition]));
  };

  const checkAll = e => {
    const { checked } = e.target;
    const allCheckBox = document.getElementsByClassName("row-check");
    for (const box of allCheckBox) {
      box.checked = checked;
    }

    checked ? setSelectedArr(viewData) : setSelectedArr([]);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {!notSearch && (
        <Search
          headers={headers}
          data={data}
          setData={arr => {
            setSortData(arr);
            setPage(1);
            setCurrentSelected(null);
          }}
          resetData={() => {
            setSortData(data);
            setPage(1);
            setCurrentSelected(null);
          }}
          page={page}
          setPage={setPage}
        />
      )}
      <TableContainer>
        <thead>
          <tr>
            {checkbox && (
              <th style={{ textAlign: "center" }}>
                <input type="checkbox" onChange={checkAll} />
              </th>
            )}
            {index && (
              <th width={50} style={{ textAlign: "center", padding: 0 }}>
                No.
              </th>
            )}
            {headers &&
              headers.map((header, num) => {
                if (header.noRender) return null;
                return (
                  <ToggleTableHeader
                    header={header}
                    index={num}
                    key={num}
                    onClick={changeSortData}
                    currentSelected={currentSelected}
                    width={header.width}
                  />
                );
              })}
          </tr>
        </thead>
        <tbody>
          {viewData.map((item, dataIndex) => (
            <tr
              key={data.length - perPage * (page - 1) - dataIndex}
              style={{
                background:
                  selectedArr.filter(sel => sel.checkIndex === item.checkIndex)
                    .length > 0
                    ? "#e7f5ff"
                    : "white"
              }}
            >
              {checkbox && (
                <td width={30} style={{ textAlign: "center", padding: 0 }}>
                  <input
                    className="row-check"
                    type="checkbox"
                    defaultChecked={
                      selectedArr.filter(
                        sel => sel.checkIndex === item.checkIndex
                      ).length > 0
                    }
                    onChange={e => {
                      const { checked } = e.target;
                      checked
                        ? setSelectedArr([...selectedArr, item])
                        : setSelectedArr(
                            selectedArr.filter(
                              sel => sel.checkIndex !== item.checkIndex
                            )
                          );
                    }}
                  />
                </td>
              )}
              {index && (
                <td style={{ textAlign: "center", padding: 0 }}>
                  {sortData.length - perPage * (page - 1) - dataIndex}
                </td>
              )}
              {headers.map((header, headerIndex) => {
                if (header.noRender) return null;
                if (header.render) {
                  return (
                    <td style={{ textAlign: header.align }} key={headerIndex}>
                      {header.render(item)}
                    </td>
                  );
                }

                if (typeof item[header.value] === "object") {
                  console.error(`${headerIndex}번째 컬럼 타입 오류`);
                  return <td key={headerIndex}></td>;
                }

                return (
                  <td style={{ textAlign: header.align }} key={headerIndex}>
                    {item[header.value]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </TableContainer>

      {!notPagination && (
        <Pagination
          page={page}
          lastPage={LAST_PAGE}
          onClickPage={num => {
            setPage(num);
          }}
          onPrev={() => {
            page !== 1 && setPage(page - 1);
          }}
          onNext={() => {
            LAST_PAGE !== 0 && page !== LAST_PAGE && setPage(page + 1);
          }}
        />
      )}
    </div>
  );
};

export default Table;
