"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import User from "@/lib/types/User";

// Delete user custom page component
export default function DeleteUserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (res.ok) {
        setUsers(data.data);
      }
    } 
    catch (err) {
      console.error("Error fetching users:", err);
    } 
    finally {
      setFetchingUsers(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setConfirmDelete(false);
    setError(null);
    setSuccess(false);
  };

  const handleDelete = async () => {
    if (!selectedUserId) {
      setError("Please select a user to delete");
      return;
    }

    if (!confirmDelete) {
      setError("Please confirm deletion by checking the confirmation box");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/users/${selectedUserId}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      setSuccess(true);
      setSelectedUserId("");
      setConfirmDelete(false);

      setTimeout(() => {
        router.push("/users/read");
      }, 1500);
    } 
    catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } 
    finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delete User</CardTitle>
          <CardDescription>Permanently delete a user from the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Select User</Label>
              {fetchingUsers ? (
                <p className="text-sm text-muted-foreground">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users available</p>
              ) : (
                <select
                  id="user-select"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={selectedUserId}
                  onChange={(e) => handleUserSelect(e.target.value)}
                >
                  <option value="">-- Select a user --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedUser && (
              <>
                <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-destructive">Warning</p>
                      <p className="text-sm text-destructive/90 mt-1">
                        You are about to delete the following user. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="ml-7 mt-3 space-y-1">
                    <p className="text-sm">
                      <strong>Name:</strong> {selectedUser.name}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p className="text-sm">
                      <strong>ID:</strong> <span className="font-mono text-xs">{selectedUser.id}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-md border">
                  <input
                    type="checkbox"
                    id="confirm"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="confirm" className="cursor-pointer font-normal">
                    I understand that this action is permanent and cannot be undone
                  </Label>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 text-sm">
                User deleted successfully! Redirecting...
              </div>
            )}

            <Button
              onClick={handleDelete}
              disabled={loading || !selectedUserId || !confirmDelete}
              variant="destructive"
              className="w-full"
            >
              {loading ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}