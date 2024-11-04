import NewInspectorModal from "@/components/modals/new-inspector";
import { Column } from "@/components/ui/table/Table";
import TableWrapper from "@/components/ui/table/TableWrapper";
import { getAllInspectors } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { EyeIcon, FolderMinusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
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
    title: "Names",
    key: "names",
    sortable: true,
    Element: ({ row }) => <span>{`${row.firstName} ${row.lastName}`}</span>,
  },
  {
    title: "Email",
    key: "email",
    sortable: true,
  },
  {
    title: "Phone",
    key: "phoneNumber",
    sortable: true,
  },
  {
    title: "Title",
    key: "title",
    sortable: true,
    Element: ({ row }) => <span>{row.title || "Inspector"}</span>,
  },
  {
    title: "Inspector ID",
    key: "nationalId",
    sortable: true,
  },
  {
    title: "Action",
    key: "action",
    sortable: false,
    Element: ({ row }) => (
      <>
        <IconButton
          onClick={() => handleAction(row.inspector_id, "view")}
          icon={EyeIcon}
          className="text-blue-500 "
        />
        <IconButton
          onClick={() => handleAction(row.inspector_id, "edit")}
          icon={PencilIcon}
          className="text-green-500 "
        />
        <IconButton
          onClick={() => handleAction(row.inspector_id, "delete")}
          icon={TrashIcon}
          className="text-red-500 "
        />
      </>
    ),
  },
];

const handleAction = (inspectorId: string, action: string) => {
  // Implement action handler logic here
  console.log(`Action triggered for inspector ID: ${inspectorId} - ${action}`);
};

const InspectorsPage = () => {
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAllowed } = useAuth();

  const fetchInspectors = async () => {
    setLoading(true);
    try {
      const { data } = await getAllInspectors();
      setInspectors(data);
      toast.success("Inspectors fetched successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectors();
  }, []);

  return (
    <div>
      <TableWrapper
        title={"Inspectors"}
        columns={inspectorsColumns}
        data={inspectors}
        filterableByDate
        dateKey="created_at"
        className="min-w-[800px] overflow-x-auto"
        //   onRowClick={(row) => navigate(`${row.id}`)}
        emptyViewProps={{
          icon: <FolderMinusIcon className="h-10 w-10" />,
          message: "No Inspectors Yet?",
          description: "Add new inspectors to start managing them.",
          buttonLabel: "New Inspector",
          buttonAction: () => {
            // navigate("/expenses/new");
            console.log("New Inspector");
          },
        }}
        actions={[
          isAllowed(["inspectors.invite"], "and") && <NewInspectorModal />,
        ]}
        loading={loading}
        // reset={reset}
        // filters={tableFilters}
        // errorFetching={errorFetchingCases}
      />
    </div>
  );
};

export default InspectorsPage;
