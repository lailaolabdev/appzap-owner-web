import React, { useState, useEffect } from "react";
import { COLOR_APP } from "../../constants";
// import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import { getLocalData } from "../../constants/api";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import Loading from "../../components/Loading";
import Select from "react-select";
import { createBranchRelation } from "../../services/branchRelation";
import { getStores } from "../../services/store";
// import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// let limitData = 100;
export default function BranchCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { state } = useLocation();
  // console.log(state?.key);

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [value, setValue] = useState([
    {
      userId: "",
      password: "",
      storeId: "",
      storeName: "",
    },
  ]);
  const [stores, setStores] = useState([]);
  const [searchStore, setSearchStore] = useState([]);
  const [isPasswordType, setIsPasswordType] = useState(true);

  useEffect(() => {
    getSearchStore();
  }, []);

  const getSearchStore = () => {
    setIsLoadingStore(true);
    getStores(searchStore)
      .then((stores) => {
        setStores(stores);
        setIsLoadingStore(false);
      })
      .catch((err) => {
        setIsLoadingStore(false);
        console.error(err);
      });
  };

  // function
  const handleChanges = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const handleChangesNameStore = (e) => {
    setValue({ ...value, storeId: e.id, storeName: e.value });
  };

  const handleClickCreateBranch = async () => {
    if (!value?.userId && !value?.password && !value?.storeId) {
      errorAdd(`${t("field_required")}`);
      return;
    }
    try {
      setIsLoading(true);
      const { DATA, TOKEN } = await getLocalData();
      const _body = {
        userId: value?.userId,
        password: value?.password,
        storeId: value?.storeId,
        storeName: value?.storeName,
        mainUserId: DATA?._id,
        mainStoreId: DATA?.storeId,
      };
      await createBranchRelation(_body, TOKEN).then((data) => {
        if (data.error) {
          setIsLoading(false);
          errorAdd(`${t("save_fail")}`);

          if (data.error.response.data.branchExit) {
            setIsLoading(false);
            errorAdd(`${t("exit_branch")}`);
            return;
          }
        } else {
          setIsLoading(false);
          navigate("/branch");
          successAdd(`${t("save_success")}`);
        }
      });
    } catch (err) {
      setIsLoading(false);
      errorAdd(`${t("save_fail")}`);
      console.log(err);
      return;
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
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div
              style={{
                width: "calc(100% - 50%)",
                height: "calc(100%)",
                boxShadow: "0px 2px 8px 2px rgba(0,0,0,0.05)",
                borderBottom: "2px solid rgba(0,0,0,0.05)",
                borderRadius: 10,
                marginTop: "40px",
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
                  // marginBottom: "200px",
                  marginTop: "20px",
                }}
              >
                {isLoadingStore ? (
                  <Loading />
                ) : (
                  <>
                    <Form.Label>{t("search")}</Form.Label>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%",
                        margin: "10px 0",
                      }}
                    >
                      <Form.Control
                        value={searchStore}
                        placeholder={t("search")}
                        name="search"
                        onChange={(e) => setSearchStore(e.target.value)}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            getSearchStore();
                          }
                        }}
                      />

                      <Button onClick={() => getSearchStore()}>
                        {t("search")}
                      </Button>
                    </div>

                    <hr />
                    <Form.Label>{t("select_branch")}</Form.Label>
                    <Select
                      options={optionsBills}
                      isLoading={isLoadingStore}
                      isDisabled={!optionsBills[0]?.value}
                      placeholder={t("branch_select")}
                      name="name_branch"
                      onChange={handleChangesNameStore}
                    />
                  </>
                )}

                <Form.Label>{t("user")}</Form.Label>
                <Form.Control
                  placeholder={t("user")}
                  type="text"
                  name="userId"
                  onChange={handleChanges}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleClickCreateBranch();
                    }
                  }}
                />
                <Form.Label>{t("password")}</Form.Label>
                <div
                  style={{
                    border: "1px solid #ced4da",
                    width: "100%",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Form.Control
                    placeholder={t("password")}
                    type={isPasswordType ? "password" : "text"}
                    name="password"
                    onChange={handleChanges}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleClickCreateBranch();
                      }
                    }}
                  />
                  <FontAwesomeIcon
                    onClick={() => setIsPasswordType(!isPasswordType)}
                    style={{ float: "right", marginRight: 8 }}
                    icon={isPasswordType ? faEye : faEyeSlash}
                  />
                </div>

                <Button
                  style={{ width: "100%", height: 60, marginTop: 25 }}
                  onClick={() => handleClickCreateBranch()}
                  disabled={
                    !value?.userId ||
                    !value?.password ||
                    !value?.storeId ||
                    !value?.storeName
                  }
                >
                  {t("save")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
