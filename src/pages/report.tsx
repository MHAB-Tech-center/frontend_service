/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import FeedbackModal from "@/components/modals/feedback";
import { Button } from "@/components/ui/base/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base/tabs";
import DetailedReport from "@/components/ui/report/detailed-report";
import IdentificationTab from "@/components/ui/report/identification";
import SummaryReport from "@/components/ui/report/summary-report";
import { getInspectionInfo } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ReportPage = () => {
  const { id: reportId } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [inspectionInfo, setInspectionInfo] = useState<{
    identification: any;
    records: any[];
    summaryReport: any;
  }>({
    identification: {},
    records: [],
    summaryReport: {},
  });

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await getInspectionInfo(reportId!);
      console.log(response.data);
      setInspectionInfo(response.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!reportId) {
    return <Navigate to="/report" />;
  }

  if (loading) {
    return <div className="text-center h-96 flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col gap-2 w-full">
      <div className="w-full flex justify-end gap-4">
        <FeedbackModal planId={reportId} />
        <Button>Export to PDF</Button>
      </div>
      <Tabs defaultValue="identification" className="">
        <TabsList className="w-full gap-4 justify-start bg-transparent flex-wrap h-fit">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 bg-primary-50 rounded-md"
            value="identification"
          >
            Identification
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 bg-primary-50 rounded-md"
            value="summary-report"
          >
            Summary Report
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 bg-primary-50 rounded-md"
            value="detailed-inspection-report-1"
          >
            Detailed Inspection Report 1
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identification">
          <IdentificationTab identification={inspectionInfo.identification} />
        </TabsContent>
        <TabsContent value="summary-report">
          <SummaryReport {...inspectionInfo.summaryReport}/>
        </TabsContent>
        <TabsContent value="detailed-inspection-report-1">
          <DetailedReport report={inspectionInfo.records} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPage;
