import { Button } from "@/components/ui/base/button";
import Dialog from "@/components/ui/Dialog";
import { getErrorMessage } from "@/lib/utils";
import React from "react";
import { toast } from "react-toastify";
import { takeAction } from "@/hooks/useApi";

interface ConfirmActionModalProps {
  planId: string;
  action: "APPROVE" | "REJECT";
  refresh?: () => void;
  buttonClassName?: string;
  disabled?: boolean;
}

const ConfirmActionModal = ({
  planId,
  action,
  refresh,
  buttonClassName,
  disabled = false,
}: ConfirmActionModalProps) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await takeAction(planId, action);
      toast.success(`Report ${action.toLowerCase()}d successfully`);
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
      trigger={
        <Button 
          className={buttonClassName || `${
            action === "APPROVE" ? "bg-green-600" : "bg-red-600"
          } text-white rounded-md`}
          disabled={disabled}
        >
          {action}
        </Button>
      }
      title={`Confirm ${action}`}
      footer={
        <div className="flex-1 flex justify-center gap-4 flex-wrap px-4">
          <Button
            className="w-full max-w-[200px] bg-gray-400 text-white"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={`w-full max-w-[200px] ${
              action === "APPROVE" ? "bg-green-600" : "bg-red-600"
            } text-white`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? `${action}ing...` : action}
          </Button>
        </div>
      }
    >
      <div className="p-4 text-center">
        <p>Are you sure you want to {action.toLowerCase()} this report?</p>
        <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
      </div>
    </Dialog>
  );
};

export default ConfirmActionModal; 