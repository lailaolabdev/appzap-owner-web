import React from "react";
import { Dialog, DialogContent } from "../../../components/ui/Dialog";
import {
  Receipt,
  Clock,
  CreditCard,
  Wallet,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import moment from "moment";

const BillDetailDialog = ({
  isOpen,
  onOpenChange,
  loadingDetail,
  billDetail,
  formatCurrency,
  getStatusText,
  t,
  status,
  statusText,
  rejectedReason,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl lg:max-w-3xl p-0 overflow-hidden rounded-xl shadow-lg">
        {loadingDetail ? (
          <div className="py-10 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-200 mb-3"></div>
              <div className="h-4 w-28 bg-orange-100 rounded"></div>
            </div>
          </div>
        ) : billDetail ? (
          <div className="bg-white">
            <div className="relative overflow-hidden">
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

              <div className="relative px-5 py-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      <Receipt className="text-orange-100" size={20} />
                      ລາຍລະອຽດການຊຳລະ
                    </div>
                    <div className="text-sm text-orange-100 mt-1 flex items-center">
                      {t("billNo")}:{" "}
                      <span className="font-medium ml-1 text-white">
                        {billDetail.billData?.billNo}
                      </span>
                      <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20">
                        {statusText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Info Section - Compact Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b">
              {/* Created At */}
              <div className="p-3 border-r border-b md:border-b-0">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  <div className="text-xs text-gray-500">{t("date_time")}</div>
                </div>
                <div className="text-sm font-medium text-gray-800 mt-1">
                  {billDetail.billData?.createdAt
                    ? moment(billDetail.billData.createdAt).format(
                        "DD/MM/YYYY HH:mm"
                      )
                    : "-"}
                </div>
              </div>

              {/* Number of Bills */}
              <div className="p-3 border-b md:border-b-0 md:border-r">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-orange-500" />
                  <div className="text-xs text-gray-500">{t("ຈຳນວນບິນ")}</div>
                </div>
                <div className="text-sm font-medium text-gray-800 mt-1">
                  {billDetail.checkoutData?.length || 0}
                </div>
              </div>

              {/* Fee */}
              <div className="p-3 border-r">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-orange-500" />
                  <div className="text-xs text-gray-500">{t("fee")}</div>
                </div>
                <div className="text-sm font-medium text-gray-800 mt-1">
                  {formatCurrency(
                    billDetail.billData?.fee,
                    billDetail.billData?.currency
                  )}
                </div>
              </div>

              {/* Total Amount */}
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-orange-500" />
                  <div className="text-xs text-gray-500">
                    {t("ຈຳນວນເງິນທັງໝົດ")}
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600 mt-1">
                  {formatCurrency(
                    billDetail.billData?.totalPrice,
                    billDetail.billData?.currency
                  )}
                </div>
              </div>
            </div>

            {/* Rejection Reason Section - Only show if status is rejected */}
            {status === "rejected" && rejectedReason && (
              <div className="px-4 py-2 border-b bg-orange-50">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle size={16} className="text-orange-500" />
                  <span className="font-medium text-sm">
                    {t("rejection_reason")}:
                  </span>
                </div>
                <div className="text-orange-700 text-sm pl-6 mt-1">
                  {rejectedReason}
                </div>
              </div>
            )}

            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold text-gray-800">
                  ລາຍການຊຳລະ
                </div>
                <div className="text-xs text-gray-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  {billDetail.checkoutData?.length || 0} {t("entries")}
                </div>
              </div>

              <div className="overflow-auto max-h-64 rounded-lg border border-orange-100 shadow-sm">
                <table className="w-full table-fixed">
                  <thead className="bg-orange-50 sticky top-0 z-10 whitespace-nowrap">
                    <tr>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left">
                        {t("no")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left">
                        {t("tableName")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left">
                        {t("tableCode")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left">
                        {t("paymentMethod")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left">
                        {t("status")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-left">
                        {t("date_time")}
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-orange-700 text-right">
                        {t("amount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100 bg-white">
                    {billDetail.checkoutData?.map((checkout, idx) => (
                      <tr
                        key={checkout._id}
                        className="hover:bg-orange-50/40 transition-colors whitespace-nowrap"
                      >
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-700">
                          {checkout.tableName || "-"}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {checkout.code || "-"}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          <div className="flex items-center">
                            <CreditCard
                              size={14}
                              className="text-orange-500 mr-1"
                            />
                            <span>{checkout.paymentData.origin}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${
                              checkout.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                checkout.status === "PAID"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }`}
                            ></span>
                            {getStatusText(checkout.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">
                          {checkout.createdAt
                            ? moment(checkout.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : "-"}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-green-600 text-right">
                          {formatCurrency(
                            checkout.totalAmount,
                            checkout.currency
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t">
              <div className="px-4 py-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600 mr-2">
                      {t("fee")}:
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {formatCurrency(
                        billDetail.billData?.fee,
                        billDetail.billData?.currency
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-sm text-gray-600 mr-2">
                      {t("ຈຳນວນເງິນທັງໝົດ")}:
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {formatCurrency(
                        billDetail.billData?.totalPrice,
                        billDetail.billData?.currency
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="bg-orange-50 p-2 rounded-full inline-block mb-2">
              <AlertCircle size={20} className="text-orange-500" />
            </div>
            <div className="text-base font-medium text-gray-800">
              {t("noData")}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BillDetailDialog;
