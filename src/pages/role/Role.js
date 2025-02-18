import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { COLOR_APP, END_POINT } from "../../constants";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MdAssignmentAdd } from "react-icons/md";
import { Button, Modal } from "react-bootstrap";
import PopUpAddRole from "../../components/popup/PopUpAddRole";
import PopUpEditRole from "../../components/popup/PopUpEditRole";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useStoreStore } from '../../zustand/storeStore';
import { getPermissionRoles, updatePermissionRole, deletePermissionRole, createPermissionRole } from "../../services/permissionRole";


const ManagementRole = () => {

    const { t } = useTranslation();
    const [popup, setPopup] = useState();
    const [deletePopup, setDeletePopup] = useState(null);
    const [dataPermission, setDataPermision] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const {storeDetail} = useStoreStore();

    const getDataPermissionRole = async () => {
        try {
            const permissionData = await getPermissionRoles(storeDetail?._id);
            setDataPermision(permissionData);
        } catch (err) {
            console.error("Error fetching permission roles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDataPermissionRole();
    }, [popup?.PopUpAddRole, popup?.PopUpEditRole, deletePopup]);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deletePermissionRole(id ,storeDetail?._id);
            getDataPermissionRole();
            setDeletePopup(null);
            Swal.fire({
                icon: 'success',
                title: `${t("delete_success")}`,
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error("Error deleting permission role:", err);
            Swal.fire({
                icon: 'error',
                title: `${t("delete_fail")}`,
                text: t("error"),
                showConfirmButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-(100%) mx-auto flex justify-center flex-col">
            <Breadcrumb>
                <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
                <Breadcrumb.Item active>{t("manage_role")}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="bg-white rounded-lg  overflow-hidden  " style={{border:'1px solid red',paddingBottom:"1rem"}}>
                <div className='flex justify-between items-center w-full bg-color-app text-white p-2' >
                    <div className="px-6 py-2 text-left">{t("manage_role")}</div>
                    <Button variant="dark"
                        onClick={() => {
                            setPopup({
                                PopUpAddRole: true,
                            });
                        }}  >
                        <span>{t("add")}{t("role")}</span>
                    </Button>

                </div>
                <table className="w-full">
                    <thead >
                        <tr>
                            <th className="px-6 font-bold py-3 text-left">#</th>
                            <th className="px-6 font-bold py-3 text-left">{t("role")}</th>
                            <th className="px-6 font-bold py-3 text-left">{t("note")}</th>
                            <th className="px-6 font-bold py-3 text-center">{t("_manage")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dataPermission.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-2">{index + 1}</td>
                                <td className="px-6 py-2">{item?.roleName}</td>
                                <td className="px-6 py-2">{item?.note}</td>
                                <td className="px-6 py-2 ">
                                    <div className="flex justify-center items-center gap-2">
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            style={{ color: COLOR_APP, cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedRole(item);
                                                setPopup({
                                                    PopUpEditRole: true,
                                                });
                                            }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            style={{
                                                marginLeft: 20,
                                                color: "red",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setDeletePopup(item)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {popup?.PopUpAddRole && (
                <PopUpAddRole
                    open={popup?.PopUpAddRole}
                    onClose={() => {
                        setPopup();
                    }}
                    createPermissionRole={createPermissionRole}
                />
            )}
            {/* {eidt role} */}
            {popup?.PopUpEditRole && (
                <PopUpEditRole
                    open={popup?.PopUpEditRole}
                    onClose={() => {
                        setPopup();
                    }}
                    roleData={selectedRole} 
                    updatePermissionRole={updatePermissionRole}
                />
            )}
            {/* Popup Confirm Delete */}
            {deletePopup && (
                <Modal show onHide={() => setDeletePopup(null)} >
                    <Modal.Header closeButton>
                        <Modal.Title>{t("approve_delete")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {t("sure_to_delete_data")} "<b>{deletePopup.roleName}</b>"?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDeletePopup(null)}>
                            {t("cancel")}
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(deletePopup._id)}>
                            {t("delete")}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
};

export default ManagementRole;