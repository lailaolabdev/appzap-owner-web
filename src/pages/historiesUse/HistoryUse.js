import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router"
import { Nav } from 'react-bootstrap'
import moment from "moment";
import {
    TITLE_HEADER,
} from "../../constants/index";
import {
    END_POINT_SEVER
} from "../../constants/api";
import AnimationLoading from '../../constants/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmericanSignLanguageInterpreting, faCashRegister, faCertificate, faCoins, faEdit, faMagic, faPeopleArrows, faTable, faTableTennis } from '@fortawesome/free-solid-svg-icons';

export default function HistoryUse() {
    const { history, location, match } = useReactRouter()
    const [data, setData] = useState()
    const [filtterModele, setFiltterModele] = useState("checkBill")

    const _page = match?.params?.page;
    const LIMIT_PAGE = 300;
    const [pageNumber, setPageNumber] = useState(_page ?? 1);
    const [pageCountNumber, setPageCountNumber] = useState(10000);
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        _getdataHistories();
    }, [])
    useEffect(() => {
        _getdataHistories();
    }, [pageNumber])


    useEffect(() => {
        setPageNumber(1);
        _getdataHistories();
    }, [filtterModele])
    const _getdataHistories = async () => {
        setIsLoading(true)
        await fetch(END_POINT_SEVER + `/v3/logs/skip/${pageNumber - 1}/limit/${LIMIT_PAGE}?storeId=${match?.params?.id}&modele=${filtterModele}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => setData(json));
        setIsLoading(false)
    }

    const onNextPage = () => {
        setPageNumber(parseInt(pageNumber) != parseInt(pageCountNumber) ? parseInt(pageNumber) + 1 : parseInt(pageCountNumber))
    }

    const onBackPage = () => {
        setPageNumber(parseInt(pageNumber) != 1 ? parseInt(pageNumber) - 1 : 1)
    }


    return (
        <div style={{}}>
            {isLoading ? <AnimationLoading /> : <div />}
            <div className="col-sm-12">

                <Nav fill variant="tabs" defaultActiveKey="/home" style={{ fontWeight: "bold", backgroundColor: "#f8f8f8", border: "none", height: 60 }}>
                    <Nav.Item>
                        <Nav.Link eventKey="/canceled" style={{ color: "#FB6E3B", border: "none", height: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setFiltterModele("checkBill")}> <FontAwesomeIcon icon={faTable} ></FontAwesomeIcon> <div style={{ width: 8 }}></div> ຄິດໄລ່ເງິນ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/finance" style={{ color: "#FB6E3B", border: "none", height: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setFiltterModele("canceled")}><FontAwesomeIcon icon={faCoins} ></FontAwesomeIcon> <div style={{ width: 8 }}></div>  ຍົກເລີກອາຫານ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/print" style={{ color: "#FB6E3B", border: "none", height: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setFiltterModele("print")}><FontAwesomeIcon icon={faTable} ></FontAwesomeIcon> <div style={{ width: 8 }}></div>  ປີນເຕີ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/resetBill" style={{ color: "#FB6E3B", border: "none", height: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setFiltterModele("resetBill")}><FontAwesomeIcon icon={faCertificate} ></FontAwesomeIcon> <div style={{ width: 8 }}></div>  ແກ້ໄຂບີນ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="/transferTable" style={{ color: "#FB6E3B", border: "none", height: 60, display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => setFiltterModele("transferTable")}><FontAwesomeIcon icon={faPeopleArrows} ></FontAwesomeIcon> <div style={{ width: 8 }}></div>  ຍ້າຍລວມໂຕະ</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <div className="col-sm-12">
                <table className="table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ຊື່ຜູ້ຈັດການ</th>
                            <th scope="col">ສະຖານະ</th>
                            <th scope="col">ລາຍລະອຽດ</th>
                            <th scope="col">ວັນເວລາ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => {
                            return (
                                <tr>
                                    <td>{((pageNumber - 1) * LIMIT_PAGE) + index + 1}</td>
                                    <td>{item?.user}</td>
                                    <td style={{ color: item?.event === "INFO" ? "green" : "red" }}>{item?.event}</td>
                                    <td>{item?.eventDetail}</td>
                                    <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {pageCountNumber &&
                    <div className="row col-12 justify-content-center" style={{ marginBottom: 24 }}>
                        <p className="col-1" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => onBackPage()}><u>ກັບຄືນ  </u></p>
                        <p className="col-4 text-center">{" "}  ຫນ້າ {pageNumber} / {pageCountNumber}  {" "}</p>
                        <p className="col-1" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => onNextPage()}><u>  ຫນ້າຕໍ່ໄປ</u></p>
                    </div>
                }

            </div>
        </div>
    )
}
