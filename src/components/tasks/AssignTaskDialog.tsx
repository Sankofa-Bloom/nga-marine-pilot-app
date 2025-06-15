
import React, { useState } from "react";
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
import { useTaskAssignees } from "@/hooks/useTaskAssignees";
import { useAuth } from "@/contexts/AuthContext";
import { UserMinus, UserPlus, Loader2 } from "lucide-react";

type Task = {
  id: string;
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

type Member = {
  id: string;
  name?: string;
  email?: string;
};

// Mock team members list. In a real app, fetch from your team table.
const DEMO_MEMBERS: Member[] = [
  { id: "1", name: "Jean Paul Mbarga", email: "jean@example.com" },
  { id: "2", name: "Marie Douala", email: "marie@example.com" },
  { id: "3", name: "Port Operations Team", email: "portops@example.com" },
  { id: "4", name: "Technical Team", email: "tech@example.com" }
];

function AssignTaskDialog({
  open,
  onOpenChange,
  task
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}) {
  const { user } = useAuth();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  if (!task) return null;

  // Ensure string ID
  const taskId = String(task.id);
  const { assignees, loading, addAssignee, removeAssignee } = useTaskAssignees(taskId);

  // Map to prevent duplicates
  const assignedIds = assignees.map(a => a.member_id);

  // Only managers and admins can assign/remove (in real app: check from Supabase user roles!)
  const userIsManagerOrAdmin = user?.role === "manager" || user?.role === "admin";

  const handleAddAssignee = async () => {
    if (selectedMemberId && user?.id) {
      await addAssignee(selectedMemberId, user.id);
      setSelectedMemberId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign <span className="font-semibold">{task.title}</span> to one or more team members.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <div className="font-semibold mb-1 text-sm">Current Assignees:</div>
          {loading ? (
            <div className="flex items-center gap-2 text-maritime-anchor text-sm"><Loader2 className="animate-spin h-4 w-4" /> Loading...</div>
          ) : assignees.length === 0 ? (
            <div className="text-maritime-anchor text-sm">No team members assigned yet.</div>
          ) : (
            <ul className="space-y-2">
              {assignees.map(assignee => {
                const memberNameOrEmail =
                  assignee.profile?.name ||
                  DEMO_MEMBERS.find(m => m.id === assignee.member_id)?.name ||
                  assignee.member_id;
                return (
                  <li key={assignee.id} className="flex items-center justify-between bg-maritime-foam rounded px-2 py-1">
                    <span className="text-maritime-navy">{memberNameOrEmail}</span>
                    {userIsManagerOrAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeAssignee(assignee.id)}
                        disabled={loading}
                        className="ml-2"
                        title="Remove assignee"
                      >
                        <UserMinus className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {userIsManagerOrAdmin && (
          <div className="mb-4">
            <label className="block text-sm mb-1 font-semibold">Add Assignee</label>
            <div className="flex gap-2">
              <select
                className="rounded border px-3 py-2 w-full"
                value={selectedMemberId ?? ""}
                onChange={e => setSelectedMemberId(e.target.value)}
              >
                <option value="">Select member...</option>
                {DEMO_MEMBERS.filter(m => !assignedIds.includes(m.id)).map(member => (
                  <option value={member.id} key={member.id}>
                    {member.name} {member.email && `(${member.email})`}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAddAssignee}
                variant="dialogPrimary"
                disabled={!selectedMemberId || loading}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="dialogSecondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignTaskDialog;
