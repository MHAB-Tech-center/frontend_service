import NewRoleModal from "@/components/modals/new-role";
import IconButton from "@/components/ui/IconButton";
import { Column } from "@/components/ui/table/Table";
import TableWrapper from "@/components/ui/table/TableWrapper";
import { getRoles } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import { EyeIcon, FolderMinusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const rolesColumns: Column[] = [
  {
    title: "Role Name",
    key: "rtbRoleName",
    sortable: true,
  },
  {
    title: "Description",
    key: "roleDescription",
    sortable: true,
  },
  {
    title: "System Features",
    key: "systemFeatures",
    sortable: true,
    Element: ({ row }) => (
      <span>{row.systemFeatures.split(",").slice(1).join(", ")}</span>
    ),
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
        <IconButton
          onClick={() => handleAction(row.id, "delete")}
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

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await getRoles();
      setRoles(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <TableWrapper
        title={"Roles"}
        columns={rolesColumns}
        data={roles}
        className="min-w-[800px] overflow-x-auto"
        emptyViewProps={{
          icon: <FolderMinusIcon className="h-10 w-10" />,
          message: "No Roles Yet?",
          description: "Add new roles to start managing them.",
          buttonLabel: "New Role",
          buttonAction: () => {
            // navigate("/expenses/new");
            console.log("New Role");
          },
        }}
        actions={[<NewRoleModal />]}
        loading={loading}
        //   onRowClick={(row) => navigate(`${row.id}`)}
        // reset={reset}
        // filters={tableFilters}
        // errorFetching={errorFetchingCases}
      />
    </div>
  );
};

export default RolesPage;
