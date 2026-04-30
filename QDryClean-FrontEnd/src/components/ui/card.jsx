  import { cn } from "./utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* =========================
   Pagination logic
========================= */
function buildPages(total, current, setPage) {
  const pages = [];

  const addPage = (p) => {
    pages.push(
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`h-8 min-w-8 px-2 rounded-md text-sm transition border ${
          p === current
            ? "bg-slate-900 text-white border-slate-900"
            : "border-slate-200 hover:bg-slate-50 text-slate-700"
        }`}
      >
        {p}
      </button>
    );
  };

  const addDots = (key) => {
    pages.push(
      <span key={key} className="px-1 text-slate-400">
        ...
      </span>
    );
  };

  if (total <= 7) {
    for (let i = 1; i <= total; i++) addPage(i);
    return pages;
  }

  addPage(1);

  if (current > 3) addDots("start");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    addPage(i);
  }

  if (current < total - 2) addDots("end");

  addPage(total);

  return pages;
}

/* =========================
   Card Pagination
========================= */
function CardPagination({ className, vm, ...props }) {
  return (
    <div
      data-slot="card-pagination"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 pb-6 pt-4 border-t border-slate-100",
        className
      )}
      {...props}
    >
      {/* Info */}
      <div className="text-sm text-slate-500">
        Showing page {vm.page} of {vm.paged.totalPages} | Total: {vm.paged.totalCount} items
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => vm.setPage((p) => p - 1)}
          disabled={vm.page === 1 || vm.loading}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Pages */}
        <div className="flex items-center gap-1 px-1">
          {buildPages(vm.paged.totalPages, vm.page, vm.setPage)}
        </div>

        {/* Next */}
        <button
          onClick={() => vm.setPage((p) => p + 1)}
          disabled={!vm.canNext || vm.loading}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* =========================
   Card Components
========================= */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardPagination,
};
