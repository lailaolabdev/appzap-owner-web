import React, { useRef, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useReceiptStore } from '../../zustand/receiptStore';
import BillForCheckOut80 from '../bill/BillForCheckOut80';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { Switch } from "../../components/ui/Switch";
import axios from 'axios';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import printFlutter from '../../helpers/printFlutter';
import { base64ToBlob } from '../../helpers';
import {
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
} from '../../constants/index';
// import { Label } from '../../components/ui/Label';

export default function PopUpReciept({ open, onClose }) {
  const { t } = useTranslation();
  const bill80Ref = useRef(null);
  const [printBillLoading, setPrintBillLoading] = useState(false);
  const {
    businessName,
    address,
    phone,
    email,
    footerText,
    showTaxInfo,
    showQRCode,
    setBusinessName,
    setAddress,
    setPhone,
    setEmail,
    setFooterText,
    setShowTaxInfo,
    setShowQRCode,
    showSizeRate,
    setShowSizeRate,
  } = useReceiptStore();

  const handlePrintTest = async (isPrintBill) => {
    try {
      setPrintBillLoading(true);
      let urlForPrinter = "";
      const printerBillData = {
        type: "ETHERNET", 
        ip: "192.168.1.100", 
        width: "80mm",
      };

      let dataImageForPrint;
      dataImageForPrint = await html2canvas(bill80Ref.current, {
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

  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Receipt Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className='flex justify-between '>
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
              <div className="p-2 border rounded-lg mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                  {t("Show Tax Information")}
                  <Switch
                  id="showTaxInfo"
                  checked={showTaxInfo}
                  onChange={(e) => handleToggleChange('showTaxInfo', e.target.checked)}
                />
                </div>
                <div className="flex items-center justify-between">
                  {t("Show QR Code")}
                  <Switch
                  id="showQRCode"
                  checked={showQRCode}
                  onChange={(e) => handleToggleChange('showQRCode', e.target.checked)}
                />
                </div>
                <div className="flex items-center justify-between">
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
          <Col md={6} className='justify-center'>
            <h5>Receipt Preview</h5>
            <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
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
                {printBillLoading ? 'Printing...' : <><FontAwesomeIcon icon={faPrint} className="mr-2" /> {t("Print Test Receipt")}</>}
              </button>
              
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}