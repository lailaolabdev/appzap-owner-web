import React, { useState, useEffect } from 'react'

import { Modal, Button } from 'react-bootstrap';


function PopUpIsOpenMenu({
    showSetting,
    handleClose,
    detailMenu,
    _handOpenMenu,
    _handOpenMenuCounterApp,
    _handOpenMenuCustomerApp,
    _handOpenMenuShowStaff

}) {
    return (
        <div>
            <Modal show={showSetting} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title style={{ color: "#fb6e3b", fontWeight: "800" }}>ກຳນົດການສະແດງເມນູ: <q>{detailMenu && detailMenu?.data?.name}</q></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='menuSttingShow'>
                        <label>ເປີດສະແດງເຄົ້າເຕີ້</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={detailMenu?.data?.isShowCounterApp === "true"}
                                onClick={() => _handOpenMenuCounterApp(detailMenu?.data?._id, detailMenu?.data?.isShowCounterApp, detailMenu?.index)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='menuSttingShow'>
                        <label>ເປີດສະແດງລູກຄ້າ(ແອັບ)</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={detailMenu?.data?.isShowCustomerApp === "true"}
                                onClick={() => _handOpenMenuCustomerApp(detailMenu?.data?._id, detailMenu?.data?.isShowCustomerApp, detailMenu?.index)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='menuSttingShow'>
                        <label>ເປີດສະແດງລູກຄ້າ(ເວບ)</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={detailMenu?.data?.isShowCustomerWeb === "true"}
                                onClick={() => _handOpenMenu(detailMenu?.data?._id, detailMenu?.data?.isShowCustomerWeb, detailMenu?.index)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className='menuSttingShow'>
                        <label>ເປີດສະແດງພະນັກງານ</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={detailMenu?.data?.isShowStaff === "true"}
                                onClick={() => _handOpenMenuShowStaff(detailMenu?.data?._id, detailMenu?.data?.isShowStaff, detailMenu?.index)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ປິດອອກ
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default PopUpIsOpenMenu
