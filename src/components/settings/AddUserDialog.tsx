
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, email: string, role: "admin" | "manager" | "employee", password: string) => Promise<boolean>;
  loading: boolean;
};

export default function AddUserDialog({ open, onOpenChange, onAdd, loading }: AddUserDialogProps) {
  // Debug log to ensure component mounts and open state is received
  console.log("AddUserDialog rendered", { open });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "employee">("employee");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (open) {
      console.log("AddUserDialog: Dialog is now open");
    }
  }, [open]);

  const handleAdd = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    const ok = await onAdd(name, email, role, password);
    if (ok) {
      setName("");
      setEmail("");
      setRole("employee");
      setPassword("");
      setConfirm("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!border-4 !border-red-600 !bg-yellow-100"
        style={{ minHeight: 200 }}
      >
        {/* VISUAL DEBUG */}
        <div className="absolute top-2 right-2 bg-red-200 px-2 py-1 rounded text-xs text-red-800 z-50">
          Debug: AddUserDialog
        </div>
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">Add New User</DialogTitle>
          <DialogDescription>
            Enter user details and select their role.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <select
            className="w-full border border-input bg-background px-3 py-2 rounded text-sm focus:outline-none"
            value={role}
            onChange={e => setRole(e.target.value as any)}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>
        <DialogFooter className="bg-muted px-6 py-4 rounded-b-lg flex flex-row justify-end gap-2">
          <Button onClick={handleAdd} disabled={loading} className="bg-maritime-blue hover:bg-maritime-ocean">
            Add User
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
