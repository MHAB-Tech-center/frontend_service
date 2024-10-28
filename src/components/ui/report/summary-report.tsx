import { Label } from "../base/label";
import { ComplexInput } from "../Input";

interface SummaryReportProps {
  mainProblems: string;
  proposedRemedialActions: string;
  certificationStatus:
    | "Green-flagged (uncertified)"
    | "Yellow-flagged"
    | "Red-flagged (uncertified)";
  certificationStaus:
    | "Green-flagged (uncertified)"
    | "Yellow-flagged"
    | "Red-flagged (uncertified)";
  id: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
}

const SummaryReport = (props: SummaryReportProps) => {
  return (
    <div className="py-5 flex flex-col gap-6">
      <div className="title bg-primary-100 text-black p-4 rounded-md font-bold">
        <h2>SUMMARY OF INSPECTION FINDINGS & RECOMMENDATIOINS</h2>
      </div>
      <form className="flex flex-col gap-4 px-4">
        <ComplexInput
          disabled
          id="mine-owner-name"
          label="Main problems at mine site"
          type="textarea"
          placeholder="What is the main problem at the mine site?"
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50 w-full p-2 rounded-md min-h-52"
          value={props.mainProblems}
        />
        <ComplexInput
          disabled
          id="mine-owner-name"
          label="Proposed remedial actions"
          type="textarea"
          placeholder=" What are the proposed remedial actions?"
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50 w-full p-2 rounded-md min-h-52"
          value={props.proposedRemedialActions}
        />
        <h1 className="text-xl font-bold">
          Mine site certification status (based on the next pages)
        </h1>
        {/* <Label className="flex items-center gap-2">
          <div className="bg-green-400 h-5 w-5 rounded-sm" />
          Green flagged (uncertified)
        </Label>
        <ComplexInput id="green-flag-date" label="as of" type="date" />
        <Label className="flex items-center gap-2">
          <div className="bg-yellow-400 h-5 w-5 rounded-sm" />
          Yellow flagged
        </Label>
        <ComplexInput id="yellow-flag-date" label="as of" type="date" />
        <Label className="flex items-center gap-2">
          <div className="bg-red-400 h-5 w-5 rounded-sm" />
          Red flagged (uncertified)
        </Label>
        <ComplexInput id="red-flag-date" label="as of" type="date" /> */}
        {
          {
            "Green-flagged (uncertified)": (
              <>
                <Label className="flex items-center gap-2">
                  <div className="bg-green-400 h-5 w-5 rounded-sm" />
                  Green flagged (uncertified)
                </Label>
                <ComplexInput
                  id="green-flag-date"
                  label="as of"
                  type="date"
                  disabled
                  value={new Date(props.updatedAt).toISOString().split("T")[0]}
                />
              </>
            ),
            "Yellow-flagged": (
              <>
                <Label className="flex items-center gap-2">
                  <div className="bg-yellow-400 h-5 w-5 rounded-sm" />
                  Yellow flagged
                </Label>
                <ComplexInput
                  id="yellow-flag-date"
                  label="as of"
                  type="date"
                  disabled
                  value={new Date(props.updatedAt).toISOString().split("T")[0]}
                />
              </>
            ),
            "Red-flagged (uncertified)": (
              <>
                <Label className="flex items-center gap-2">
                  <div className="bg-red-400 h-5 w-5 rounded-sm" />
                  Red flagged (uncertified)
                </Label>
                <ComplexInput
                  id="red-flag-date"
                  label="as of"
                  type="date"
                  disabled
                  value={new Date(props.updatedAt).toISOString().split("T")[0]}
                />
              </>
            ),
          }[props.certificationStatus || props["certificationStaus"]]
        }
        <ComplexInput id="period-end-date" label="Period Ends On" type="date" />
      </form>
    </div>
  );
};

export default SummaryReport;
