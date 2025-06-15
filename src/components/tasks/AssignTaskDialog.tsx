
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

function AssignTaskDialog({ open, onOpenChange, task }: { open: boolean; onOpenChange: (open: boolean) => void; task: Task | null }) {
  if (!task) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign <span className="font-semibold">{task.title}</span> to a team member. (Feature coming soon)
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4 text-sm">
          Current assignee: <b>{task.assignee}</b>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignTaskDialog;
