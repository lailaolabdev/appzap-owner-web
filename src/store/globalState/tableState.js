import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import socketio from "socket.io-client";
import axios from "axios";
import Swal from 'sweetalert2'
import { END_POINT } from "../../constants";
import { getLocalData } from "../../constants/api";
import { SocketContext } from "../../services/socket";
import { getHeaders } from "../../services/auth";

export const useTableState = () => {

    const socket = socketio.connect(END_POINT);

    const [isTableOrderLoading, setIsTableOrderLoading] = useState(false);
    const [tableList, setTableList] = useState([]);
    const [openTableData, setOpenTableData] = useState([]);
    const [tableOrders, setTableOrders] = useState([]);
    const [selectedTable, setSelectedTable] = useState();



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

                    setTableList(response)
                    let _openTable = response.filter((table) => {
                        return table.isOpened && !table.staffConfirm
                    })
                    setOpenTableData(_openTable)
                })
        },
        []
    );

    /**
  * Get Table Orders
  */
    const getTableOrders = async (table) => {
        setIsTableOrderLoading(true)
        const url = END_POINT + `/orders?code=${table?.code}`;
        let res = await fetch(url)
            .then(response => response.json())
            .then(response => {
                console.log({response})
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
    await axios
      .put(
        END_POINT + `/updateGenerates/${selectedTable?.code}`,
        {
          isOpened: true,
          staffConfirm: true
        },
        {
          headers: await getHeaders(),
        }
      ).then(async function (response) {
        //update Table
        let _tableList = [...tableList]
        let _newTable = _tableList.map((table) => {
          if (table?.code == selectedTable?.code) return {
            ...table,
            isOpened: true,
            staffConfirm: true
          }
          else return table
        })
        setTableList(_newTable)
        setSelectedTable({
          ...selectedTable,
          isOpened: true,
          staffConfirm: true
        })
        Swal.fire({
          icon: 'success',
          title: "ເປີດໂຕະສໍາເລັດແລ້ວ",
          showConfirmButton: false,
          timer: 1800
        })
      })
      .catch(function (error) {
        Swal.fire({
            icon: 'erroe',
            title: "ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ",
            showConfirmButton: false,
            timer: 1800
          })
      });
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



    return {
        isTableOrderLoading,
        tableList,
        openTableData,
        tableOrders,
        selectedTable,
        getTableOrders,
        openTable,
        getTableDataStore,
        onSelectTable,
        resetTableOrder,
        initialTableSocket
    };
};