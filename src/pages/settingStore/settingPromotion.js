import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Image } from "react-bootstrap";
import {
  BODY,
  COLOR_APP,
  COLOR_APP_CANCEL,
  URL_PHOTO_AW3,
} from "../../constants";
import {PRESIGNED_URL} from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import { END_POINT_SEVER } from "../../constants/api";

import { successAdd, errorAdd, successDelete } from "../../helpers/sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function UserList() {
  const [isLoading, setIsLoading] = useState(false);
  const [promotion, setPromotion] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // data

  const [promoName, setPromoName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [status, setStatus] = useState('true');
  
  // upload photo
  const [namePhoto, setNamePhoto] = useState("");
  const [file, setFile] = useState();
  const [imageLoading, setImageLoading] = useState();


  useEffect(() => {
    _selectPromotion()
  },[])

  const handleUpload = async (event) => {
    setImageLoading("");
    try {
      setFile(event.target.files[0]);
      let fileData = event.target.files[0];
      const responseUrl = await axios({
        method: "post",
        url: PRESIGNED_URL,
        data: {
          name: event.target.files[0].type,
        },
      });
      setNamePhoto(responseUrl.data);
      // console.log(responseUrl.data);
      await axios({
        method: "put",
        url: responseUrl.data.url,
        data: fileData,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImageLoading(percentCompleted);
        },
      });


      
    } catch (error) {
      console.log(error);
    }
  };
  // lung jak upload leo pic ja ma so u nee
  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        style={{
          borderRadius: "50%",
          height: 200,
          width: 200,
        }}
      />
    );
  };
  // select promotion 
  const _selectPromotion = async () => {
    try {
      const storeDetail = localStorage.getItem("storeDetail")
      const store = JSON.parse(storeDetail);
      const token = JSON.parse(localStorage.getItem('@userKey'))
      console.log(store._id);
      setIsLoading(true);
        await axios({
        method: "get",
        url: `${END_POINT_SEVER}/v3/promotion/getManyPromo/${store._id}`,
        data: {...promotion},
      headers: {
        "Authorization": `AppZap ${token.accessToken}`
        },
      }).then((res) => {
        setPromotion(res.data);
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error);
    }
  }
  // create promotion
  const _createPromotion = async () => {
    try {
      const store = localStorage.getItem('storeDetail')
      const token = JSON.parse(localStorage.getItem('@userKey'))
      const storeId = JSON.parse(store)

    const promotion = {
      storeId:storeId._id,
      promoName, 
      qty:parseInt(quantity), 
      status,
      image:namePhoto?.params?.Key
      }
      await axios({
          method: "post",
          url: `${END_POINT_SEVER}/v3/promotion/create`,
          data: {...promotion},
        headers: {
          "Authorization": `AppZap ${token.accessToken}`
          },
        })
        .then((res) => {
          setPromoName('')
          setQuantity(0)
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
        handleClose();
        _selectPromotion()
      })

    } catch (error) {
      console.log(error);
      errorAdd('ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ')
    }
    
  };
  // ======>
  // detele menu
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  const _confirmeDelete = async () => { 
    try {
      const token = JSON.parse(localStorage.getItem('@userKey'))
      axios({
        method: "delete",
        url: `${END_POINT_SEVER}/v3/promotion/delete/${dateDelete.id}`,
      headers: {
        "Authorization": `AppZap ${token.accessToken}`
        },
      })
        .then((data) => {
          successDelete('ລືບຂໍ້ມູນສຳເລັດ')
          handleClose3();
          _selectPromotion()
        }).catch(() => {
        errorAdd('ລືບຂໍ້ມູນບໍ່ສຳເລັດ')
      })
    } catch (error) {
      console.log(error);
    }
  }
  // update
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [name, setName] = useState(null);
  const [statu, setStatu] = useState(null);
  const [quantitries, setQuantitries] = useState(null);
  const [images , setImages] = useState(null);
  const [proId, setProId] = useState(null);
  const [count, setCount] = useState(null);

  const handleShow2 = async (item) => {
    setName(item.promoName);
    setStatu(item.status);
    setImages(item.image);
    setQuantitries(item.quantity)
    setCount(item.count);
    setProId(item._id)
    setShow2(true);
  };
  const _updatePromotion = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@userKey'))
      const promotion = {
        name:name,
        qty: quantitries,
        state: statu,
        counts: count, 
        images:namePhoto?.params?.Key
      }

      await axios({
        method: "put",
        url: `${END_POINT_SEVER}/v3/promotion/update/${proId}`,
        data: { ...promotion },
        headers: {
          "Authorization": `AppZap ${token.accessToken}`
        },
      })
        .then((res) => {
          successAdd("ແກ້ໃຂຂໍ້ມູນສຳເລັດ");
          setShow2(false)
          _selectPromotion()
        })
        .catch(() => { 
          errorAdd('ແກ້ໃຂຂໍ້ມູນບໍ່ສຳເລັດ')
        })
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div>
      {isLoading ? (
        <AnimationLoading />
      ) : (
        <div>
          <div style={BODY}>
            <div className="row" style={{ padding: 30 }}>
              <div className="col-md-12" style={{ fontSize: "20px" }}>
                ຈຳນວນ promotion ( {promotion?.length} )
              </div>
            </div>
            <div style={{ paddingBottom: 20 }}>
              <div className="col-md-12">
                <button
                  type="button"
                  className="btn btn-app col-2 "
                  style={{
                    float: "right",
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                  }}
                  onClick={handleShow}
                >
                  ເພີ່ມ Promotion
                </button>
              </div>
            </div>
            <div style={{ height: 40 }}></div>
            <div>
              <div className="col-sm-12">
                <table className="table table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">ຮູບພາບ</th>
                      <th scope="col">ຊື່</th>
                      <th scope="col">ຈຳນວນ</th>
                      <th scope="col">ຈຳນວນທີ່ຖືກ</th>
                      <th scope="col">ສະຖານະ</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotion?.map((data, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            {index }
                          </th>
                          <td>
                            {data?.image ? (
                              <center>
                                <Image
                                  src={URL_PHOTO_AW3 + data?.image}
                                  alt=""
                                  width="150"
                                  height="150"
                                  style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: "50%",
                                  }}
                                />
                              </center>
                            ) : (
                              <center>
                                <Image
                                  // src={profileImage}
                                  alt=""
                                  width="150"
                                  height="150"
                                  style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: "50%",
                                  }}
                                />
                              </center>
                            )}
                          </td>
                          <td>{data?.promoName ? (<div>{data?.promoName}</div>) : (<div className="text-danger">
                            ບໍ່ມີຊື່
                          </div>)}</td>
                          <td>{data?.quantity}</td>
                          <td>{data?.count}</td>
                          {/* <td>{STATUS_USERS(data?.role)}</td> */}
                          <td>{data?.status == true ? (<div>ເປິດ</div>):(<div>ປີດ</div>)}</td>
                          <td>
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: COLOR_APP }}
                              onClick={() => handleShow2(data)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ marginLeft: 20, color: "red" }}
                              onClick={() =>
                                handleShow3(data?._id)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມ Promotion</Modal.Title>
        </Modal.Header>
            <form onSubmit={_createPromotion}>
              <Modal.Body>
                <div
                  className="col-sm-12 center"
                  style={{ textAlign: "center" }}
                >
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleUpload}
                    hidden
                  />
                  <label for="file-upload">
                    <div
                      style={{
                        backgroundColor: "#E4E4E4E4",
                        height: 200,
                        width: 200,
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      {file ? (
                        <ImageThumb image={file} />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            height: 200,
                            width: 200,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <p
                            style={{
                              color: "#fff",
                              fontSize: 80,
                              fontWeight: "bold",
                            }}
                          >
                            +
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                  {imageLoading ? (
                    <div className="progress" style={{ height: 20 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${imageLoading}%`,
                          backgroundColor: COLOR_APP,
                        }}
                        aria-valuenow={imageLoading}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {imageLoading}%
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: 20 }} />
                  )}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ Promotion</Form.Label>
                  <Form.Control
                    type="text"
                    name="ຊື່ Promotion"
                    value={promoName}
                    onChange={e=> setPromoName(e.target.value)}
                    // onBlur={handleBlur}
                    placeholder="ຊື່ Promotion..."
                    // isInvalid={errors.promoName}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນ</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={e=> setQuantity(e.target.value)}
                    // onBlur={handleBlur}
                    placeholder="ຈຳນວນ"
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ເລືອກສະຖານະ</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={status}
                    onChange={e=> setStatus(e.target.value)}
                    // onBlur={handleBlur}
                  >
                    <option value="true">ເປີດ</option>
                    <option value="false">ປິດ</option>
                  </Form.Control>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }}
                  onClick={handleClose}
                >
                  ຍົກເລີກ
                </Button>
                <Button
                  style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                  onClick={(e) => {_createPromotion()}}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
        
      </Modal>
      {/* update */}
      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
      <Modal.Header closeButton>
          <Modal.Title>ແກ້ໃຂ Promotion</Modal.Title>
        </Modal.Header>
            <form onSubmit={_createPromotion}>
              <Modal.Body>
                <div
                  className="col-sm-12 center"
                  style={{ textAlign: "center" }}
                >
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleUpload}
                    hidden
                  />
                  <label for="file-upload">
                    <div
                      style={{
                        backgroundColor: "#E4E4E4E4",
                        height: 200,
                        width: 200,
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      {file ? (
                        <ImageThumb image={file} />
                      ) : (
                        <center>
                        <Image
                          src={URL_PHOTO_AW3 + images}
                          alt=""
                          width="150"
                          height="150"
                          style={{
                            height: 200,
                            width: 200,
                            borderRadius: "10%",
                          }}
                        />
                      </center>
                      )}
                    </div>
                  </label>
                  {imageLoading ? (
                    <div className="progress" style={{ height: 20 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${imageLoading}%`,
                          backgroundColor: COLOR_APP,
                        }}
                        aria-valuenow={imageLoading}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {imageLoading}%
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: 20 }} />
                  )}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ Promotion</Form.Label>
                  <Form.Control
                    type="text"
                    name="ຊື່ Promotion"
                    value={name}
                    onChange={e=> setName(e.target.value)}
                    placeholder="ຊື່ Promotion..."
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນ</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={quantitries}
                    onChange={e=> setQuantitries(e.target.value)}
                    placeholder="ຈຳນວນ"
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນທີ່ຖືກ</Form.Label>
                  <Form.Control
                    type="number"
                    name="count"
                    value={count}
                    onChange={e=> setCount(e.target.value)}
                    placeholder="ຈຳນວນ"
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ເລືອກສະຖານະ</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={statu}
                    onChange={e=> setStatu(e.target.value)}
                  >
                    <option value="true">ເປີດ</option>
                    <option value="false">ປິດ</option>
                  </Form.Control>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }}
              onClick={e => { handleClose2() }}
                >
                  ຍົກເລີກ
                </Button>
                <Button
                  style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                  onClick={(e) => {_updatePromotion()}}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
      </Modal>

      {/* ===== delete */}
      <Modal show={show3} onHide={handleClose3}>
        {/* <Modal.Header closeButton></Modal.Header> */}
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div style={{fontSize:"30px"}}>ທ່ານຕ້ອງການລົບຂໍ້ມູນ ແທ້ ຫຼື ບໍ່ ? </div>
            <div style={{ color: "red" }}>{dateDelete?.name}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            ຍົກເລີກ
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={(e) => {_confirmeDelete()}}
          >
            ຢືນຢັນການລົບ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
