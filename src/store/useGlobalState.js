import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import socketio from "socket.io-client";
import { END_POINT } from "../constants";
import { getLocalData } from "../constants/api";
import { SocketContext } from "../services/socket";
// import { makeApiRequest } from "../utils";

export const useGlobalState = () => {

    const socket = socketio.connect(END_POINT);

    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState();
    const [openTableData, setOpenTableData] = useState([]);
    const [orderItems, setOrderItems] = useState([]);


    const initialSocket = useMemo(
        () => async () => {
            let _userData = await getLocalData();
            setUserData(_userData)

            socket.on(`ORDER:${_userData?.DATA?.storeId}`, (data) => {
                setOrderItems(data)
            });
            socket.on(`TABLE:${_userData?.DATA?.storeId}`, (data) => {
                let _openTable = data.filter((table) => {
                    return table.isOpened && !table.staffConfirm
                })
                setOpenTableData(_openTable)
            });
        },
        []
    );





    const getTableDataStore = useMemo(
        () => async () => {
            const url = END_POINT + `/generates/?status=true&checkout=false&&storeId=6183ad0daef5b6d8dc5f2077`;
            await fetch(url)
                .then(response => response.json())
                .then(response => {
                    setTableData(response)
                    let _openTable = response.filter((table) => {
                        return table.isOpened && !table.staffConfirm
                    })
                    console.log({ response })
                    console.log({ _openTable })
                    setOpenTableData(_openTable)
                })
        },
        []
    );

    return {
        loading,
        tableData,
        openTableData,
        userData,
        getTableDataStore,
        initialSocket
    };
};