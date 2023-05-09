import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import { END_POINT_SEVER } from "../../constants/api";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker';
import { Modal, Button } from "react-bootstrap";


export default function SettingTheme() {

    const [selectColor, setSelectColor] = useState('')
    const [themeData, setThemeData] = useState('')

    const [themes, setThemes] = useState([])
    const [background, setBackground] = useState({
        backgroundCommon: '',
        backgroundPrimary: '',
        backgroundSecondary: '',
        colorPrimary: '',
        colorSecondary:'',
        colorDisabled:'',
        shadow:''
    });

    const [ id, setId]  = useState(null);

    const [themeSelected, setThemeSelected] = useState({})
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getThemeData()
    }, []);

    const getThemeData = async () => {
        try {
            const localStore = localStorage.getItem("storeDetail")
            if (!localStore) return
            const storeData = await JSON.parse(localStore)
            const id = storeData._id
            await axios.get(`http://localhost:7070/v3/theme/${id}`)
                .then((data) => {
                     setId(data.data.theme._id);
                    setThemeData(data.data.theme)  
                    setBackground({
                       ...data.data.theme
                    })
            })
     } catch (error) {
        console.log(error);
     }
    }

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

    const onSaveThemeSetting = async () => {
        try {
            const themes = {
                backgroundCommon: background.backgroundCommon,
                backgroundPrimary: background.backgroundPrimary,
                backgroundSecondary: background.backgroundSecondary,
                colorPrimary: background.colorPrimary,
                colorSecondary: background.colorSecondary,
                colorDisabled: background.colorDisabled,
                shadow:background.shadow
            }
             console.log(themes);
           
            await axios.put(`${END_POINT_SEVER}/v3/theme/${id}`, { ...themes })
                .then((data) => {
                    successAdd('ບັນທຶກສຳເລັດ')
                })

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
                    <button className="btn btn-primary d-flex justify-content-end" onClick={() => { onSaveThemeSetting(); }}>Save</button>
                    <div>
                        <div>
                            <p className="font-weight-bold" style={{ borderBottom: '1px solid black'}}>Background Color</p>
                            <div>
                                <div>
                                    <p style={{ margin: '0px', padding: '0px' }}>Choose Common Background</p>
                                </div>
                                <button class="btn btn-sm m-1"
                                    style={{
                                        border: '1px solid black', color: "white",
                                        background: background.backgroundCommon == '' ? themeData.backgroundCommon : background.backgroundCommon
                                    }}
                                    onClick={() => { setSelectColor('backgroundCommon'); handleShow() }}>
                                    Common
                                </button>
                            </div>
                            <div>
                                <div>
                                    <p style={{ margin: '0px', padding: '0px' }}>Choose Primary Background</p>
                                </div>
                                <button
                                    style={{border:'1px solid black', color: "white", background: background.backgroundPrimary == '' ?  themeData.backgroundPrimary : background.backgroundPrimary}}
                                    class="btn btn-sm m-1" onClick={() => { setSelectColor('backgroundPrimary'); handleShow() }}>
                                    Primary
                                </button>

                            </div>

                        </div>
                        <div>
                            <div>
                                <p style={{ margin: '0px', padding: '0px' }}>Choose Secondary Background</p>
                            </div>
                            <button
                                    style={{border:'1px solid black', color: "white", background: background.backgroundSecondary == '' ?  themeData.backgroundSecondary : background.backgroundSecondary}}
                                className="btn btn-sm m-1" onClick={() => { setSelectColor('backgroundSecondary'); handleShow() }}>
                                Secondary
                            </button>
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold',borderBottom: '1px solid black' }}>Color Font</p>
                            <div>
                                <div>
                                    <p
                                        style={{
                                            margin: '0px',
                                            padding: '0px',
                                        }}>Choose Font Color</p>
                                </div>
                                <button
                                    style={{border:'1px solid black', color: "white", background: background.colorPrimary == '' ?  themeData.colorPrimary : background.colorPrimary}}
                                    className="btn btn-sm btn-sm m-1" onClick={() => { setSelectColor('colorPrimary'); handleShow() }}>Primary</button>

                            </div>
                            <div>
                                <div>
                                    <p
                                        style={{
                                            margin: '0px',
                                            padding: '0px'
                                        }}>Choose Font Color</p>
                                </div>
                                <button
                                    style={{border:'1px solid black', color: "white", background: background.colorSecondary == '' ?  themeData.colorSecondary : background.colorSecondary}}
                                    className="btn btn-sm m-1" onClick={() => { setSelectColor('colorSecondary'); handleShow() }}>Secondary</button>
                            </div>
                            <div>
                                <div>
                                    <p style={{ margin: '0px', padding: '0px'}}>Choose Font Color</p>
                                </div>
                                <button className="btn btn-sm m-1"
                                    style={{ border: '1px solid black',color: "white", backgroundColor: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled }}
                                    onClick={() => { setSelectColor('colorDisabled'); handleShow() }}>Disabled</button>
                            </div>
                            <div>
                                <p className="font-weight-bold m-0 p-0" style={{ borderBottom: '1px solid black'}}>Box Shadow Color</p>
                                <div>
                                <div>

                                    <p style={{ margin:'0px', padding: '0px', }}>Choose boxShadow Color</p>
                                </div>
                                    <button
                                        className="btn btn-sm m-1"
                                    style={{border:'1px solid black', color: "white", background: background.shadow == '' ?  themeData.shadow : background.shadow}}
                                    onClick={() => { setSelectColor('shadow'); handleShow() }}>boxShadow</button>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div
                style={{
                    background: background.backgroundCommon == '' ? themeData.backgroundCommon : background.backgroundCommon,
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
                        background: background.backgroundPrimary == '' ? themeData.backgroundPrimary : background.backgroundPrimary,
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
                        <p style={{
                            color: background.colorPrimary == '' ? themeData.colorPrimary : background.colorPrimary
                        }}>{">> ກົດເພື່ອຮັບສ່ວນຫຼຸດ <<"}</p>
                        <p style={{
                            color: background.colorPrimary == '' ? themeData.colorPrimary : background.colorPrimary
                        }}><b>ເມນູພາຍໃນຮ້ານ</b></p>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: "15px",
                        marginRight: "15px"
                    }}>
                        <p style={{
                            color: background.colorPrimary == '' ? themeData.backgroundPrimary : background.colorPrimary
                        }}><b>ເມນູທີ່ແນະນຳ</b></p>
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
                                    color: background.colorSecondary == '' ? themeData.colorSecondary : background.colorSecondary,
                                    height: "30px",
                                    width: "175px",
                                    paddingLeft: 5,
                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    background: background.backgroundSecondary == '' ? themeData.backgroundSecondary : background.backgroundSecondary,
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,

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
                                    color: background.colorSecondary == '' ? themeData.colorSecondary : background.colorSecondary,

                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    background: background.backgroundSecondary == '' ? themeData.backgroundSecondary : background.backgroundSecondary,
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,

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
                            boxShadow:background.shadow == '' ? "3px 3px 5px "+themeData.shadow : "3px 3px 5px " + background.shadow
                        }}>
                            <div style={{
                                color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,
                            }}>Drink</div>
                            <div style={{
                                color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,
                            }}>All</div>
                            <div style={{
                                color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,
                            }}>Food</div>
                            <div style={{
                                color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,
                            }}>Cafe</div>
                            <div style={{
                                color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,
                            }}>Beer</div>
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
                                    color: background.colorSecondary == '' ? themeData.colorSecondary :background.colorSecondary,

                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    background: background.backgroundSecondary == '' ? themeData.backgroundSecondary : background.backgroundSecondary,
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,
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
                                    color: background.colorSecondary == '' ? themeData.colorSecondary : background.colorSecondary,
                                }}>
                                    <b>Menu Name</b>
                                </div>
                                <div style={{
                                    background: background.backgroundSecondary == '' ? themeData.backgroundSecondary : background.backgroundSecondary,
                                    height: "30px",
                                    width: "175px",
                                    borderBottomRightRadius: "5px",
                                    borderBottomLeftRadius: "5px",
                                    paddingLeft: 5,
                                    color: background.colorDisabled == '' ? themeData.colorDisabled : background.colorDisabled,


                                }}>
                                    100,000 kip
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ColorPicker
                        value={background?.[selectColor]}
                        onChange={(value) => {
                            setBackground(prev => ({ ...prev, [selectColor]: value }))
                        }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

