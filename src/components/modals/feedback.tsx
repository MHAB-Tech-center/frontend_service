/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/base/button";
import Dialog from "@/components/ui/Dialog";
import { addFeedback } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { ComplexInput } from "../ui/Input";

interface FeedbackModalProps {
  planId: string;
}

const FeedbackModal = (props: FeedbackModalProps) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    review: "",
    planId: props.planId,
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await addFeedback(formData.planId, formData.review);
      toast.success("Feedback sent successfully");
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
        <Button className="text-black rounded-xl !bg-primary-100 hover:!bg-primary-200 flex flex-col h-fit">
          <span className="flex items-center">
            <MessageCircle className="w-6 h-6" />
            &nbsp; Feedback
          </span>
          {formData.review && (
            <span className="text-xs text-gray-400 flex items-center gap-2">
              <span className="h-2 w-2 bg-orange-300 rounded-full" />
              <span>unsaved feedback</span>
            </span>
          )}
        </Button>
      }
      title="Send Feedback to the report"
      footer={
        <div className="flex-1 flex justify-center gap-4 flex-wrap px-4">
          <Button
            className="w-full max-w-[200px] bg-primary text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="form flex-1">
          <form className="flex flex-col gap-4">
            <ComplexInput
              id="feedback"
              type="textarea"
              placeholder="Enter your feedback here"
              value={formData.review}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, review: e.target.value }))
              }
            />
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default FeedbackModal;
