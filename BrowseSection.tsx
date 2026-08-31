"use client";

import { useState } from "react";
import { MediaType } from "@/lib/types";
import { DEFAULT_FILTERS, FilterBar, Filters } from "./FilterBar";
import { BrowseGrid } from "./BrowseGrid";

export function BrowseSection({ type, initialGenre, initialCountry }: { type: MediaType; initialGenre?: string; initialCountry?: string }) {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, genre: initialGenre ?? "", country: initialCountry ?? "" });

  return (
    <div>
      <FilterBar value={filters} onChange={setFilters} />
      <div className="mt-6">
        <BrowseGrid type={type} filters={filters} />
      </div>
    </div>
  );
}
