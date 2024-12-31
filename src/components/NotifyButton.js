import { useState, useEffect, useRef } from "react";

import Axios from "axios";
import moment from "moment";
import { t } from "i18next";
import { FaBell } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";

import { COLOR_APP, COLOR_GRAY } from "../constants";
import { END_POINT_SEVER_BILL_ORDER } from "../constants/api";
import { useStore } from "../store";

import styles from "./NotifyButton.module.css";
import { useSoundState } from "../store/globalState/soundState";

import { useStoreStore } from "../zustand/storeStore";

const Badge = ({ count }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: -4,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "red",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 12,
      }}
    >
      {count}
    </div>
  );
};

const NotifyItem = ({ title, content, createdAt, item, onButtonClick }) => {
  const [hover, setHover] = useState(false);
  const [loadingItem, setLoadingItem] = useState({
    id: "",
    status: "",
    isLoading: false,
  });
  const {
    code = "",
    tableName = "",
    totalAmount = 0,
    paymentMethod = "",
    billId = "",
    detail = "",
    options = [],
  } = item.referenceId || {};

  const mapContent = {
    BANK_TRANSFER: (
      <div>
        <span>{"ໂຕະ "}</span>
        <span
          style={{
            color: COLOR_APP,
            fontWeight: 600,
          }}
        >{`${tableName} (${code}) `}</span>
        <span>{`ໄດ້ຈ່າຍເງິນແລ້ວຈຳນວນ `}</span>
        <span
          style={{
            color: COLOR_APP,
            fontWeight: 600,
          }}
        >{`₭${totalAmount?.toLocaleString()} `}</span>
        <span>{`ຜ່ານການໂອນ`}</span>
      </div>
    ),
    CASH: (
      <div>
        <span>{"ໂຕະ "}</span>
        <span
          style={{
            color: COLOR_APP,
            fontWeight: 600,
          }}
        >{`${tableName} (${code}) `}</span>
        <span>{`ເອີ້ນພະນັກງານເພື່ອເຊັກບິນ`}</span>
      </div>
    ),
    CALL_STAFF: (
      <div>
        <span>{"ໂຕະ "}</span>
        <span
          style={{
            color: COLOR_APP,
            fontWeight: 600,
          }}
        >{`${tableName} (${code}) `}</span>
        <span>{`ຕ້ອງການ `}</span>
        {options.length > 0 && (
          <span
            style={{
              color: COLOR_APP,
              fontWeight: 600,
            }}
          >{`${options.join(", ")} `}</span>
        )}
        {detail && <span>{`(${detail})`}</span>}
      </div>
    ),
  };

  useEffect(() => {
    const updateNotification = async () => {
      try {
        await Axios.put(
          `${END_POINT_SEVER_BILL_ORDER}/v4/pos/notifications/${item._id}`,
          {
            isRead: true,
          }
        );
      } catch (error) {
        console.error("NetworkError:", error);
      }
    };

    if (!item.isRead) {
      updateNotification();
    }
  }, [item]);

  const handleButtonClick = async (action) => {
    try {
      setLoadingItem({
        id: item.referenceId._id,
        status: action,
        isLoading: true,
      });
      const res = await Axios.put(
        `${END_POINT_SEVER_BILL_ORDER}/v3/call-staff/${item.referenceId._id}`,
        {
          status: action,
        }
      );

      if (res.status === 200) {
        onButtonClick();
      }
    } catch (error) {
      console.error("NetworkError:", error);
    } finally {
      setTimeout(() => {
        setLoadingItem({
          id: "",
          status: "",
          isLoading: false,
        });
      }, 3000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "4px 8px",
        cursor: "pointer",
        borderRadius: 6,
        backgroundColor: hover || !item.isRead ? "#f0f0f0" : "transparent",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ fontWeight: "bold", lineHeight: "24px" }}>{title}</div>
        <div
          className={styles.wrapWord}
          style={{
            width: "100%",
          }}
        >
          {item.type === "callToCheckout" && mapContent[paymentMethod]}
          {item.type === "callStaff" && mapContent["CALL_STAFF"]}
        </div>
        <div
          style={{
            fontSize: 14,
            color: billId?.isCheckout ? COLOR_GRAY : COLOR_APP,
          }}
        >
          {createdAt}
        </div>
        {item.type === "callStaff" && item.referenceId.status === "PENDING" && (
          <div
            style={{
              display: "flex",
              padding: "6px 0",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <button
              style={{
                backgroundColor: COLOR_APP,
                color: "white",
                fontSize: 14,
                padding: "4px 10px",
                borderRadius: 5,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              disabled={loadingItem.isLoading}
              onClick={(e) => {
                e.isPropagationStopped();
                handleButtonClick("CONFIRMED");
              }}
            >
              <Spinner
                animation="border"
                variant="light"
                size="sm"
                style={{
                  marginRight: 6,
                  display:
                    loadingItem.id === item.referenceId._id &&
                    loadingItem.status === "CONFIRMED"
                      ? "block"
                      : "none",
                }}
              />
              Confirm
            </button>
            {/* <button
              style={{
                border: `1px solid ${COLOR_APP}`,
                padding: "4px 10px",
                borderRadius: 5,
                backgroundColor: "white",
                color: COLOR_APP,
                fontSize: 14,
                marginLeft: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              disabled={loadingItem.isLoading}
              onClick={(e) => {
                e.isPropagationStopped();
                handleButtonClick("CANCELLED");
              }}
            >
              <Spinner
                animation="border"
                variant="primary"
                size="sm"
                style={{
                  marginRight: 6,
                  display:
                    loadingItem.id === item.referenceId._id &&
                    loadingItem.status === "CANCELLED"
                      ? "block"
                      : "none",
                }}
              />
              Cancel
            </button> */}
          </div>
        )}
      </div>
      {item.type === "callToCheckout" && (
        <div
          style={{
            width: "20px",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: COLOR_APP,

              display: billId?.isCheckout ? "none" : "block",
            }}
          ></div>
        </div>
      )}
      {item.type === "callStaff" && (
        <div
          style={{
            width: "20px",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: COLOR_APP,

              display: item.referenceId.status === "PENDING" ? "block" : "none",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export const NotifyButton = ({ setNotifyFilterToggle, notifyFilterToggle }) => {
  // Constants
  const filterList = ["all", "callToCheckout", "callStaff"];
  const defaultLimit = 10;
  const defaultLatestDays = 1;

  // State variables
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [dataTotalLength, setDataTotalLength] = useState(0);
  const [totalUnCheckCount, setTotalUnCheckCount] = useState({
    callToCheckout: 0,
    callStaff: 0,
    all: 0,
  });
  const [notifyLimit, setNotifyLimit] = useState(defaultLimit);

  // Hooks
  const { newNotify, setNewNotify } = useStore();
  const {
    storeDetail
  } = useStoreStore()

  const { setRunSound } = useSoundState();
  const ref = useRef(null);
  const scrollRef = useRef(null);

  // console.log("data", data);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  const fetchData = async (setLoadingState = true) => {
    try {
      if (setLoadingState) setLoading(true);
      const { _id: storeId } = storeDetail || {};
      const type =
        notifyFilterToggle === 0 ? "" : filterList[notifyFilterToggle];

      const res = await Axios.get(
        `${END_POINT_SEVER_BILL_ORDER}/v4/pos/notifications`,
        {
          params: {
            storeId,
            type,
            days: defaultLatestDays,
            Limit: notifyLimit,
          },
        }
      );
      setData(res.data.data);
      setTotalUnread(res.data.totalUnread);
      setTotalUnCheckCount({
        callToCheckout: res.data.callToCheckoutUnCheckCount,
        callStaff: res.data.callStaffUnCheckCount,
        all:
          (Number(res.data.callStaffUnCheckCount) || 0) +
          (Number(res.data.callToCheckoutUnCheckCount) || 0),
      });
      setDataTotalLength(res.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (setLoadingState) setLoading(false);
    }
  };

  const fetchDataWithoutLoading = () => fetchData(false);

  useEffect(() => {
    fetchData();
  }, [notifyFilterToggle]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      console.log("scroll to top");
    }
  }, [isShow]);

  useEffect(() => {
    if (newNotify) {
      setRunSound({ messageSound: true });
      fetchDataWithoutLoading();
      setNewNotify(null);
    }
  }, [newNotify, setNewNotify]);

  return (
    <div
      ref={ref}
      style={{
        marginRight: "30px",
        fontSize: 24,
        padding: 8,
        width: 36,
        height: 36,
        borderRadius: 110,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => setIsShow(!isShow)}
    >
      <FaBell color={`${COLOR_APP}`} />
      {totalUnCheckCount.all > 0 && <Badge count={totalUnCheckCount.all} />}
      {isShow && (
        <div
          className={styles.notifyContainer}
          style={{ "--content-color": COLOR_GRAY }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.notifyHeader}>
            <div
              className={styles.notifyTitle}
              style={{ "--primary-color": COLOR_APP }}
            >
              {t("notification")}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {filterList.map((item, index) => (
                <div
                  key={index}
                  className={styles.notifyButton}
                  style={{
                    "--primary-color":
                      notifyFilterToggle === index ? COLOR_APP : COLOR_GRAY,
                    borderBottom:
                      notifyFilterToggle === index
                        ? `2px solid ${COLOR_APP}`
                        : "none",
                  }}
                  onClick={() => {
                    setNotifyLimit(defaultLimit);
                    setNotifyFilterToggle(index);
                  }}
                >
                  {`${t(item)} `}
                  {totalUnCheckCount[item] > 0 &&
                    `(${totalUnCheckCount[item]})`}
                </div>
              ))}
            </div>
          </div>
          <div
            ref={scrollRef}
            className={styles.notifyContent}
            onScroll={async (event) => {
              const scrollTop = event.target.scrollTop;
              const scrollHeight = event.target.scrollHeight;
              const clientHeight = event.target.clientHeight;
              const scrollFromBottom = scrollHeight - scrollTop - clientHeight;
              if (scrollFromBottom < 50) {
                setNotifyLimit((prev) => prev + defaultLimit);
                await fetchDataWithoutLoading();
              }
            }}
          >
            {!loading ? (
              data.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <NotifyItem
                      key={index}
                      item={item}
                      content={item.message}
                      createdAt={moment(item.updatedAt).fromNow()}
                      onButtonClick={async () => {
                        await fetchDataWithoutLoading();
                      }}
                    />
                  ))}
                  {data.length < dataTotalLength && (
                    <div
                      style={{
                        width: "100%",
                      }}
                    >
                      <Spinner
                        animation="border"
                        variant="primary"
                        size="md"
                        style={{
                          display: "block",
                          margin: "16px auto",
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    paddingTop: 30,
                  }}
                >
                  <img src="/images/data-not-found.svg" alt="" width={120} />
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  paddingTop: 70,
                  position: "relative",
                }}
              >
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
