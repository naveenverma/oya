"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RECORD_STATUSES } from "@/lib/security/constants";
import { Search } from "lucide-react";

export function RecordsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/admin/records?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParams("search", (formData.get("search") as string) ?? "");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <form onSubmit={handleSearch} className="flex flex-1 gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            name="search"
            placeholder="Search control number, name, organization…"
            defaultValue={searchParams.get("search") ?? ""}
          />
        </div>
        <Button type="submit" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <div className="space-y-1">
        <Label htmlFor="status-filter">Status</Label>
        <Select
          value={searchParams.get("status") ?? "all"}
          onValueChange={(v) =>
            updateParams("status", !v || v === "all" ? "" : v)
          }
        >
          <SelectTrigger id="status-filter" className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {RECORD_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
