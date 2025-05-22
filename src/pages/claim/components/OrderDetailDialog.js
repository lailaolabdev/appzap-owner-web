import React from "react";
import { Clock, DollarSign, HandPlatter } from "lucide-react";
import moment from "moment";

import { Dialog, DialogContent } from "../../../components/ui/Dialog";

const OrderDetailDialog = ({
  isOpen,
  onOpenChange,
  orderData,
  formatCurrency,
  t,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl p-0 overflow-hidden rounded-xl shadow-lg max-h-[95vh] flex flex-col">
        <div className="bg-white flex flex-col min-h-0">
          {/* Header Section */}
          <div className="relative overflow-hidden flex-shrink-0">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400"></div>
            {/* Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            ></div>

            <div className="relative px-3 sm:px-5 py-4 text-white">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <div className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <HandPlatter
                      className="text-orange-100 flex-shrink-0"
                      size={20}
                    />
                    <span className="truncate">ລາຍລະອຽດອໍເດີ້</span>
                  </div>
                  <div className="text-xs sm:text-sm text-orange-100 mt-1 flex items-center">
                    <span className="flex-shrink-0">{t("tableName")}:</span>
                    <span className="font-medium ml-1 text-white truncate">
                      {`${orderData?.tableName} (${orderData?.code})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Section */}
          <div className="grid grid-cols-2 gap-0 border-b flex-shrink-0">
            <div className="p-3 border-r border-b-0">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-orange-500 flex-shrink-0" />
                <div className="text-xs text-gray-500 truncate">
                  {t("date_time")}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-800 mt-1 truncate">
                {orderData?.createdAt
                  ? moment(orderData.createdAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-2">
                <DollarSign
                  size={16}
                  className="text-orange-500 flex-shrink-0"
                />
                <div className="text-xs text-gray-500 truncate">
                  {t("total_amount")}
                </div>
              </div>
              <div className="text-sm font-medium text-green-600 mt-1 truncate">
                {formatCurrency(
                  orderData?.totalOrderAmount,
                  orderData?.currency
                )}
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="px-3 py-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold text-gray-800 mb-2">
                ລາຍການອໍເດີ້
              </div>
              <div className="text-xs text-gray-500 bg-orange-50 px-2 py-0.5 rounded-full flex-shrink-0">
                {orderData?.orders?.length || 0} {t("entries")}
              </div>
            </div>
            <div className="flex-1 min-h-0 my-2">
              <div className="overflow-auto max-h-64 rounded-lg border border-orange-100 shadow-sm">
                <table className="w-full table-auto min-w-max">
                  <thead className="bg-orange-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left whitespace-nowrap">
                        {t("no")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left whitespace-nowrap min-w-[100px]">
                        {t("menu_name")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-right whitespace-nowrap">
                        {t("price")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-center whitespace-nowrap">
                        {t("quantity")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-right whitespace-nowrap">
                        {t("total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100 bg-white">
                    {orderData?.orders?.map((order, idx) => (
                      <tr key={order._id} className="hover:bg-orange-50/40">
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-700">
                          {`${order.name} ${order.options
                            .map((option) => `[${option.name}]`)
                            .join(" ")}`}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-right">
                          {formatCurrency(
                            order.price +
                              (order.options?.reduce(
                                (sum, option) => sum + (option.price || 0),
                                0
                              ) || 0),
                            orderData.currency
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-center">
                          {order.quantity}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-green-600 text-right">
                          {formatCurrency(
                            (order.price +
                              (order.options?.reduce(
                                (sum, option) => sum + (option.price || 0),
                                0
                              ) || 0)) *
                              order.quantity,
                            orderData.currency
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
