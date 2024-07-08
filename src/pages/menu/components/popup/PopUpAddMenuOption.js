import React, { useState, useEffect } from 'react';
import { Modal, Button, FormControl, InputGroup, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function PopUpAddMenuOption({
    showSetting,
    handleClose,
    detailMenu
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [allMenuOptions, setAllMenuOptions] = useState([]);
    const [specificMenuOptions, setSpecificMenuOptions] = useState([]);

    useEffect(() => {
        if (showSetting && detailMenu) {
            const restaurantId = detailMenu.data.restaurantId; // Assuming restaurant ID is in detailMenu.data.restaurantId

            const fetchAllMenuOptions = async () => {
                try {
                    const response = await axios.get(`/api/all-menu-options/${restaurantId}`); // Replace with your API endpoint
                    setAllMenuOptions(response.data);
                } catch (error) {
                    console.error('Error fetching all menu options:', error);
                }
            };

            const fetchSpecificMenuOptions = async () => {
                try {
                    const response = await axios.get(`/api/menu-options/${detailMenu.data.id}`); // Replace with your API endpoint
                    setSpecificMenuOptions(response.data);
                } catch (error) {
                    console.error('Error fetching specific menu options:', error);
                }
            };

            fetchAllMenuOptions();
            fetchSpecificMenuOptions();
        }
    }, [showSetting, detailMenu]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddOption = async (optionId) => {
        try {
            await axios.post(`/api/menu-options/${detailMenu.data.id}/add`, { optionId }); // Replace with your API endpoint
            const updatedOptions = await axios.get(`/api/menu-options/${detailMenu.data.id}`);
            setSpecificMenuOptions(updatedOptions.data);
        } catch (error) {
            console.error('Error adding menu option:', error);
        }
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await axios.delete(`/api/menu-options/${detailMenu.data.id}/delete/${optionId}`); // Replace with your API endpoint
            const updatedOptions = await axios.get(`/api/menu-options/${detailMenu.data.id}`);
            setSpecificMenuOptions(updatedOptions.data);
        } catch (error) {
            console.error('Error deleting menu option:', error);
        }
    };

    const filteredMenuOptions = allMenuOptions.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isSpecificOption = (optionId) => {
        return specificMenuOptions.some(option => option.id === optionId);
    };

    return (
        <div>
            <Modal show={showSetting} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title style={{ color: "#fb6e3b", fontWeight: "800" }}>
                        ລາຍການອ໋ອບຊັນເສີມຂອງ: <q>{detailMenu && detailMenu?.data?.name}</q>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                    <ListGroup>
                        {filteredMenuOptions.map((option, index) => (
                            <ListGroup.Item
                                key={index}
                                className={`d-flex justify-content-between align-items-center ${isSpecificOption(option.id) ? 'list-group-item-primary' : ''}`}
                            >
                                <div>
                                    <strong>{option.name}</strong> - {option.price}
                                </div>
                                {isSpecificOption(option.id) ? (
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteOption(option.id)}>
                                        ລຶບ
                                    </Button>
                                ) : (
                                    <Button variant="success" size="sm" onClick={() => handleAddOption(option.id)}>
                                        ເພີ່ມ
                                    </Button>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ປິດອອກ
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PopUpAddMenuOption;
