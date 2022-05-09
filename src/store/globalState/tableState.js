import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import { END_POINT, SERVE_STATUS, WAITING_STATUS, DOING_STATUS, CANCEL_STATUS } from "../../constants";
import { getLocalData } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { updateOrderItem } from "../../services/order";
import { socket } from '../../services/socket'

export const useTableState = () => {

    const [isTableOrderLoading, setIsTableOrderLoading] = useState(false);
    const [tableList, setTableList] = useState([]);
    const [tableListCheck, setTableListCheck] = useState([]);
    const [openTableData, setOpenTableData] = useState([]);
    const [tableOrders, setTableOrders] = useState([]);
    const [tableOrderItems, setTableOrderItems] = useState([]);
    const [selectedTable, setSelectedTable] = useState();
    const [orderItemForPrintBill, setorderItemForPrintBill] = useState([])

    const initialTableSocket = useMemo(
        () => async () => {
            let _userData = await getLocalData();
            socket.on(`TABLE:${_userData?.DATA?.storeId}`, (data) => {
                let _openTable = data.filter((table) => {
                    return table.isOpened && !table.isStaffConfirm
                })
                setOpenTableData(_openTable)
                setTableList(data)
                getTableOrders(selectedTable)
            });
            socket.on(`CHECK_OUT_ADMIN:${_userData?.DATA?.storeId}`, (data) => {
                getTableDataStore()
                Swal.fire({
                    icon: 'success',
                    title: "ມີການແຈ້ງເກັບເງີນ",
                    showConfirmButton: false,
                    timer: 10000
                })
            });
        },
        []
    );
    /**
    * Modify Order
    */
    useEffect(() => {
        setTableOrderItems(tableOrders)
    }, [tableOrders])

    const getTableDataStore = useMemo(
        () => async () => {
            let _userData = await getLocalData();
            const url = END_POINT + `/v3/codes?status=true&isCheckout=false&&storeId=${_userData?.DATA?.storeId}`;
            await fetch(url)
                .then(response => response.json())
                .then(response => {
                    if (response.message == "server error") return;
                    setTableList(response)
                    let _openTable = response.filter((table) => {
                        return table.isOpened && !table.isStaffConfirm
                    })
                    setOpenTableData(_openTable)
                })
        },
        []
    );
    const getTableDataStoreList = useMemo(
        () => async () => {
            let _userData = await getLocalData();
            const url = END_POINT + `/v3/codes?isCheckout=false&storeId=${_userData?.DATA?.storeId}&isDeleted=false`;
            await fetch(url)
                .then(response => response.json())
                .then(response => {
                    if (response.message == "server error") return;
                    setTableListCheck(response)
                })
        },
        []
    );
    /**
    * Get Table Orders
    */
    const getTableOrders = async (table) => {
        setIsTableOrderLoading(true)
        const url = END_POINT + `/v3/orders?code=${table?.code}`;
        let res = await fetch(url)
            .then(response => response.json())
            .then(response => {
                setTableOrders(response)
                setIsTableOrderLoading(false)
            })
        return res
    }
    /**
    * Select Table
    * @param {*} table 
    */
    const onSelectTable = async (table) => {
        setSelectedTable(table)
        await getTableOrders(table)
    }
    /**
     * ເປີດໂຕະ
     */
    const openTable = async () => {
        let resData = await axios
            .post(
                END_POINT + `/v3/admin/open-table`,
                {
                    "code": selectedTable?.code
                },
                {
                    headers: await getHeaders(),
                }
            )
        if (resData?.data?.length > 0) {
            let _tableList = [...tableList]
            let _newTable = _tableList.map((table) => {
                if (table?.code == selectedTable?.code) return {
                    ...table,
                    isOpened: true,
                    isStaffConfirm: true
                }
                else return table
            })
            let _openTable = _newTable.filter((table) => {
                return table.isOpened && !table.isStaffConfirm
            })
            setOpenTableData(_openTable)
            setTableList(resData?.data)
            setSelectedTable({
                ...selectedTable,
                isOpened: true,
                isStaffConfirm: true
            })
            await getTableOrders(selectedTable?.code)
            Swal.fire({
                icon: 'success',
                title: "ເປີດໂຕະສໍາເລັດແລ້ວ",
                showConfirmButton: false,
                timer: 1800
            })
        }
    }
    /**
    * ລີເຊັດຂໍ້ມູນໂຕະເວລາມີການອັບບເດດອໍເດີ
    */
    const resetTableOrder = () => {
        getTableOrders()
        getTableDataStore()
        setTableOrders([])
        setTimeout(() => { setSelectedTable() }, 100)
    }
    const onChangeMenuCheckbox = async (order) => {
        let _orderItemForPrint = []
        let _orderItems = [...tableOrderItems]
        let _newOrderItems = _orderItems.map((item) => {
            if (item._id == order._id) {
                return {
                    ...item,
                    isChecked: !item.isChecked
                }
            } else return item
        })
        for (let i = 0; i < _newOrderItems?.length; i++) {
            if (_newOrderItems[i]?.isChecked === true) _orderItemForPrint.push(_newOrderItems[i])
        }

        setorderItemForPrintBill(_orderItemForPrint)
        setTableOrderItems(_newOrderItems)
    };
    /**
    * ອັບເດດສະຖານະອໍເດີ
    */
    const handleUpdateTableOrderStatus = async (status, storeId) => {
        let _updateItems = tableOrderItems.filter((item) => item.isChecked).map((i) => {
            return {
                ...i,
                status,
                _id: i._id
            }
        })
        let _resOrderUpdate = await updateOrderItem(_updateItems, storeId);
        if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
            let _newOrderItem = tableOrderItems.map((item) => {
                if (item.isChecked) {
                    return {
                        ...item,
                        status,
                        isChecked: ![CANCEL_STATUS, SERVE_STATUS, WAITING_STATUS, DOING_STATUS].includes(status)
                    }
                }
                else return item
            });
            setTableOrderItems(_newOrderItem)
            Swal.fire({
                icon: 'success',
                title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
                showConfirmButton: false,
                timer: 10000
            })
        }
    };
    return {
        isTableOrderLoading,
        orderItemForPrintBill,
        tableList,
        tableListCheck,
        openTableData,
        tableOrders,
        tableOrderItems,
        selectedTable,
        setTableListCheck,
        setTableList,
        setSelectedTable,
        getTableOrders,
        getTableDataStoreList,
        openTable,
        getTableDataStore,
        onSelectTable,
        onChangeMenuCheckbox,
        handleUpdateTableOrderStatus,
        resetTableOrder,
        initialTableSocket
    };
};