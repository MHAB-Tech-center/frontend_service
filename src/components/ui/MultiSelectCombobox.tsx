"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/base/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/base/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/base/popover";
import { Badge } from "@/components/ui/base/badge";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";

interface MultiSelectComboboxProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSelect: (values: string[]) => void;
}

export default function MultiSelectCombobox({
  options = [],
  selectedValues,
  onSelect,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  //   const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleSelect = (currentValue: string) => {
    if (selectedValues.includes(currentValue)) {
      onSelect(selectedValues.filter((value) => value !== currentValue));
    } else {
      onSelect([...selectedValues, currentValue]);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onSelect(selectedValues.filter((value) => value !== valueToRemove));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between h-fit"
        >
          {selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((value) => (
                <Badge key={value} variant="secondary" className="mr-1">
                  {
                    options.find((framework) => framework.value === value)
                      ?.label
                  }
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(value)}
                  >
                    <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            "Select ..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={handleSelect}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValues.includes(framework.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
