
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Assignee = {
  id: string;
  task_id: string;
  member_id: string;
  assigned_by: string | null;
  assigned_at: string;
  profile?: {
    name?: string;
    email?: string;
  };
};

export function useTaskAssignees(taskId: string | undefined | null) {
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  // Helper to fetch profiles for given member_ids
  const loadProfiles = async (memberIds: string[]) => {
    if (memberIds.length === 0) return {};
    const { data, error } = await supabase
      .from("profiles")
      .select("id,name,email")
      .in("id", memberIds);

    if (error) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
      return {};
    }

    // Create a map id -> profile
    const profilesMap: Record<string, { name?: string; email?: string }> = {};
    (data ?? []).forEach((row) => {
      profilesMap[row.id] = {
        name: row.name ?? undefined,
        email: row.email ?? undefined,
      };
    });
    return profilesMap;
  };

  // Fetch assignees for this task
  const fetchAssignees = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(undefined);

    // 1. Get assignees (without attempted join)
    const { data, error } = await supabase
      .from("assignees")
      .select("*")
      .eq("task_id", taskId);

    if (error) {
      setError(error);
      toast({
        title: "Error",
        description: "Failed to fetch assignees: " + error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 2. Pull member_ids to fetch profiles
    const memberIds = Array.from(new Set((data ?? []).map(a => a.member_id)));
    const profilesMap = await loadProfiles(memberIds);

    // 3. Merge profile data
    const withProfiles: Assignee[] = (data ?? []).map(a => ({
      ...a,
      profile: profilesMap[a.member_id] ?? undefined,
    }));

    setAssignees(withProfiles);
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    fetchAssignees();
  }, [fetchAssignees]);

  // Add an assignee
  const addAssignee = async (member_id: string, assigned_by: string) => {
    if (!taskId) return;
    setLoading(true);
    const { error } = await supabase
      .from("assignees")
      .insert({
        task_id: taskId,
        member_id,
        assigned_by,
      });

    if (error) {
      toast({
        title: "Could not assign member",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assignee added",
        description: "Member assigned to task",
      });
      await fetchAssignees();
    }
    setLoading(false);
  };

  // Remove assignee
  const removeAssignee = async (assigneeId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("assignees")
      .delete()
      .eq("id", assigneeId);

    if (error) {
      toast({
        title: "Could not remove assignee",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assignee removed",
        description: "Member removed from task",
      });
      await fetchAssignees();
    }
    setLoading(false);
  };

  return { assignees, loading, error, addAssignee, removeAssignee, refetch: fetchAssignees };
}
