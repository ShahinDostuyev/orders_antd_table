import React, { useRef, useState } from "react";
import { axiosBase } from "../axios/AxiosBase";
import { Table, Input, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import './DelayedRow.css';

import Moment from "moment";

function OrdersTable() {
  const [orders, setorders] = useState([]);

  axiosBase
    .get("")
    .then((response) => {
      setorders(response.data);
    })
    .catch((error) => {
      console.log("Error happened during getting data: ", error);
    });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const getRowClassName = (record) => {
    if (record.shippedDate > record.requiredDate) {
      console.log("delayed");
      return 'delayed-row';
    }
    return '';
  };
  const columns = [
    {
      key: "customerId",
      title: "Customer id",
      dataIndex: "customerId",
      ...getColumnSearchProps('customerId'),
      
    },

    {
      key: "freight",
      title: "freight",
      dataIndex: "freight",
      sorter: (a, b) => a.freight - b.freight,
    },
    {
      key: "city",
      title: "City",
      dataIndex: ["shipAddress", "city"],
    },
    {
      key: "country",
      title: "Country",
      dataIndex: ["shipAddress", "country"],
    },
    {
      key: "orderDate",
      title: "Date of order",
      dataIndex: "orderDate",
      render: (record) => {
        return (
          <div>
            <p>{Moment(record).format("MMM Do YY")}</p>
          </div>
        );
      },
    },
    {
      key: "requiredDate",
      title: "Required date",
      dataIndex: "requiredDate",
      render: (record) => {
        return (
          <div>
            <p>{Moment(record).format("MMM Do YY")}</p>
          </div>
        );
      },
    },
    {
      key: "shippedDate",
      title: "Date of shipping",
      dataIndex: "shippedDate",
      render: (record) => {
        return (
          <div>
            <p>{Moment(record).format("MMM Do YY")}</p>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table dataSource={orders} columns={columns} pagination={true} rowClassName={getRowClassName} />
    </>
  );
}

export default OrdersTable;
