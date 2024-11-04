/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { Column } from "@/components/ui/table/Table";
import TableWrapper from "@/components/ui/table/TableWrapper";
import { getAllInspections } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { EyeIcon, PencilIcon } from "lucide-react";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType | React.ElementType;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  className,
  ...props
}) => {
  return (
    <button className={`p-2 rounded ${className}`} {...props}>
      <Icon className="h-5 w-5" />
    </button>
  );
};

const inspectorsColumns: Column[] = [
  {
    title: "Mine Site",
    key: "minesiteInfo.name",
    sortable: true,
    Element: ({ row }) => <span>{row.minesiteInfo.name}</span>,
  },
  {
    title: "Inspector",
    key: "inspectorInfo",
    sortable: true,
    Element: ({ row }) => (
      <span>{`${row.inspectorInfo.firstName} ${row.inspectorInfo.lastName}`}</span>
    ),
  },
  // {
  //   title: "District",
  //   key: "district",
  //   sortable: true,
  //   Element: ({ row }) => <span>{row.district}</span>,
  // },
  {
    title: "Inspection Date",
    key: "endDate",
    sortable: true,
    Element: ({ row }) => (
      <span>{new Date(row.endDate).toLocaleDateString()}</span>
    ),
  },
  {
    title: "Status",
    key: "status",
    sortable: true,
    Element: ({ row }) => <span>{row.status}</span>,
  },
  {
    title: "Action",
    key: "action",
    sortable: false,
    Element: ({ row }) => (
      <>
        <IconButton
          onClick={() => handleAction(row.id, "view")}
          icon={EyeIcon}
          className="text-blue-500 "
        />
        <IconButton
          onClick={() => handleAction(row.id, "edit")}
          icon={PencilIcon}
          className="text-green-500 "
        />
        {/* <IconButton
          onClick={() => handleAction(row.inspector_id, "delete")}
          icon={TrashIcon}
          className="text-red-500 "
        /> */}
      </>
    ),
  },
];

const handleAction = (inspectionId: string, action: string) => {
  // // Implement action handler logic here
  // console.log(`Action triggered for inspector ID: ${inspectorId} - ${action}`);
  if (action === "view") {
    console.log(`Viewing inspector ID: ${inspectionId}`);
    window.location.href = `/report/${inspectionId}`;
  } else if (action === "edit") {
    console.log(`Editing inspector ID: ${inspectionId}`);
  }
};

interface Inspection {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  inspectorInfo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    phoneNumber: string;
    nationalId: string;
    province: string;
    district: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  minesiteInfo: {
    id: string;
    name: string;
    code: string;
    province: string;
    district: string;
    createdAt: string;
    updatedAt: string;
  };
}

const Reports = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const navigate = useNavigate();

  // filters
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const { data } = await getAllInspections();
      setInspections(data.data);
      toast.success("Inspections fetched successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  const { isAllowed } = useAuth();

  useEffect(() => {
    const provinces = inspections.map((inspection) =>
      inspection.minesiteInfo.province.toLowerCase()
    );
    const districts = inspections.map((inspection) =>
      inspection.minesiteInfo.district.toLowerCase()
    );
    setProvinces(Array.from(new Set(provinces)));
    setDistricts(Array.from(new Set(districts)));
  }, [inspections]);

  useEffect(() => {
    fetchInspections();
  }, []);

  const tableFilters = (
    originalData: Inspection[],
    sortedData: Inspection[],
    setData: React.Dispatch<React.SetStateAction<Inspection[]>>,
    reset: () => void
  ) => {
    const updateData = () => {
      const filteredData = originalData.filter((inspection) => {
        if (!selectedProvince || selectedProvince === "all") {
          if (!selectedDistrict || selectedDistrict === "all") return true;
          return inspection.minesiteInfo.district.toLowerCase() === selectedDistrict.toLowerCase();
        }
        if (!selectedDistrict || selectedDistrict === "all") {
          return inspection.minesiteInfo.province.toLowerCase() === selectedProvince.toLowerCase();
        }
        return inspection.minesiteInfo.province.toLowerCase() === selectedProvince.toLowerCase() && 
               inspection.minesiteInfo.district.toLowerCase() === selectedDistrict.toLowerCase();
      });
      setData(filteredData);
    }

    return (
      <>
        <Select
          onValueChange={(value) => {
            setSelectedProvince(value);
            updateData();
          }}
          value={selectedProvince}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map((province) => (
              <SelectItem key={province} value={province} className="capitalize">
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            setSelectedDistrict(value);
            updateData();
          }}
          value={selectedDistrict}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((district) => (
              <SelectItem key={district} value={district} className="capitalize">
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    );
  };

  return (
    <div>
      {/* <div className="w-full flex justify-end">
        <Button>Export to PDF</Button>
      </div> */}
      <TableWrapper
        title={"Inspection Reports Submitted"}
        columns={inspectorsColumns}
        data={inspections}
        filterableByDate
        dateKey="created_at"
        className="min-w-[800px] overflow-x-auto"
        // actions={[<NewInspectorModal />]}
        loading={loading}
        onRowClick={(row) => {
          if (isAllowed(["report.view"], "and")) {
            navigate(`/report/${row.id}`);
          }
        }}
        // emptyViewProps={{
        //   icon: <FolderMinusIcon className="h-10 w-10" />,
        //   message: "No Inspectors Yet?",
        //   description: "Add new inspectors to start managing them.",
        //   buttonLabel: "New Inspector",
        //   buttonAction: () => {
        //     // navigate("/expenses/new");
        //     console.log("New Inspector");
        //   },
        // }}
        // reset={reset}
        filters={tableFilters}
        // errorFetching={errorFetchingCases}
      />
    </div>
  );
};

export default Reports;
