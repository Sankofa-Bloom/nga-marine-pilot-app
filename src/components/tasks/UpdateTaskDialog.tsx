
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Task = {
  id: number;
  title: string;
  description: string;
  assignee: string;
  vessel: string;
  priority: string;
  status: string;
  dueDate: string;
  progress: number;
  category: string;
};

function UpdateTaskDialog({ open, onOpenChange, task }: { open: boolean; onOpenChange: (open: boolean) => void; task: Task | null }) {
  if (!task) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Update information for <b>{task.title}</b>. (Feature coming soon)
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="dialogSecondary">Cancel</Button>
          </DialogClose>
          <Button variant="dialogPrimary" disabled>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateTaskDialog;
