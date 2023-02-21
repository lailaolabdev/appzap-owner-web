import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { END_POINT_SEVER } from "../../constants/api";



export default function SettingTheme() {

    const [themes, setThemes] = useState([])
    const [storeTheme, setStoreTheme] = useState({})
    const [themeSelected, setThemeSelected] = useState([])
    const [backgroundHeaderColor, setBackgroundHeaderColor] = useState({});
    const [backgroundBodeColor, setBackgroundBodyColor] = useState({});
    const [backgroundFooterColor, setBackgroundFooterColor] = useState({});
    const [frontHeaderColor, setFrontHeaderColor] = useState({});
    const [frontBodyColor, setFrontBodyColor] = useState({});
    const [frontFooterColor, setFrontFooterColor] = useState({});

    useEffect(() => {
        getData();
        getStoreTheme();
    }, []);

    const getData = async () => {
        try {
            var config = {
                method: 'get',
                url: `${END_POINT_SEVER}/v3/theme`,
            };
            let themeData = await axios(config)
            if (themeData?.data?.themes) {
                let groupCategory = await _.groupBy(themeData?.data?.themes, 'category');
                let _themeData = []
                for (let [category, valuesCategory] of Object.entries(groupCategory)) {
                    let groupType = await _.groupBy(valuesCategory, 'type');
                    let _typeData = []
                    for (let [type, valuesType] of Object.entries(groupType)) {
                        _typeData.push({
                            type,
                            typeValues: valuesType
                        })
                    }
                    _themeData.push({
                        category: category,
                        categoryData: _typeData
                    })
                }
                setThemes(_themeData)
            }
        } catch (error) {
            console.log(error)
        }
    };
    const getStoreTheme = async () => {
        try {
            var getTheme = {
                method: 'get',
                url: `${END_POINT_SEVER}/v3/store-theme?storeId=61d8019f9d14fc92d015ee8e`
            };
            let storeTheme = await axios(getTheme)
            // const _themesData = await storeTheme.json()
            console.log('storeTheme', storeTheme)
            setStoreTheme(storeTheme?.data?.storeThemes ?? {})

            // Background Header Color
            const _backgroundHeaderColor = await storeTheme?.data?.storeThemes?.filter(
                (storeTheme) => storeTheme?.data?.storeThemes?.groupCategory ==
                    "COLOR" && storeTheme?.data?.storeThemes?.groupType == "BACKGROUND_HEADER")
                    console.log("backgroundHeaderColor",backgroundHeaderColor)
            if (_backgroundHeaderColor.length > 0)
                setBackgroundHeaderColor(_backgroundHeaderColor[_backgroundHeaderColor.length - 1]);
                
        } catch (err) {
            console.log(err)
        }
    }

    const onSeleteTheme = async (data) => {
        try {
            let _themeSelected = [...themeSelected]
            _.remove(_themeSelected, function (them) {
                return them.category == data.category && them.type == data.type;
            })
            if (_themeSelected.length > 0) setThemeSelected([..._themeSelected, data])
            else setThemeSelected([data])
        } catch (error) {
            console.log(error)
        }
    }

    const onSaveThemeSetting = async () => {
        try {
            const localStore = localStorage.getItem("storeDetail")
            if (!localStore) return
            const storeData = await JSON.parse(localStore)

            var configResetTheme = {
                method: 'delete',
                url: `${END_POINT_SEVER}/v3/store-theme/delete-many/${storeData._id}`,
                headers: {}
            };
            const resetThemeSetting = await axios(configResetTheme)

            let _createData = []
            for (var i = 0; i < themeSelected.length; i++) {
                _createData.push({
                    storeId: storeData._id,
                    themeId: themeSelected[i]._id
                })
            }

            var data = JSON.stringify(_createData);
            var config = {
                method: 'post',
                url: `${END_POINT_SEVER}/v3/store-theme/create-many`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const createManyTheme = await axios(config)
            console.log("createManyTheme", createManyTheme)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: 350 }}>
            <div className="allBox">
                <div class="box1"
                    style={{
                        margin: "40px",
                        padding: "20px",
                        backgroundColor: "#f5f2f0",
                        borderRadius: "20px",
                    }}
                >
                    <button onClick={() => onSaveThemeSetting()}>Save</button>
                    <p>{themes.map((theme, index) => {
                        return (
                            <div key={index} style={{ marginTop: 20 }}>
                                <div><b>{theme?.category ?? "-"}</b></div>
                                {theme?.categoryData?.map((category, index1) => {
                                    return (
                                        <div key={index1}>
                                            <div><u>{category?.type ?? "-"}</u></div>
                                            {category?.typeValues?.map((type, index2) => {
                                                let _checkThem = themeSelected?.filter(_them => _them._id == type?._id)
                                                return (
                                                    <div key={index2} onClick={() => onSeleteTheme(type)}>
                                                        {_checkThem.length > 0 ? <FontAwesomeIcon icon={faCheck} color="green" /> : <FontAwesomeIcon icon={faCheck} color="#c8c9c7" />}{" "}
                                                        {theme?.category == "COLOR" &&
                                                            <input type="color" disabled value={type?.value} />}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}</p>
                </div>
            </div>
            <div
                style={{
                    backgroundColor: backgroundHeaderColor?.storeTheme ? { backgroundColor: backgroundHeaderColor?.storeTheme?.value } : "#FB6E3B",
                    width: "390px",
                    height: "840px",
                    margin: "40px",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    borderWidth: 1,
                    borderColor: "#000",
                    borderStyle: "solid"
                }}>
                <div style={{
                    height: "10%",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "40px",
                    marginLeft: "15px"
                }}>
                    <img src="https://s3.ap-southeast-1.amazonaws.com/policy.appzap.la/4Asset+1%404x.png" width={70} height={70} />
                    <p style={{ color: "white", marginTop: "20px", marginLeft: "10px" }}><b>Restaurant Name</b></p>
                </div>
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        width: "100%",
                        height: "100%",
                        borderTopRightRadius: "60px",
                        borderTopLeftRadius: "60px",
                        borderBottomLeftRadius: "6px",
                        borderBottomRightRadius: "6px",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center"
                    }}>
                        <p style={{ color: "#FB6E3B", marginTop: "15px" }}>{">> ກົດເພື່ອຮັບສ່ວນຫຼຸດ <<"}</p>
                        <p style={{ color: "#FB6E3B" }}><b>ເມນູພາຍໃນຮ້ານ</b></p>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: "15px",
                        marginRight: "15px"
                    }}>
                        <p style={{ color: "#000000" }}><b>ເມນູທີ່ແນະນຳ</b></p>
                        <p style={{ color: "#0c69f5" }}>{"ທັງໝົດ >>"}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginLeft: "15px",
                            marginRight: "15px"
                        }}>
                            <div style={{
                                backgroundColor: "blue",
                                width: "175px",
                                height: "200px",
                                marginRight: "10px",
                                borderRadius: "5px"
                            }}>
                                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sausages-and-sauerkraut1-1658681202.jpg" width={"175px"} height={"180px"}
                                    style={{
                                        borderTopRightRadius: "5px",
                                        borderTopLeftRadius: "5px"
                                    }} />
                                <div style={{
                                    backgroundColor: "#f7eee9",
                                    height: "30px",
                                    width: "175px",
                                    paddingLeft: 5,
                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    backgroundColor: "#FB6E3B",
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: "white"
                                }}>
                                    100,000 kip
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: "blue",
                                width: "175px",
                                height: "200px",
                                marginRight: "10px",
                                borderRadius: "5px"
                            }}>
                                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sausages-and-sauerkraut1-1658681202.jpg" width={"175px"} height={"180px"}
                                    style={{
                                        borderTopRightRadius: "5px",
                                        borderTopLeftRadius: "5px"
                                    }} />
                                <div style={{
                                    backgroundColor: "#f7eee9",
                                    height: "30px",
                                    width: "175px",
                                    paddingLeft: 5,
                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    backgroundColor: "#FB6E3B",
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: "white"
                                }}>
                                    100,000 kip
                                </div>
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 50,
                            padding: 10,
                            boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"
                        }}>
                            <div style={{ color: "#FB6E3B" }}>Drink</div>
                            <div style={{ color: "#FB6E3B" }}>All</div>
                            <div style={{ color: "#FB6E3B" }}>Food</div>
                            <div style={{ color: "#FB6E3B" }}>Cafe</div>
                            <div style={{ color: "#FB6E3B" }}>Beer</div>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginLeft: "15px",
                            marginRight: "15px",
                            marginTop: -20
                        }}>
                            <div style={{
                                backgroundColor: "blue",
                                width: "175px",
                                marginRight: "10px",
                                borderRadius: "5px"
                            }}>
                                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sausages-and-sauerkraut1-1658681202.jpg" width={"175px"} height={"180px"}
                                    style={{
                                        borderTopRightRadius: "5px",
                                        borderTopLeftRadius: "5px"
                                    }} />
                                <div style={{
                                    backgroundColor: "#f7eee9",
                                    height: "30px",
                                    width: "175px",
                                    paddingLeft: 5,
                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    backgroundColor: "#FB6E3B",
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: "white"
                                }}>
                                    100,000 kip
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: "blue",
                                width: "175px",
                                height: "200px",
                                marginRight: "10px",
                                borderRadius: "5px"
                            }}>
                                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sausages-and-sauerkraut1-1658681202.jpg" width={"175px"} height={"180px"}
                                    style={{
                                        borderTopRightRadius: "5px",
                                        borderTopLeftRadius: "5px"
                                    }} />
                                <div style={{
                                    backgroundColor: "#f7eee9",
                                    height: "30px",
                                    width: "175px",
                                    paddingLeft: 5,
                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    backgroundColor: "#FB6E3B",
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: "white"
                                }}>
                                    100,000 kip
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

