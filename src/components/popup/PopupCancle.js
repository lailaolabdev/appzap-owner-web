import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

export default function PopUpStoreCancle({ open, text, onClose, onSubmit }) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          <div>ທ່ານຕ້ອງການຍົກເລີກອໍເດີ້ແທ້ບໍ? </div>
          <div style={{ color: "red" }}>{text && text}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={() => {
            setButtonDisabled(true);
            onSubmit().then(() => setButtonDisabled(false));
          }}
        >
          ຢືນຢັນການລົບ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// export default function PopUpStoreEdit({ open, onClose, onSubmit, data }) {
//     return (
//       <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
//         <Modal.Header closeButton>
//           <Modal.Title>ເຫດຜົນຍົກເລີກສິນຄ້າ</Modal.Title>
//         </Modal.Header>
//           <Formik>
//           {({
//             handleSubmit,
//           }) => (
//             <form onSubmit={handleSubmit}>
//               <Modal.Body>
//                 <div className="cencel">
//                 <button>ເສີບຜິດໂຕະ</button>
//                 <button>ລູກຄ້າຍົກເລີກ</button>
//                 <button>ຄົວເຮັດອາຫານຜິດ</button>
//                 <button>ພະນັກງານເສີບ ຄີອາຫານຜິດ</button>
//                 <button>ອາຫານດົນ</button>
//                 <button>ອາຫານໝົດໂຕະ</button>
//                 <button>ອາຫານໝົດ</button>
//                 <button>ເຄື່ອງດື່ນໝົດ</button>
//                 <button>ບໍ່ມີອາຫານໃນໂຕະ</button>
//                 </div>
//               </Modal.Body>
//             </form>
//           )}
//         </Formik>
//       </Modal>
//     );
//   }
