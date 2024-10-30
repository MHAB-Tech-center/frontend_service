/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../base/tabs";
import { ComplexInput } from "../Input";

interface DetailedReportProps {
  report: any;
}

const DetailedReport = (props: DetailedReportProps) => {
  const getSections = (report: any) => {
    const sections: { id: string; title: string; records: any[] }[] = [];
    for (const record of report) {
      if (!sections.find((el) => el.title === record.title)) {
        sections.push({
          id: record.id,
          title: record.title,
          records: [],
        });
      } else {
        sections
          .find((el) => el.title === record.title)
          ?.records.push(record.records);
      }
    }

    // flatten the records array
    sections.forEach((section) => {
      section.records = section.records.flat();
    });

    console.log({ sections });

    return sections;
  };
  const findSectionRecords = (sectionId: string, report: any): any => {
    const toReturn =
      getSections(report).find((section) => section.id === sectionId) || { records: [] };
    console.log("toReturn", toReturn);
    return toReturn.records;
  };
  return (
    <div>
      <Tabs>
        <TabsList
          className="w-full gap-4 justify-start bg-transparent flex-wrap h-fit"
          defaultValue={getSections(props.report)[0].title}
        >
          {getSections(props.report).map((section) => (
            <TabsTrigger
              key={section.id}
              className="bg-primary-50 data-[state=active]:bg-primary-200 p-2 rounded-sm w-fit capitalize"
              value={section.id}
            >
              {section.title.toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        {getSections(props.report).map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}
          >
            {findSectionRecords(section.id, props.report).map(
              (record: {
                id: string;
                title: string;
                boxValue: string;
                flagValue: string;
              }) => (
                // <div key={record.id} className="flex items-center gap-2">
                //   <span className="font-bold">{record.title}:</span>
                //   {record.boxValue || record.flagValue}
                // </div>
                <ComplexInput
                  key={record.id}
                  id={record.id}
                  label={record.title}
                  type="text"
                  value={record.boxValue || record.flagValue}
                  disabled
                />
              )
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DetailedReport;
