import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../Box";

export default function PopUpChooseTableComponent({
    open,
    onClose,
    tableList,
    setSelectedTable
}) {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedTableIds, setSelectedTableIds] = useState([]);

    const onSelectTable = (tableId) => {
        const _selectedTables = [...selectedTableIds];

        // Check if the tableId is already selected
        const isTableSelected = _selectedTables.some(table => table === tableId);

        if (!isTableSelected) {
            // If the tableId is not in the selectedTableIds array, add it
            setSelectedTableIds([..._selectedTables, tableId]);
        } else {
            // If the tableId is already selected, remove it
            const updatedSelectedTableIds = _selectedTables.filter(table => table !== tableId);
            setSelectedTableIds(updatedSelectedTableIds);
        }
    }


    const checkedTable = (tableId) => {
        return selectedTableIds.some(table => table === tableId);
    }

    return (
        <Modal show={open} onHide={onClose}>
            <Modal.Header closeButton> <div>ລາຍການໂຕະ</div></Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: "center" }}>
                    <Box
                        sx={{
                            display: "grid",
                            gap: 6,
                            gridTemplateColumns: {
                                md: "1fr 1fr 1fr 1fr 1fr",
                                sm: "1fr 1fr 1fr",
                                xs: "1fr 1fr",
                            },
                        }}
                    >
                        {tableList &&
                            tableList?.map((table, index) => (
                                <div key={"table" + index} >
                                    <Box
                                        sx={{
                                            display: { md: "block", xs: "none" },
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                border: "1px solid" + (checkedTable(table?._id) ? COLOR_APP : '#EEE'),
                                                borderRadius: 8,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                textAlign: "center",
                                                padding: 10,
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                onSelectTable(table?._id);
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    float: "right",
                                                    right: 10,
                                                    top: 10,
                                                }}
                                            ></div>
                                            <div>
                                                <span
                                                    style={{
                                                        fontSize: 16
                                                    }}
                                                >
                                                    <div>{table?.name}</div>
                                                </span>
                                            </div>
                                        </div>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: { md: "none", xs: "block" },
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                borderRadius: 8,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                textAlign: "center",
                                                padding: 10,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    float: "right",
                                                    right: 10,
                                                    top: 10,
                                                }}
                                            ></div>
                                            <div>
                                                <span>
                                                    <div>{table?.tableName}</div>
                                                    <div>{table?.code}</div>
                                                </span>
                                            </div>
                                        </div>
                                    </Box>
                                </div>
                            ))}
                    </Box>
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
                        setSelectedTable(selectedTableIds);
                        onClose();
                        // setButtonDisabled(true);
                        // onSubmit().then(() => setButtonDisabled(false));
                    }}
                >
                    ຢືນຢັນ
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
