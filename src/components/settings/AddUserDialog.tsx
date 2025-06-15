
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "employee">("employee");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
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
            className="w-full border px-2 py-2 rounded"
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
        <DialogFooter>
          <Button onClick={handleAdd} disabled={loading} className="bg-maritime-blue hover:bg-maritime-ocean">
            Add User
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
