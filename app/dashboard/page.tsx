import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <SectionCards />
      <div className="grid grid-cols-1 gap-8">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}
