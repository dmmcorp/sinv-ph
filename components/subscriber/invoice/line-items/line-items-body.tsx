import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  SelectedItemType,
  useInvoiceStore,
} from "@/stores/invoice/useInvoiceStore";
import React, { useState } from "react";
import ItemDetailsDialog from "../../form/invoice/item-details-dialog";
import { toast } from "sonner";

interface LineItemsBody {
  row: string;
  data: string;
  visibleLineNumber: boolean;
}

function LineItemsBody({ row, data, visibleLineNumber }: LineItemsBody) {
  const invoice = useInvoiceStore();
  const [selectedItem, setSelectedItem] = useState<SelectedItemType | null>(
    null,
  );
  const [quantity, setQuantity] = useState<number>(selectedItem?.quantity || 1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleItemClick = (item: SelectedItemType) => {
    setSelectedItem(item);
    setQuantity(item.quantity);
    setDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (selectedItem) {
      invoice.updateItemQuantity(selectedItem._id, quantity, "replace");
      if (quantity <= 0) {
        handleRemoveItem();
        return;
      }
      toast.success(
        `${selectedItem.description} quantity updated successfully`,
      );
      setDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleRemoveItem = () => {
    if (selectedItem) {
      invoice.removeItem(selectedItem._id);
      toast.warning(`${selectedItem.description} was removed from the invoice`);
    }
    setDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <TableBody>
      {invoice.selectedItems.length > 0 ? (
        invoice.selectedItems.map((item, index) => (
          <TableRow
            key={item._id}
            onClick={() => handleItemClick(item)}
            className={`${row} cursor-pointer  transition-colors`}
          >
            {visibleLineNumber && (
              <TableCell className={`${data}`}>{index + 1}</TableCell>
            )}
            <TableCell className={`${data} capitalize`}>
              {item.description}
            </TableCell>
            <TableCell className={`${data}`}>
              ₱{item.price.toLocaleString("en-PH")}
            </TableCell>
            <TableCell className={`${data}`}>{item.quantity}</TableCell>
            <TableCell className={`${data}`}>
              ₱{(item.price * item.quantity).toLocaleString("en-PH")}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow className="h-10">
          <TableCell colSpan={5} className="p-10 border-0 invoice-text">
            <p className="text-center text-muted-foreground leading-loose text-wrap invoice-text">
              Add items or services here by clicking the{" "}
              <span className="font-bold">&quot;Add Line Items&quot;</span>{" "}
              button in the Invoice settings.
            </p>
          </TableCell>
        </TableRow>
      )}
      <ItemDetailsDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedItem={{
          description: selectedItem?.description || "",
          unitPrice: selectedItem?.price || 0,
          legalFlags: {
            naacEligible: selectedItem?.legalFlags?.naacEligible || false,
            movEligible: selectedItem?.legalFlags?.movEligible || false,
            soloParentEligible:
              selectedItem?.legalFlags?.soloParentEligible || false,
            scPwdEligible: selectedItem?.legalFlags?.scPwdEligible || false,
          },
          vatType:
            selectedItem?.vatType === "VATABLE" ? "VATABLE" : "NON-VATABLE",
          amount: (selectedItem?.price || 0) * quantity,
        }}
        quantity={quantity}
        setQuantity={setQuantity}
        handleSaveChanges={handleSaveChanges}
        handleRemoveItem={handleRemoveItem}
      />
    </TableBody>
  );
}

export default LineItemsBody;
