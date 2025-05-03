import * as React from "react";

import { cn } from "../../lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm border-collapse", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn("bg-gray-100 border-b", className)} 
    {...props} 
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b hover:bg-gray-50 transition-colors",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-3 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// New component for the total row that appears at the bottom
const TableTotal = React.forwardRef(({ className, currency = "LAK", total, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full text-right py-2 px-4 font-bold text-base",
      className
    )}
    {...props}
  >
    {props.children || `ລວມ: ${total} ${currency}`}
  </div>
));
TableTotal.displayName = "TableTotal";

// New component for status badges
const TableStatusBadge = React.forwardRef(({ status, className, ...props }, ref) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'served':
      case 'ເສີບແລ້ວ':
        return "bg-green-100 text-green-800";
      case 'cancel':
      case 'ຍົກເລີກ':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      ref={ref}
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        getStatusStyles(),
        className
      )}
      {...props}
    >
      {props.children || status}
    </span>
  );
});
TableStatusBadge.displayName = "TableStatusBadge";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableTotal,
  TableStatusBadge
};
