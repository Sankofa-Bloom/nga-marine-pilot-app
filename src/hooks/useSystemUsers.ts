import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type SystemUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "admin" | "manager" | "employee";
  status: "active" | "inactive";
  lastLogin: string | null;
};

export function useSystemUsers() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    // Fetch users with their profile and role (assume at least one role per user)
    const { data: profileRows, error } = await supabase
      .from("profiles")
      .select("id,name,email")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Collect user_ids for roles lookup
    const userIds = profileRows.map((p: any) => p.id);

    // Fetch roles for each user
    let rolesMap: Record<string, "admin" | "manager" | "employee"> = {};
    if (userIds.length > 0) {
      const { data: rolesRows } = await supabase
        .from("user_roles")
        .select("user_id,role")
        .in("user_id", userIds);

      for (const row of rolesRows || []) {
        rolesMap[row.user_id] = row.role;
      }
    }

    // In this example, we will not handle status or lastLogin (no such cols)
    const loadedUsers: SystemUser[] =
      profileRows.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        role: rolesMap[p.id] || "employee", // Default is employee
        status: "active", // Optional: implement 'status' if available
        lastLogin: null    // Optional: implement 'lastLogin' if available
      })) || [];

    setUsers(loadedUsers);
    setLoading(false);
  }, []);

  // Add a new user (signup + insert role)
  const addUser = async (name: string, email: string, role: "admin" | "manager" | "employee", password: string) => {
    setLoading(true);
    // 1. Create user in supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    // 2. Wait for user to confirm email before setting role
    if (!data.user) {
      toast({ 
        title: "User created, pending email confirmation.",
        description: "User will show up after email is confirmed.",
        variant: "default", // changed from "success" to "default"
      });
      setLoading(false);
      return true;
    }

    // 3. Add user_roles
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: data.user.id,
      role,
    });

    if (roleError) {
      toast({
        title: "Failed to set user role",
        description: roleError.message,
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    toast({
      title: "User added",
      description: "User has been created.",
      variant: "default", // changed from "success" to "default"
    });
    await fetchUsers();
    setLoading(false);
    return true;
  };

  // Edit user info and role
  const editUser = async (userId: string, name: string, role: "admin" | "manager" | "employee") => {
    setLoading(true);
    // 1. Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", userId);

    // 2. Update or insert user_roles
    // Upsert style: delete and re-insert for simplicity
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });

    if (profileError || deleteError || insertError) {
      toast({
        title: "Update failed",
        description:
          profileError?.message ||
          deleteError?.message ||
          insertError?.message ||
          "Unknown error",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    toast({
      title: "User updated",
      description: "User profile and role have been updated.",
      variant: "default", // changed from "success" to "default"
    });
    await fetchUsers();
    setLoading(false);
    return true;
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    addUser,
    editUser,
    reload: fetchUsers,
  };
}
