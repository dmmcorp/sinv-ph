"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Item, NewItemValues } from "./add-items-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VATTYPE } from "@/lib/types";
import { Check } from "lucide-react";
import useBusinessProfileStore from "@/stores/business-profile/useBusinessProfileStore";

interface CreateNewItemProps {
  onAddNewItem: (item?: Item) => void;
  onSetNewItemValues: (values: {
    description: string;
    price: number;
    vatType: VATTYPE;
    legalFlags: {
      scPwdEligible: boolean;
      naacEligible: boolean;
      movEligible: boolean;
      soloParentEligible: boolean;
    };
  }) => void;
  newItemValues: NewItemValues;
}

const VAT = [
  { value: "VATABLE", label: "Vatable" },
  { value: "VAT_EXEMPT", label: "Vat Exempt" },
  { value: "ZERO_RATED", label: "Zero Rated" },
];

const LEGALFLAGSMAP = [
  { label: "Senior Citizen/PWD Eligible", value: "scPwdEligible" },
  { label: "NAAC Eligible", value: "naacEligible" },
  { label: "MOV Eligible", value: "movEligible" },
  { label: "SP Eligible", value: "soloParentEligible" },
];

function CreateNewItem({
  onAddNewItem,
  onSetNewItemValues,
  newItemValues,
}: CreateNewItemProps) {
  const { businessProfile } = useBusinessProfileStore();
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetNewItemValues({
      ...newItemValues,
      description: e.target.value,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetNewItemValues({
      ...newItemValues,
      price: parseFloat(e.target.value || "0"),
    });
  };

  const handleDisabledFlag = (): boolean => {
    if (newItemValues.vatType === "ZERO_RATED") {
      onSetNewItemValues({
        ...newItemValues,
        legalFlags: {
          scPwdEligible: false,
          naacEligible: false,
          movEligible: false,
          soloParentEligible: false,
        },
      });
      return true; // disable when vat type is zero rated for SC/PWD and Solo Parent
    }
    return false;
  };
  return (
    <>
      <div className="grid grid-cols-2 items-center">
        <div className="text-left">
          <h2 className="font-semibold text-muted-foreground">
            Create new item
          </h2>
        </div>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => {
              onAddNewItem();
            }}
            type="submit"
            className=" flex items-center gap-2 cursor-pointer"
          >
            Save & add
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description" className="text-muted-foreground">
          Description
        </Label>
        <Input
          id="description"
          placeholder="Enter custom description"
          className="bg-white"
          onChange={handleDescriptionChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price" className="text-muted-foreground">
          Price
        </Label>
        <Input
          id="price"
          type="number"
          onChange={handlePriceChange}
          placeholder="Enter custom price"
          className="bg-white"
        />
      </div>
      {businessProfile?.businessType === "VAT-Registered Business" && (
        <>
          <div className="space-y-2 mb-2">
            <Label className="text-sm text-muted-foreground">
              Vat Classification
            </Label>
            <Select
              defaultValue={newItemValues.vatType}
              onValueChange={(value) =>
                onSetNewItemValues({
                  ...newItemValues,
                  vatType: value as VATTYPE,
                })
              }
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue
                  placeholder="Select Vat Type"
                  defaultValue={VAT[0].value}
                >
                  <span className="flex items-center gap-2">
                    <span>{newItemValues.vatType}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VAT.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Label className="text-sm text-muted-foreground">
            Select Legal Eligibility Flags
          </Label>
          <div className="space-y-2 mb-2 grid grid-cols-1">
            {LEGALFLAGSMAP.map((flag) => (
              <button
                key={flag.value}
                onClick={() =>
                  onSetNewItemValues({
                    ...newItemValues,
                    legalFlags: {
                      ...newItemValues.legalFlags,
                      [flag.value]:
                        !newItemValues.legalFlags[
                          flag.value as keyof typeof newItemValues.legalFlags
                        ],
                    },
                  })
                }
                disabled={handleDisabledFlag()}
                className={`bg-white w-full text-left p-3 rounded-lg border transition-all flex flex-col 
                      ${
                        newItemValues.legalFlags[
                          flag.value as keyof typeof newItemValues.legalFlags
                        ]
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                      ${handleDisabledFlag() && "opacity-50 cursor-not-allowed"}
                      `}
              >
                <div className="flex items-start justify-between gap-2 ">
                  <div className="space-y-1 min-w-0">
                    <p className="font-normal text-sm truncate">{flag.label}</p>
                  </div>
                  {newItemValues.legalFlags[
                    flag.value as keyof typeof newItemValues.legalFlags
                  ] && (
                    <div className="shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default CreateNewItem;
