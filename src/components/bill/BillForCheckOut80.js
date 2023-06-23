import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { moneyCurrency } from "../../helpers/index";
import moment from "moment";

export default function BillForCheckOut80({
  storeDetail,
  selectedTable,
  dataBill,
}) {
  const [total, setTotal] = useState();
  const [totalAfterDiscount, setTotalAfterDiscount] = useState();

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      _total += _data?.quantity * _data?.price;
    }
    if (dataBill?.discount > 0) {
      if (
        dataBill?.discountType == "LAK" ||
        dataBill?.discountType == "MONEY"
      ) {
        setTotalAfterDiscount(_total + dataBill?.discount);
      } else {
        const ddiscount = parseInt((_total * dataBill?.discount) / 100);
        setTotalAfterDiscount(_total - ddiscount);
      }
    } else {
      setTotalAfterDiscount(_total);
    }
    setTotal(_total);
  };

  // useEffect
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBill]);
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
                fontSize: 14,
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
          <div>
            ສ່ວນຫຼຸດ:
            {dataBill?.discount}{" "}
            {dataBill?.discountType == "MONEY" ||
            dataBill?.discountType == "LAK"
              ? "ກີບ"
              : "%"}
          </div>
        </div>
      </Price>
      <hr style={{ border: "1px solid #000" }} />
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <h6>ເງິນທີ່ຕ້ອງຊຳລະ {moneyCurrency(totalAfterDiscount)} ກີບ</h6>
      </Price>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <div>ຮັບເງີນມາ 0</div>
          <div>ເງີນທອນ 0</div>
        </div>
      </Price>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Img>
          <img
            src={`https://chart.googleapis.com/chart?cht=qr&chl=${storeDetail?.printer?.qr}&chs=500x500&choe=UTF-8`}
            style={{ wifth: "100%", height: "100%" }}
            alt=""
          />
        </Img>
      </div>
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
  /* maxwidth: 80mm; */
`;
const Img = styled.div`
  width: 200px;
  height: 200px;
  font-size: 14px;
  border: 2px dotted #000;
`;
const Order = styled.div`
  display: flex;
  flex-direction: column;
`;
