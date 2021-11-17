import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import socketio from "socket.io-client";
import { END_POINT } from "../constants";
import { getLocalData } from "../constants/api";
import { SocketContext } from "../services/socket";
// import { makeApiRequest } from "../utils";

export const useGlobalState = () => {

    const socket = socketio.connect(END_POINT);

    const [userData, setUserData] = useState()
    const [isLoading, setIsLoading] = useState(true);
    // const [tableData, setTableData] = useState();
    // const [openTableData, setOpenTableData] = useState([]);
    const [orderItems, setOrderItems] = useState([]);


    const initialSocket = useMemo(
        () => async () => {
            let _userData = await getLocalData();
            setUserData(_userData)

            // socket.on(`ORDER:${_userData?.DATA?.storeId}`, (data) => {
            //     setOrderItems(data)
            // });
            // socket.on(`TABLE:${_userData?.DATA?.storeId}`, (data) => {
            //     let _openTable = data.filter((table) => {
            //         return table.isOpened && !table.staffConfirm
            //     })
            //     setOpenTableData(_openTable)
            // });
        },
        []
    );


    // const getTableDataStore = useMemo(
    //     () => async () => {
    //         let _userData = await getLocalData();
    //         const url = END_POINT + `/generates/?status=true&checkout=false&&storeId=${_userData?.DATA?.storeId}`;
    //         await fetch(url)
    //             .then(response => response.json())
    //             .then(response => {
    //                 if(response.message =="server error")return;

    //                 setTableData(response)
    //                 let _openTable = response.filter((table) => {
    //                     return table.isOpened && !table.staffConfirm
    //                 })
    //                 setOpenTableData(_openTable)
    //             })
    //     },
    //     []
    // );


    const getOrderItemsStore = async (status) => {
        await setIsLoading(true);
        let _userData = await getLocalData();
        await fetch(END_POINT + `/orderItems?status=${status}&&storeId=${_userData?.DATA?.storeId}`, {
          method: "GET",
        }).then(response => response.json())
          .then(json => setOrderItems(json));
        await setIsLoading(false);
      }

    return {
        isLoading,
        // tableData,
        // openTableData,
        userData,
        orderItems,
        // getTableDataStore,
        getOrderItemsStore,
        initialSocket
    };
};