'use client';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

interface ItemDetailsDialogProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
    selectedItem: {
        description: string;
        unitPrice: number;
        legalFlags?: {
            naacEligible?: boolean;
            movEligible?: boolean;
            soloParentEligible?: boolean;
            scPwdEligible?: boolean;
        };
        vatType: "VATABLE" | "NON-VATABLE";
        amount: number;
    } | null;
    handleRemoveItem: () => void;
    handleSaveChanges: () => void;
}

function ItemDetailsDialog({
    dialogOpen, 
    setDialogOpen,
    selectedItem,
   
    quantity,
    setQuantity,
    handleRemoveItem,
    handleSaveChanges
}: ItemDetailsDialogProps) {

    
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity)
    }
  }


  return (
     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg sm:max-w-xl lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Modify item quantity or remove it from the invoice</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">
              {/* Item Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Description</label>
                  <p className="text-base text-slate-900">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Unit Price</label>
                    <p className="text-base text-slate-900">₱{selectedItem.unitPrice.toLocaleString("en-PH")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Total Price</label>
                    <p className="text-base text-slate-900">₱{selectedItem.amount.toLocaleString("en-PH")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                        <label className="text-sm font-semibold text-slate-700 block">Value Added Tax</label>
                        <div className="flex items-center justify-between text-base">
                               <span className="">
                                 12% VAT {selectedItem.vatType === "VATABLE" ? "" : "not"} applied
                               </span>
                    
                           </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                        <label className="text-sm font-semibold text-slate-700 block">Discount Eligibility</label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {selectedItem.legalFlags?.scPwdEligible && (
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-base font-medium">
                                    Senior Citizen / PWD
                                    </span>
                                )}
                                {selectedItem.legalFlags?.naacEligible && (
                                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-base font-medium">
                                    NAAC
                                    </span>
                                )}
                                {selectedItem.legalFlags?.movEligible && (
                                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-base font-medium">
                                    MOV
                                    </span>
                                )}
                                {selectedItem.legalFlags?.soloParentEligible && (
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-base font-medium">
                                    Solo Parent
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Quantity Adjustment */}
              <div className="bg-slate-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-slate-700 block mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input type="number" min={0} className="text-lg font-semibold text-slate-900 w-12 text-center" value={quantity} onChange={(e)=> setQuantity(Number(e.target.value))} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* New Amount Preview */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-primary mb-1">New Amount</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₱{(selectedItem.unitPrice * quantity).toLocaleString("en-PH")}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="destructive" onClick={handleRemoveItem} className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Item
            </Button>
            <Button onClick={handleSaveChanges} className="flex-1 ">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default ItemDetailsDialog