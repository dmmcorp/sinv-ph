import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LineItemsHeaderProps {
  header: string;
  visibleLineNumber: boolean;
}

function LineItemsHeader({ header, visibleLineNumber }: LineItemsHeaderProps) {
  return (
    <TableHeader className="min-h-1 py-0 h-1">
      <TableRow className={`${header}`}>
        {visibleLineNumber && <TableHead className={`${header}`}>#</TableHead>}
        <TableHead className={`${header} w-[50%]`}>Description</TableHead>
        <TableHead className={`${header}`}>Unit Price</TableHead>
        <TableHead className={`${header}`}>QTY</TableHead>
        <TableHead className={`${header}`}>Amount</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export default LineItemsHeader;
