import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import socketio from "socket.io-client";
import { END_POINT } from "../../constants";
import { getLocalData } from "../../constants/api";
import { SocketContext } from "../../services/socket";

export const useTableState = () => {

    const socket = socketio.connect(END_POINT);

    const [tableData, setTableData] = useState();
    const [openTableData, setOpenTableData] = useState([]);



    const initialTableSocket = useMemo(
        () => async () => {
            let _userData = await getLocalData();

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
            let _userData = await getLocalData();
            const url = END_POINT + `/generates/?status=true&checkout=false&&storeId=${_userData?.DATA?.storeId}`;
            await fetch(url)
                .then(response => response.json())
                .then(response => {
                    if (response.message == "server error") return;

                    setTableData(response)
                    let _openTable = response.filter((table) => {
                        return table.isOpened && !table.staffConfirm
                    })
                    setOpenTableData(_openTable)
                })
        },
        []
    );


    return {
        tableData,
        openTableData,
        getTableDataStore,
        initialTableSocket
    };
};