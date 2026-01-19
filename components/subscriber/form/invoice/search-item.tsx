"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";

interface SearchItemProps {
  onStepChange: (step: number) => void;
}
function SearchItem({ onStepChange }: SearchItemProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="grid grid-cols-12 items-center w-full gap-4">
      <div className="relative col-span-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items or type to create a new one "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <div className="col-span-2">
        <Button
          onClick={() => onStepChange(2)}
          variant={"secondary"}
          className="w-full font-semibold"
        >
          Create new item
        </Button>
      </div>
    </div>
  );
}

export default SearchItem;
