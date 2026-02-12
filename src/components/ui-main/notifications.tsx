
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export const notify = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      action: (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      )
    });
  },

  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      action: (
        <div className="flex items-center">
          <XCircle className="h-5 w-5" />
        </div>
      )
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      action: (
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </div>
      )
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      action: (
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
      )
    });
  }
};
