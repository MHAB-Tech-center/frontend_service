import { rolesState } from "@/atoms";
import { Button } from "@/components/ui/base/button";
import Dialog from "@/components/ui/Dialog";
import { updateRole } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import React from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/base/select";

interface AssignRolesModalProps {
  staffId: string;
  previousRole?: string;
  refresh?: () => void;
}

const AssignRolesModal = ({
  staffId,
  refresh,
  previousRole,
}: AssignRolesModalProps) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    rmbRoleId: previousRole,
    rmbStaffId: staffId,
  });
  const [loading, setLoading] = React.useState(false);
  const [roles] = useRecoilState(rolesState);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateRole(formData);
      toast.success("Role assigned successfully");
      setOpen(false);
      refresh?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={setOpen}
      contentClassName="!max-w-lg"
      trigger={<Button className="text-white rounded-md">Change Role</Button>}
      title="Assign Role"
      footer={
        <div className="flex-1 flex justify-center gap-4 flex-wrap px-4">
          <Button
            className="w-full max-w-[200px] bg-primary text-white"
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.rmbRoleId ||
              formData.rmbRoleId === previousRole
            }
          >
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="form flex-1">
          <form className="flex flex-col gap-4">
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, rmbRoleId: value })
              }
              defaultValue={formData.rmbRoleId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.rtbRoleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AssignRolesModal;
