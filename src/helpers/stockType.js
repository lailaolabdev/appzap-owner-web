export const stockType = (_type) => {
    if(_type === "EXPORT"){
        return "ຂາຍອອກ"
    }
    if(_type === "IMPORT"){
        return "ນຳເຂົ້າ"
    }

    return ""
}