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
import { Label } from "@/components/ui/label";

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, email: string, role: "admin" | "manager" | "employee", password: string) => Promise<boolean>;
  loading: boolean;
};

export default function AddUserDialog({
  open,
  onOpenChange,
  onAdd,
  loading,
}: AddUserDialogProps) {
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
      <DialogContent>
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">Add New User</DialogTitle>
          <DialogDescription>
            Enter user details and select their role.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-black mb-1 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              value={name}
              className="border-black"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-black mb-1 block">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              value={email}
              className="border-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-black mb-1 block">
              Role
            </Label>
            <select
              id="role"
              className="w-full border border-black bg-background px-3 py-2 rounded text-sm focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <Label htmlFor="password" className="text-black mb-1 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              className="border-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm" className="text-black mb-1 block">
              Confirm Password
            </Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              className="border-black"
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="px-6 py-4 flex flex-row justify-end gap-2">
          <Button onClick={handleAdd} disabled={loading} className="bg-maritime-blue hover:bg-maritime-ocean text-white">
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
