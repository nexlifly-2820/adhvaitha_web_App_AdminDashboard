import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
