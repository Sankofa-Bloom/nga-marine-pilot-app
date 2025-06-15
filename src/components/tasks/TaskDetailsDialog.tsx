
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
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

function TaskDetailsDialog({ open, onOpenChange, task }: { open: boolean; onOpenChange: (open: boolean) => void; task: Task | null }) {
  if (!task) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            {task.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm text-maritime-navy">
          <div><span className="font-semibold">Assignee:</span> {task.assignee}</div>
          <div><span className="font-semibold">Vessel:</span> {task.vessel}</div>
          <div><span className="font-semibold">Priority:</span> {task.priority}</div>
          <div><span className="font-semibold">Status:</span> {task.status}</div>
          <div><span className="font-semibold">Due Date:</span> {task.dueDate}</div>
          <div><span className="font-semibold">Progress:</span> {task.progress}%</div>
        </div>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetailsDialog;
