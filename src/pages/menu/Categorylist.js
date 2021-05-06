import React from 'react'
import { Formik } from 'formik';
import axios from 'axios';
import { END_POINT, BODY, COLOR_APP, URL_PHOTO_AW3 } from '../../constants'
import NavBar from './utils/NavBar'
import {
    Button
} from "react-bootstrap";
export default function Categorylist() {
    return (
        <div style={BODY}>
            <div>
                <NavBar />
            </div>
            <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
                <div className="col-sm-12 text-right">
                    <Button className="col-sm-2" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}>ເພີ່ມປະເພດອາຫານ</Button>{' '}
                </div>
                <div style={{ height: 20 }}></div>
                <div>
                    <div className="col-sm-12">
                        <table class="table table-hover">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ຊື່ປະເພດອາຫານ</th>
                                    <th scope="col">ໝາຍເຫດ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {userData?.users?.map((data, index) => {
                                    return (
                                        <tr onClick={() => _userDetail(data?._id)}>
                                            <th scope="row">{index + 1 + parseInt(_limit) * parseInt(_page - 1)}</th>
                                            <td>
                                                {data?.image ? (
                                                    <center>
                                                        <Image src={URL_PHOTO_AW3 + data?.image} alt="AeonIcon" width="150" height="150" style={{
                                                            height: 50,
                                                            width: 50,
                                                            borderRadius: '50%',
                                                        }} />
                                                    </center>
                                                ) : (<center>
                                                    <Image src={profileImage} alt="AeonIcon" width="150" height="150" style={{
                                                        height: 50,
                                                        width: 50,
                                                        borderRadius: '50%',
                                                    }} />
                                                </center>)}
                                            </td>
                                            <td>{data?.firstname}</td>
                                            <td>{data?.lastname}</td>
                                            <td>{STATUS_USERS(data?.role)}</td>
                                            <td>{data?.phone}</td>
                                        </tr>
                                    )
                                })} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
