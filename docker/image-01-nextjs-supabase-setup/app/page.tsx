import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserCog, UserX } from "lucide-react";

// Home page custom component
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              User Management System
            </h1>
            <p className="text-lg text-muted-foreground">
              A Next.js CRUD application demonstrating user management with Supabase and Drizzle ORM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Read Users</CardTitle>
                    <CardDescription>View all users</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse through all users in the database with detailed information displayed in a table.
                </p>
                <Link href="/users/read">
                  <Button className="w-full">View Users</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Create User</CardTitle>
                    <CardDescription>Add a new user</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a new user by entering their name and email address through a simple form.
                </p>
                <Link href="/users/create">
                  <Button className="w-full">Create User</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <UserCog className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Update User</CardTitle>
                    <CardDescription>Edit user details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Select an existing user and update their name or email address information.
                </p>
                <Link href="/users/update">
                  <Button className="w-full">Update User</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <UserX className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <CardTitle>Delete User</CardTitle>
                    <CardDescription>Remove a user</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete a user from the database with confirmation required.
                </p>
                <Link href="/users/delete">
                  <Button variant="destructive" className="w-full">Delete User</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-6 rounded-lg border bg-muted/50">
            <h2 className="font-semibold mb-2">Tech Stack</h2>
            <p className="text-sm text-muted-foreground">
              Built with Next.js 15, React 19, Supabase (Postgres), Drizzle ORM, shadcn/ui, Tailwind CSS, and lucide-react icons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
