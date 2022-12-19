import styled from "styled-components";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getHeaders } from "../../services/auth";
import { moneyCurrency } from "../../helpers/index";
import moment from "moment";

import { useStore } from "../../store";

export default function BillForCheckOut58({
  storeDetail,
  selectedTable,
  dataBill,
  data,
}) {
  const [total, setTotal] = useState();

  const { callingCheckOut } = useStore();
  useEffect(() => {
    _calculateTotal();
  }, [dataBill]);

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      _total += _data?.quantity * _data?.price;
    }
    setTotal(_total);
  };

  return (
    <Container>
      <div style={{ textAlign: "center" }}>{storeDetail?.name}</div>
      <div style={{ textAlign: "center" }}>{selectedTable?.tableName}</div>
      <Price>
        <div style={{ textAlign: "left", fontSize: 12 }}>
          <div>
            ເບີໂທ:{" "}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.phone}</span>
          </div>
          <div>
            Whatapp:{" "}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.whatsapp}</span>
          </div>
          <div>
            ລະຫັດໂຕະ:{" "}
            <span style={{ fontWeight: "bold" }}>{dataBill?.code}</span>
          </div>
          <div>
            ວັນທີ:{" "}
            <span style={{ fontWeight: "bold" }}>
              {moment(dataBill?.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <Img>
          <img
            src={`https://chart.googleapis.com/chart?cht=qr&chl=${storeDetail?.printer?.qr}&chs=500x500&choe=UTF-8`}
            style={{ wifth: "100%", height: "100%" }}
          />
        </Img>
      </Price>
      <Name style={{ marginBottom: 10 }}>
        <div style={{ textAlign: "left" }}>ລາຍການ</div>
        <div style={{ textAlign: "center" }}>ຈຳນວນ</div>
        <div style={{ textAlign: "right" }}>ລາຄາ</div>
        <div style={{ textAlign: "right" }}>ລວມ</div>
      </Name>
      <Order>
        {dataBill?.orderId?.map((item, index) => {
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                fontSize: 12,
              }}
              key={index}
            >
              <div style={{ textAlign: "left" }}>{item?.name}</div>
              <div style={{ textAlign: "center" }}>{item?.quantity}</div>
              <div style={{ textAlign: "right" }}>
                {item?.price ? moneyCurrency(item?.price) : "-"}
              </div>
              <div style={{ textAlign: "right" }}>
                {item?.price
                  ? moneyCurrency(item?.price * item?.quantity)
                  : "-"}
              </div>
            </div>
          );
        })}
      </Order>
      <hr style={{ border: "1px solid #000" }} />
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <div>ລວມ: {moneyCurrency(total)} ກີບ</div>
          <div>ສ່ວນຫຼຸດ (ກີບ) 0</div>
        </div>
      </Price>
      <hr style={{ border: "1px solid #000" }} />
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <h6>ເງິນທີ່ຕ້ອງຊຳລະ {moneyCurrency(total)} ກີບ</h6>
      </Price>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <div>ຮັບເງີນມາ 0</div>
          <div>ເງີນທອນ 0</div>
        </div>
      </Price>
    </Container>
  );
}

const Name = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;
const Price = styled.div`
  display: flex;
`;
const Container = styled.div`
  margin: 10px;
  width: 100%;
  maxwidth: 58mm;
`;
const Img = styled.div`
  width: 90px;
  height: 90px;
`;
const Order = styled.div`
  display: flex;
  flex-direction: column;
`;
