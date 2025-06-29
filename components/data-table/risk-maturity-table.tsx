import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RiskMaturityRatingSchema } from "@/lib/types";
import { z } from "zod";

type RiskMaturityValues = z.infer<typeof RiskMaturityRatingSchema>;

export const RiskMaturityRatingTable = () => {
  const data: RiskMaturityValues = {
    engagement_id: "",
    operational_risk: { maturity_rating: "helo", rationale: "helo" },
    strategic_risk: { maturity_rating: "", rationale: "" },
    credit_risk: { maturity_rating: "", rationale: "" },
    liquidity_risk: { maturity_rating: "", rationale: "" },
    compliance_risk: { maturity_rating: "", rationale: "" },
    market_risk: { maturity_rating: "", rationale: "" },
    overall: { maturity_rating: "", rationale: "" },
  };

  return (
    <div className="mx-auto w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black w-[200px]">
                Risk Category
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black w-[300px]">
                Maturity Rating
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                Rating Rationale
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Operational Risk
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.operational_risk?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.operational_risk?.rationale}
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Strategic Risk
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.strategic_risk?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.strategic_risk?.rationale}
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Credit Risk
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.credit_risk?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.credit_risk?.rationale}
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Liquidity Risk
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.liquidity_risk?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.liquidity_risk?.rationale}
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Compliance Risk
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.compliance_risk?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.compliance_risk?.rationale}
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Market Risk
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.market_risk?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.market_risk?.rationale}
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border  [&>:not(:last-child)]:border-r">
              <TableCell className="font-helvetica-13 text-black">
                Overall Risk Rating
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data.overall?.maturity_rating}
              </TableCell>
              <TableCell className="py-2 font-helvetica-13 text-black">
                {data?.overall?.rationale}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
