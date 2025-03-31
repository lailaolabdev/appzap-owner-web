import React from "react";
import { Breadcrumb } from "react-bootstrap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { t } from "i18next";
import { Label } from "../../components/ui/Label";
import { Switch } from "../../components/ui/Switch";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "../../zustand/storeStore";
import {
  updateSettingCRM,
  updateSettingStock,
  updateSettingStockAccess,
} from "../../services/setting";

/**
 * SettingStock Component
 *
 * This component provides a user interface for managing stock settings in the application.
 * It includes options to toggle stock view and stock access permissions.
 *
 * @component
 *
 * @description
 * - **Counter Read-Only**: Enable this option to make the counter display information only for users.
 * - **Counter Access Only**: Enable this option to restrict counter access to users with specific permissions.
 *
 * @returns {JSX.Element} The rendered SettingStock component.
 */
export default function SettingStock() {
  const navigate = useNavigate();
  const { storeDetail, fetchStoreDetail } = useStoreStore();
  const changeStockView = async (e) => {
    const isType = e.target.checked;
    await updateSettingStock(storeDetail?._id, { data: isType });
    await fetchStoreDetail(storeDetail?._id);
  };
  const changeStockAccess = async (e) => {
    const isType = e.target.checked;
    await updateSettingStockAccess(storeDetail?._id, { data: isType });
    await fetchStoreDetail(storeDetail?._id);
  };

  return (
    <div className="p-4 bg-gray-50 h-[450px] w-full">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate(`/stock`)}>
          {t("current_stock")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t("stock_manage")}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="bg-white rounded-xl h-full overflow-hidden mt-2">
        <div className="items-center overflow-hidden bg-white px-2 py-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {t("setting")} {t("stock")}
            </CardTitle>
            <CardDescription>{t("mange_stock_setting")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stock Settings Section */}
            <div className="space-y-4">
              {/* Counter Read-Only Setting */}
              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div className="space-y-1">
                  <Label htmlFor="counter-read-only">
                    {t("counter_read_only")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("description_counter_only")}
                  </p>
                </div>
                <Switch
                  id="counter-read-only"
                  checked={storeDetail?.isCounterView}
                  onChange={changeStockView}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div className="space-y-1">
                  <Label htmlFor="counter-access-only">
                    {t("counter_access_only")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("description_counter_access")}
                  </p>
                </div>
                <Switch
                  id="counter-access-only"
                  checked={storeDetail?.isCounterAccess}
                  onChange={changeStockAccess}
                />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
