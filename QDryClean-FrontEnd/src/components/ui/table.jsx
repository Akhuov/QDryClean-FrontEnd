"use client";

import * as React from "react";
import { cn } from "./utils";

/**
 * Table - Основной контейнер.
 * Использование forwardRef позволяет внешним компонентам (например, анимациям) 
 * получать прямой доступ к DOM-узлу таблицы.
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="table-container"
    className="relative w-full overflow-auto rounded-[24px] border border-blue-50/50 bg-white/40 backdrop-blur-md shadow-[0_20px_50px_rgba(148,163,184,0.05)]"
  >
    <table
      ref={ref}
      data-slot="table"
      className={cn("w-full caption-bottom text-sm tracking-tight", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn("bg-blue-50/30 text-slate-500 font-semibold [&_tr]:border-b-0", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn("divide-y divide-blue-50/50 [&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      "bg-blue-50/10 border-t border-blue-50 font-semibold text-blue-700",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot="table-row"
    className={cn(
      "transition-colors duration-200 hover:bg-blue-50/20 data-[state=selected]:bg-blue-50/40 border-b border-blue-50/30 last:border-0",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-slot="table-head"
    className={cn(
      "h-12 px-4 text-left align-middle font-bold uppercase text-[11px] tracking-widest text-blue-400/80 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn(
      "p-4 align-middle text-slate-600 font-medium [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn("mt-4 text-xs italic text-slate-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};