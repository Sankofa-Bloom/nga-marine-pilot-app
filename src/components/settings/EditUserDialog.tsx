
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SystemUser } from "@/hooks/useSystemUsers";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SystemUser | null;
  onEdit: (userId: string, name: string, role: "admin" | "manager" | "employee") => Promise<boolean>;
  loading: boolean;
};

export default function EditUserDialog({ open, onOpenChange, user, onEdit, loading }: EditUserDialogProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<"admin" | "manager" | "employee">(user?.role ?? "employee");

  useEffect(() => {
    setName(user?.name ?? "");
    setRole(user?.role ?? "employee");
  }, [user, open]);

  if (!user) return null;

  const handleEdit = async () => {
    const ok = await onEdit(user.id, name, role);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User - {user.email}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select
            className="w-full border px-2 py-2 rounded"
            value={role}
            onChange={e => setRole(e.target.value as any)}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleEdit} disabled={loading} className="bg-maritime-blue hover:bg-maritime-ocean">
            Save Changes
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
