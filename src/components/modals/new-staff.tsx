import { Button } from "@/components/ui/base/button";
import Dialog from "@/components/ui/Dialog";
import { inviteRMBStaff } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { ComplexInput } from "../ui/Input";

const NewStaffModal = () => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await inviteRMBStaff(formData.email);
      toast.success("RMB Staff invited successfully");
      setOpen(false);
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
      trigger={
        <Button className="text-white rounded-xl">
          <PlusIcon className="w-6 h-6" />
          &nbsp;&nbsp; Add New Staff
        </Button>
      }
      title="Invite New Staff"
      footer={
        <div className="flex-1 flex justify-center gap-4 flex-wrap px-4">
          <Button
            className="w-full max-w-[200px] bg-primary text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Inviting..." : "Invite"}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="form flex-1">
          <form className="flex flex-col gap-4">
            <ComplexInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default NewStaffModal;
