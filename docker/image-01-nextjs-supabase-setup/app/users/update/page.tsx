"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import User from "@/lib/types/User";

// Custom Update user page component
export default function UpdateUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    const user = users.find((u) => u.id === userId);
    
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError("Please select a user to update");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/users/${selectedUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess(true);
      await fetchUsers();
    } 
    catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } 
    finally {
      setLoading(false);
    }
  };

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
          <CardTitle>Update User</CardTitle>
          <CardDescription>Select a user and update their information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
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

            {selectedUserId && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                User updated successfully!
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !selectedUserId}
              className="w-full"
            >
              {loading ? "Updating..." : "Update User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
