import * as React from "react";

import { cn } from "@/lib/utils"; // Assuming "@/lib/utils" exports a cn function

// Define the props for the Table component by extending standard HTML table attributes
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  // className prop is already included in React.HTMLAttributes
}

function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

// Define the props for the TableHeader component by extending standard HTML thead attributes
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  // className prop is already included in React.HTMLAttributes
}

function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

// Define the props for the TableBody component by extending standard HTML tbody attributes
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  // className prop is already included in React.HTMLAttributes
}

function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

// Define the props for the TableFooter component by extending standard HTML tfoot attributes
interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  // className prop is already included in React.HTMLAttributes
}

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

// Define the props for the TableRow component by extending standard HTML tr attributes
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  // className prop is already included in React.HTMLAttributes
}

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

// Define the props for the TableHead component by extending standard HTML th attributes
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  // className prop is already included in React.ThHTMLAttributes
}

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-muted-foreground h-12 px-3 text-left align-middle font-medium has-[role=checkbox]:w-px [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

// Define the props for the TableCell component by extending standard HTML td attributes
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  // className prop is already included in React.TdHTMLAttributes
}

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-3 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}

// Define the props for the TableCaption component by extending standard HTML caption attributes
interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  // className prop is already included in React.HTMLAttributes
}

function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};