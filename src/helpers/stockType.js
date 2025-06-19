import { t } from "i18next"

export const stockType = (_type) => {
    if(_type === "EXPORT"){
        return t("export")
    }
    if(_type === "IMPORT"){
        return t("import")
    }

    if(_type === "SALE"){
        return t("sale")
    }

    return ""
}