import ErrorIcon from "../icons/ErrorIcon";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ErrorIcon />
        </div>
        <div className="ml-2">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
