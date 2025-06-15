
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Briefcase, Building2, Circle, Calendar } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  avatar?: string;
}

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const statusMap: Record<Employee["status"], { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-500" },
  inactive: { label: "Inactive", color: "bg-red-500" },
  "on-leave": { label: "On Leave", color: "bg-yellow-500" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  if (!employee) return null;

  const statusStyle = statusMap[employee.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-2">
          <Avatar className="w-20 h-20 mb-2">
            {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
            <AvatarFallback className="bg-maritime-blue text-white text-2xl">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="text-xl font-semibold text-maritime-navy">{employee.name}</div>
            <div className="text-maritime-anchor">{employee.position}</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`flex items-center justify-center w-3 h-3 rounded-full ${statusStyle.color}`}></span>
            <span className="text-sm text-gray-700">{statusStyle.label}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mt-3 px-2">
          <div className="flex items-center gap-2 text-maritime-navy">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">Department:</span>
            <span>{employee.department}</span>
          </div>
          <div className="flex items-center gap-2 text-maritime-navy">
            <Mail className="w-4 h-4" />
            <span className="font-medium">Email:</span>
            <span className="break-all">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-maritime-navy">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Phone:</span>
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-maritime-navy">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Location:</span>
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center gap-2 text-maritime-navy">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Joined:</span>
            <span>{formatDate(employee.joinDate)}</span>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-maritime-blue text-maritime-blue"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ViewEmployeeDialog;
