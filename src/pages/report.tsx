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
import { getErrorMessage, isDateString } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "@/assets/rmb-logo.png";
import { reportMetaData } from "@/lib/constants";
import useAuth from "@/hooks/useAuth";
import ConfirmActionModal from "@/components/modals/confirm-action";

interface DataItem {
  key: string;
  value: string;
}

interface Section {
  sectionTitle: string;
  data: DataItem[];
}

const ReportPage = () => {
  const { id: reportId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { isAllowed } = useAuth();

  const [inspectionInfo, setInspectionInfo] = useState<{
    identification: any;
    records: any[];
    summaryReport: any;
    [key: string]: any; // Add index signature
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
      if (
        response.data.data.identification === null ||
        response.data.data.summaryReport === null ||
        response.data.data.records.length === 0
      ) {
        toast.error("Report is still in progress. Please try again later.");
        navigate("/report");
        return;
      }
      setInspectionInfo(response.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (reportData: Section[]) => {
    setIsGenerating(true);
    const doc = new jsPDF();

    // Add logo
    const logoWidth = 60;
    const logoHeight = 15;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
    doc.addImage(Logo, "PNG", logoX, 10, logoWidth, logoHeight);

    let startY = 35;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;

    // Add title centered
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const title = "INSPECTION MANUAL REPORT";
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, startY);

    // Add date centered
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateText = `Date: ${currentDate}`;
    const dateWidth =
      (doc.getStringUnitWidth(dateText) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const dateX = (pageWidth - dateWidth) / 2;
    doc.text(dateText, dateX, 45); // Position below title

    startY = 55; // Increased to accommodate the new header layout

    reportData.forEach((section) => {
      // Removed the separate section title text

      // Add the table using jspdf-autotable
      autoTable(doc, {
        head: section.sectionTitle
          ? [
              [
                {
                  content: section.sectionTitle,
                  colSpan: 2,
                  styles: { halign: "center" },
                },
              ],
            ]
          : undefined,
        body: section.data.map((item) => [item.key, item.value]),
        startY: startY,
        margin: { left: margin },
        styles: {
          fontSize: 10,
          cellPadding: 5,
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
          halign: "left",
          valign: "middle",
          overflow: "linebreak",
          cellWidth: "auto",
          minCellHeight: 0,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          fontSize: 12,
          cellPadding: 8,
          halign: "center", // Center the section title
        },
        theme: "grid",
        columnStyles: {
          0: {
            cellWidth: usableWidth * 0.4,
            fontStyle: "bold",
          },
          1: {
            cellWidth: usableWidth * 0.6,
          },
        },
      });

      startY = (doc as any).lastAutoTable.finalY + 10;

      // Add new page if needed
      if (startY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        startY = 50; // Start lower on subsequent pages to account for header
      }
    });

    doc.save("inspection_manual_report.pdf");
    setIsGenerating(false);
  };

  const handleOnExport = () => {
    const reportData: Section[] = [];

    for (const section of reportMetaData) {
      const data: DataItem[] = [];
      for (const item of section.data) {
        if (item.keyInAPI) {
          const keys = item.keyInAPI.split(".");
          let value = inspectionInfo;
          for (const key of keys) {
            value = value ? value[key] : null;
          }
          data.push({ key: item.key, value: value ? String(value) : "N/A" });
        } else {
          const record = inspectionInfo.records
            .map((el) => el.records)
            .flat()
            .find((el: any) => el.pseudoName === item.pseudoName);
          const value = record?.boxValue || record?.flagValue || "N/A";
          let formattedValue = value;
          if (isDateString(value)) {
            const date = new Date(value);
            formattedValue = date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }
          data.push({ key: item.key, value: formattedValue || "" });
        }
      }
      reportData.push({ sectionTitle: section.title, data });
    }

    console.log(reportData);

    generatePDF(reportData);
  };

  const handleOnExportExcel = () => {
    // open new tab to this link : home {VITE_API_URL}/reporting/inspections/{planId}
    const homeRoute = import.meta.env.VITE_API_URL;
    window.open(`${homeRoute}/reporting/inspections/${reportId}`, "_blank");
  };

  useEffect(() => {
    fetchReport();
    if (!isAllowed(["report.view"], "and")) {
      navigate("/report");
    }
  }, [navigate, isAllowed]);

  useEffect(() => {
    const onBeforeUnload = (ev: Event) => {
      ev.preventDefault();
      ev.returnValue = true;
      return true;
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  if (!reportId) {
    return <Navigate to="/report" />;
  }

  if (loading) {
    return (
      <div className="text-center h-96 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2 w-full">
      <div className="w-full flex justify-end gap-4">
        {isAllowed(["report.feedback"], "and") && (
          <FeedbackModal planId={reportId} />
        )}
        {isAllowed(["report.approve"], "and") && (
          <ConfirmActionModal
            planId={reportId!}
            action="APPROVE"
            refresh={() => fetchReport()}
            buttonClassName={`bg-green-600 ${
              inspectionInfo.status === "APPROVED" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={inspectionInfo.status === "APPROVED"}
          />
        )}
        {isAllowed(["report.approve"], "and") && (
          <ConfirmActionModal
            planId={reportId!}
            action="REJECT"
            refresh={() => fetchReport()}
            buttonClassName={`bg-red-600 ${
              inspectionInfo.status === "REJECTED" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={inspectionInfo.status === "REJECTED"}
          />
        )}
        <Button onClick={handleOnExport}>
          {isGenerating ? "Generating..." : "Export PDF"}
        </Button>
        <Button onClick={handleOnExportExcel}>Export Excel</Button>
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
            Detailed Inspection Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identification">
          <IdentificationTab identification={inspectionInfo.identification} />
        </TabsContent>
        <TabsContent value="summary-report">
          <SummaryReport {...inspectionInfo.summaryReport} />
        </TabsContent>
        <TabsContent value="detailed-inspection-report-1">
          <DetailedReport report={inspectionInfo.records} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPage;
