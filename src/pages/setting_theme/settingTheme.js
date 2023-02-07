import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { END_POINT_SEVER } from "../../constants/api";


export default function SettingTheme() {

    const [themes, setThemes] = useState([])
    const [themeSelected, setThemeSelected] = useState([])

    useEffect(() => {
        getData();
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
            console.log(resetThemeSetting?.data)

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
            console.log("createManyTheme: ", createManyTheme.data)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="allBox">
            <div class="box1"
                style={{
                    margin: "20px",
                    padding: "20px",
                    backgroundColor: "#f5f2f0",
                    // width: "600px",
                    // height: "300px",
                    borderRadius: "20px"
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
    )
}

