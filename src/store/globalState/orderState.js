import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { END_POINT } from "../../constants";
import { getLocalData } from "../../constants/api";
import { socket } from '../../services/socket'

export const useOrderState = () => {

    const [userData, setUserData] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);


    const initialOrderSocket = useMemo(
        () => async () => {
            let _userData = await getLocalData();
            setUserData(_userData)

            socket.on(`ORDER:${_userData?.DATA?.storeId}`, (data) => {
                setOrderItems(data)
            });
        },
        []
    );



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
        userData,
        orderItems,
        getOrderItemsStore,
        initialOrderSocket
    };
};