import React, { useState, useEffect } from "react";
import { COLOR_APP } from "../../constants";
import styled from "styled-components";
import {
  Button,
  Form,
  Modal,
  Card,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { getLocalData } from "../../constants/api";

import { errorAdd, successAdd } from "../../helpers/sweetalert";
import Loading from "../../components/Loading";
import Select from "react-select";
import { createBranchRelation } from "../../services/branchRelation";
import { getStores } from "../../services/store";
import { useStore } from "../../store";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";

// let limitData = 100;

export default function BranchCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  // console.log(state?.key);

  // state
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    getStores()
      .then((stores) => {
        setStores(stores);
      })
      .catch((err) => console.error(err));
  }, []);

  // function
  const handleChanges = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const handleChangesNameStore = (e) => {
    setValue({ ...value, storeId: e.id, storeName: e.value });
  };

  // console.log("value", value);

  const handleClickCreateBranch = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      const _body = {
        userId: value?.userId,
        password: value?.password,
        storeId: value?.storeId,
        storeName: value?.storeName,
      };
      const data = await createBranchRelation(_body, TOKEN);
      if (data.error) {
        errorAdd(`${t("save_fail")}`);
        return;
      }
      navigate("/branch");
      successAdd(`${t("save_success")}`);
    } catch (err) {
      console.log(err);
    }
  };

  const optionsBills = stores.map((data) => {
    return {
      id: data?._id,
      value: data?.name,
      label: data?.name,
    };
  });

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "calc(100% - 50%)",
            height: "calc(100%)",
            boxShadow: "0px 2px 8px 2px rgba(0,0,0,0.05)",
            borderBottom: "2px solid rgba(0,0,0,0.05)",
            borderRadius: 10,
            marginTop: "15px",
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: "white",
              fontWeight: 700,
              textAlign: "center",
              backgroundColor: COLOR_APP,
              padding: 20,
            }}
          >
            {t("add_branch")}
          </p>
          <div
            style={{
              padding: "0 30px 30px 30px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              marginBottom: "200px",
              marginTop: "20px",
            }}
          >
            <Form.Label>{t("name_branch")}</Form.Label>
            <Select
              options={optionsBills}
              placeholder={t("name_branch")}
              name="name_branch"
              onChange={handleChangesNameStore}
            />

            <Form.Label>{t("user")}</Form.Label>
            <Form.Control
              placeholder={t("user")}
              type="text"
              name="userId"
              onChange={handleChanges}
            />
            <Form.Label>{t("password")}</Form.Label>
            <Form.Control
              placeholder={t("password")}
              type="text"
              name="password"
              onChange={handleChanges}
            />

            <Button
              style={{ width: "100%", height: 60, marginTop: 25 }}
              onClick={() => handleClickCreateBranch()}
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const BoxInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 5px;

  .debt-input {
    width: calc(100% - 23%);
  }
  .debt-btn-group {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .debt-input {
      width: calc(100% - 40%);
    }
  }
`;
