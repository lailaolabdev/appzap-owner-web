import React, { useRef, useState } from 'react';
import { Modal, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useReceiptStore } from '../../zustand/receiptStore';
import BillForCheckOut80 from '../bill/BillForCheckOut80';
import BillForChef80 from '../bill/BillForChef80';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { Switch } from "../../components/ui/Switch";
import axios from 'axios';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import printFlutter from '../../helpers/printFlutter';
import { base64ToBlob } from '../../helpers';
import { useStore } from "../../store";
import {
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
} from '../../constants/index';
// import { Label } from '../../components/ui/Label';

export default function PopUpReciept({ open, onClose }) {
  const { t } = useTranslation();
  const bill80Ref = useRef(null);
  const orderBillRef = useRef(null);
  const [printBillLoading, setPrintBillLoading] = useState(false);
  const { printerCounter, printers } = useStore();
  const [activeTab, setActiveTab] = useState('receipt');
  const {
    businessName,
    address,
    phone,
    email,
    footerText,
    showTaxInfo,
    showQRCode,
    showSizeRate,
    showPrice,
    showUserName,
    nameCodeSize,
    userName,
    setBusinessName,
    setAddress,
    setPhone,
    setEmail,
    setFooterText,
    setShowTaxInfo,
    setShowQRCode,
    setShowSizeRate,
    setShowPrice,
    setShowUserName,
    setNameCodeSize,
    setUserName,
  } = useReceiptStore();

  const handlePrintTest = async (isPrintBill, isOrderBill = false) => {
    try {
      setPrintBillLoading(true);
      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );
      if (!printerBillData) {
        await Swal.fire({
          icon: "error",
          title: `${t("no_printer_config")}`,
          showConfirmButton: false,
          timer: 1800,
        });
        return;
      }

      let dataImageForPrint;
      const refToUse = isOrderBill ? orderBillRef : bill80Ref;
      dataImageForPrint = await html2canvas(refToUse.current, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
      });

      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      } else if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      } else if (printerBillData?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("isdrawer", isPrintBill);
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", printerBillData?.width === "58mm" ? 58 : 80);

      await printFlutter(
        {
          drawer: true,
          paper: printerBillData?.width === "58mm" ? 400 : 500,
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: printerBillData?.width === "58mm" ? 400 : 580,
        },
        async () => {
          const response = await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data && response.data.message === "Success!") {
            await Swal.fire({
              icon: "success",
              title: t("print_success"),
              showConfirmButton: false,
              timer: 1800,
            });
          }
        }
      );
      setPrintBillLoading(false);
    } catch (err) {
      console.log("err printer", err);
      setPrintBillLoading(false);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return err;
    }
  };

  const handleToggleChange = (toggleType, checked) => {
    if (toggleType === 'showTaxInfo') {
      setShowTaxInfo(checked);
    } else if (toggleType === 'showQRCode') {
      setShowQRCode(checked);
    } else if (toggleType === 'showSizeRate') {
      setShowSizeRate(checked);
    } else if (toggleType === 'showPrice') {
      setShowPrice(checked);
    } else if (toggleType === 'showUserName') {
      setShowUserName(checked);
    }
  };

  const storeDetail = {
    name: businessName,
    address,
    phone,
    email,
    printer: {
      qr: showQRCode ? 'sample-qr-code' : null,
    },
    textForBill: footerText,
    isShowVatLabel: showTaxInfo,
    isShowSizeRate: showSizeRate,
    showPrice,
    nameCodeSize,
    showUserName,
    userName,
  };

  const dataBill = {
    orderId: [
      {
        _id: '1',
        name: 'Coffee Latte',
        name_en: 'Coffee Latte',
        quantity: 1,
        price: 42000,
        status: 'SERVED',
        options: [],
        totalOptionPrice: 0,
      },
      {
        _id: '2',
        name: 'ครัวซองต์',
        name_en: 'Croissant',
        quantity: 1,
        price: 28000,
        status: 'SERVED',
        options: [],
        totalOptionPrice: 0,
      },
      {
        _id: '3',
        name: 'ອາເມລິກາໂນ່',
        name_en: 'Americano',
        quantity: 1,
        price: 35000,
        status: 'SERVED',
        options: [],
        totalOptionPrice: 0,
      },
    ],
    tableId: { name: 'Preview' },
    code: '001234',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Sample data for order bill (kitchen format) - make it reactive
  const orderBillData = {
    _id: '1',
    name: 'มำลำ',
    name_en: 'Mam Lam',
    quantity: 1,
    price: 5000,
    status: 'WAITING',
    options: [{ name: 'ไผดาว', quantity: 1 }],
    totalOptionPrice: 0,
    tableId: { name: 'T6' },
    code: '03FS6M',
    note: '',
    deliveryCode: '',
    createdAt: new Date().toISOString(),
    createdBy: { firstname: showUserName ? userName : 'Chef' },
  };

  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Receipt Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="receipt" title="Receipt Settings">
            <Row className="d-flex justify-content-between">
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="p-2 border rounded mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      {t("Show Tax Information")}
                      <Switch
                        id="showTaxInfo"
                        checked={showTaxInfo}
                        onChange={(e) => handleToggleChange('showTaxInfo', e.target.checked)}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      {t("Show QR Code")}
                      <Switch
                        id="showQRCode"
                        checked={showQRCode}
                        onChange={(e) => handleToggleChange('showQRCode', e.target.checked)}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      {t("Show size rate")}
                      <Switch
                        id="showSizeRate"
                        checked={showSizeRate}
                        onChange={(e) => handleToggleChange('showSizeRate', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Footer Text</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                    />
                  </Form.Group>              
                </Form>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-center">
                <h5>Receipt Preview</h5>
                <div style={{ width: "80mm", padding: 10, }} ref={bill80Ref}>
                  <BillForCheckOut80
                    storeDetail={storeDetail}
                    dataBill={dataBill}
                    taxPercent={showTaxInfo ? 7 : 0}
                    totalBillBillForCheckOut80={105000}
                    language="en"
                  />
                </div>
                <div className="mt-3">
                  <p>
                    Print a test receipt based on the configuration above.
                    This will send a sample receipt to your default printer.
                  </p>
                  <button className="btn btn-primary" onClick={handlePrintTest} disabled={printBillLoading}>
                    {printBillLoading ? 'Printing...' : <><FontAwesomeIcon icon={faPrint} className="me-2" /> {t("Print Test Receipt")}</>}
                  </button>
                </div>
              </Col>
            </Row>
          </Tab>
          
          <Tab eventKey="orderBill" title="Order Bill Settings">
            <Row className="d-flex justify-content-between">
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Table Display Format</Form.Label>
                    <Form.Control
                      as="select"
                      value={nameCodeSize}
                      onChange={(e) => setNameCodeSize(e.target.value)}
                    >
                      <option value="small">Small - Simple table name</option>
                      <option value="medium">Medium - Table + Order code</option>
                      <option value="large">Large - Full header format</option>
                    </Form.Control>
                  </Form.Group>
                  
                  <div className="p-2 border rounded mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span>{t("Show Price")} <small className="text-muted">({showPrice ? 'ON' : 'OFF'})</small></span>
                      <Switch
                        id="showPrice"
                        checked={showPrice}
                        onChange={(e) => handleToggleChange('showPrice', e.target.checked)}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span>{t("Show User Name")} <small className="text-muted">({showUserName ? 'ON' : 'OFF'})</small></span>
                      <Switch
                        id="showUserName"
                        checked={showUserName}
                        onChange={(e) => handleToggleChange('showUserName', e.target.checked)}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{t("Show Order Time")} <small className="text-muted">(Always ON)</small></span>
                      <Switch
                        id="showOrderTime"
                        checked={true}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  </div>
                  
                  {showUserName && (
                    <Form.Group className="mb-3">
                      <Form.Label>Staff Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter staff name for kitchen orders"
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Kitchen Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Additional instructions for kitchen staff..."
                      disabled
                    />
                    <Form.Text className="text-muted">
                      This will show order-specific notes from customers
                    </Form.Text>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6} className="d-flex flex-column align-items-center">
                <h5>Order Bill Preview</h5>
                <div style={{ width: "80mm", padding: 10, }} ref={orderBillRef}>
                  <BillForChef80
                    selectedTable={orderBillData.tableId}
                    dataBill={dataBill}
                    val={orderBillData}
                    showPrice={showPrice}
                    showUserName={showUserName}
                    nameCodeSize={nameCodeSize}
                  />
                </div>
                <div className="mt-3">
                  <p>
                    Print a test order bill based on the configuration above.
                    This will send a sample order bill to your kitchen printer.
                  </p>
                  <button className="btn btn-primary" onClick={() => handlePrintTest(false, true)} disabled={printBillLoading}>
                    {printBillLoading ? 'Printing...' : <><FontAwesomeIcon icon={faPrint} className="me-2" /> {t("Print Test Order Bill")}</>}
                  </button>
                </div>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}