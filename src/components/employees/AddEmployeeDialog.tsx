
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
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";

const departments = ["Operations", "Engineering", "Administration", "Finance"];
const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on-leave" },
];

const AddEmployeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  position: z.string().min(2, "Position is required"),
  department: z.string().min(2, "Department is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Phone is required"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["active", "inactive", "on-leave"], { required_error: "Status is required" }),
  joinDate: z.string().min(1, "Join date is required"),
  avatar: z.string().optional(),
});

type AddEmployeeFormValues = z.infer<typeof AddEmployeeSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<AddEmployeeFormValues>({
    resolver: zodResolver(AddEmployeeSchema),
    mode: "onChange",
    defaultValues: {
      status: "active",
    },
  });

  const onSubmit = (data: AddEmployeeFormValues) => {
    // For now, just log the data. You can handle the data as needed.
    console.log("New employee:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) reset();
      onOpenChange(open);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new employee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 pt-2">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <Input {...register("name")} placeholder="e.g. Jean Paul Mbarga" />
            {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Position</label>
            <Input {...register("position")} placeholder="e.g. Captain" />
            {errors.position && <span className="text-destructive text-xs">{errors.position.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Department</label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && <span className="text-destructive text-xs">{errors.department.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <Input {...register("email")} type="email" placeholder="e.g. jp.mbarga@ngamarine.com" />
            {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <Input {...register("phone")} placeholder="e.g. +237 6 77 88 99 00" />
            {errors.phone && <span className="text-destructive text-xs">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Location</label>
            <Input {...register("location")} placeholder="e.g. Douala Port" />
            {errors.location && <span className="text-destructive text-xs">{errors.location.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <span className="text-destructive text-xs">{errors.status.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Join Date</label>
            <Input {...register("joinDate")} type="date" />
            {errors.joinDate && <span className="text-destructive text-xs">{errors.joinDate.message}</span>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Avatar (optional, image url)</label>
            <Input {...register("avatar")} placeholder="Paste avatar image url (optional)" />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className="border-maritime-blue text-maritime-blue"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-maritime-blue hover:bg-maritime-ocean text-white"
            >
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
