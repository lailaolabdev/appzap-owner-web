import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import Swal from 'sweetalert2'
import { END_POINT } from "../../constants";
import { getLocalData } from "../../constants/api";
import { updateOrderItem } from "../../services/order";
import { socket } from '../../services/socket'

export const useOrderState = () => {

    const [userData, setUserData] = useState()
    const [orderLoading, setOrderLoading] = useState(true);
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
        await setOrderLoading(true);
        let _userData = await getLocalData();
        await fetch(END_POINT + `/orderItems?status=${status}&&storeId=${_userData?.DATA?.storeId}`, {
            method: "GET",
        }).then(response => response.json())
            .then(json => {
                console.log({json})
                setOrderLoading(false)
                setOrderItems(json)
            });
    }


  const handleUpdateOrderStatus = async (status,storeId) => {
    let _updateItems = orderItems.filter((item) => item.isChecked).map((i) => {
      return {
        ...i,
        status,
        id: i._id
      }
    })
    let _resOrderUpdate = await updateOrderItem(_updateItems,storeId);
    if(_resOrderUpdate?.data?.message=="UPADTE_ORDER_ITEM_SECCESS"){
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      setOrderItems(_newOrderItem)
      Swal.fire({
       icon: 'success',
       title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
       showConfirmButton: false,
       timer: 10000
     })
   }
  };


  const handleCheckbox = async (order) => {
    let _orderItems = [...orderItems]
    let _newOrderItems = _orderItems.map((item) => {
      if (item._id == order._id) {
        return {
          ...item,
          isChecked: !item.isChecked
        }
      } else return item
    })

    setOrderItems(_newOrderItems)
  };


  /**
   * ເລືອກທຸກອໍເດີ
   */
   const checkAllOrders = (item) => {
    let _orderItems = [...orderItems]
    let _newOrderItems;
    if (item?.target?.checked) {
      _newOrderItems = _orderItems.map((item) => {
        return {
          ...item,
          isChecked: true
        }
      })
    } else {
      _newOrderItems = _orderItems.map((item) => {
        return {
          ...item,
          isChecked: false
        }
      }) 
    }
    setOrderItems(_newOrderItems)
  }

    return {
        orderLoading,
        userData,
        orderItems,
        getOrderItemsStore,
        handleUpdateOrderStatus,
        handleCheckbox,
        checkAllOrders,
        initialOrderSocket
    };
};