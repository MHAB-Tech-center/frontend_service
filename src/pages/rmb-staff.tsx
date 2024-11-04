import AssignRolesModal from "@/components/modals/assign-roles";
import NewStaffModal from "@/components/modals/new-staff";
import { Column } from "@/components/ui/table/Table";
import TableWrapper from "@/components/ui/table/TableWrapper";
import { getAllRMBStaff } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { FolderMinusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RMBStaffColumns: Column[] = [
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
    Element: ({ row }) => <span>{row.rmbRole?.rtbRoleName || "Admin"}</span>,
  },
  {
    title: "Role",
    key: "role",
    sortable: true,
    Element: ({ row }) => (
      <span>{row.rmbRole?.roleDescription || "View Only"}</span>
    ),
  },
  {
    title: "National ID",
    key: "nationalId",
    sortable: true,
  },
  {
    title: "Action",
    key: "action",
    sortable: false,
    Element: ({ row, refresh }) => (
      <>
        <AssignRolesModal
          staffId={row.id}
          refresh={refresh}
          previousRole={row.rmbRole?.id}
        />
      </>
    ),
  },
];

// const handleAction = (id: string, action: string) => {
//   // Implement action handler logic here
//   console.log(`Action triggered for inspector ID: ${id} - ${action}`);
// };

const RMBStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAllowed } = useAuth();
  const navigate = useNavigate();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data } = await getAllRMBStaff();
      setStaff(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    if (!isAllowed(["rmb.view"], "and")) {
      navigate("/");
    }
  }, [navigate, isAllowed]);

  return (
    <div>
      <TableWrapper
        title={"RMB Staff"}
        columns={RMBStaffColumns}
        data={staff}
        className="min-w-[800px] overflow-x-auto"
        emptyViewProps={{
          icon: <FolderMinusIcon className="h-10 w-10" />,
          message: "No Staff Yet?",
          description: "Add new staff to start managing them.",
          buttonLabel: "New Staff",
          buttonAction: () => {
            console.log("New Staaff");
          },
        }}
        actions={[
          isAllowed(["rmb.invite"], "and") && <NewStaffModal />,
        ]}
        loading={loading}
        refresh={fetchStaff}
        // reset={reset}
        // filters={tableFilters}
        // errorFetching={errorFetchingCases}
      />
    </div>
  );
};

export default RMBStaffPage;
