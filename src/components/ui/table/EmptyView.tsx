import { cn } from "@/lib/utils";
import { Button } from "../base/button";

/**
 * Renders an empty view component with an optional message and minimum height.
 *
 * @param message - The message to be displayed in the empty view.
 * @param minHeight - The minimum height of the empty view. Defaults to 'min-h-[60vh]'.
 * @param buttonLabel - The label of the button to be displayed in the empty view.
 * @param buttonAction - The action to be performed when the button is clicked.
 * @returns The rendered empty view component.
 */
export default function EmptyView({
  message,
  description,
  icon,
  minHeight,
  buttonLabel,
  buttonAction,
}: {
  message: string;
  description?: string;
  icon?: React.ReactNode;
  minHeight?: string;
  buttonLabel?: string;
  buttonAction?: () => void;
}) {
  return (
    <div className="w-full">
      <div
        className={cn(
          minHeight ? minHeight : "min-h-[60vh]",
          "bg-white rounded-lg mt-6 py-6 flex flex-col items-center justify-center gap-2"
        )}
      >
        {icon && (
          <div className="bg-gray-100 border border-gray-300 text-gray-400 rounded-full p-10">
            {icon}
          </div>
        )}
        <h1 className="text-xl font-semibold text-gray-700">{message}</h1>
        {description && (
          <p className="text-gray-500 text-center px-4 max-w-xs">{description}</p>
        )}
        {buttonLabel && buttonAction && (
          <Button onClick={buttonAction} className="text-white rounded-xl">
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
