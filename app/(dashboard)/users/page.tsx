// app/(dashboard)/users/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";
import {
  TableHeader,
  TableBody,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  Search } from "lucide-react";
import EditRoleDialog from "@/components/Users/UserDialogs/EditRoleDialog";
import DeleteUserDialog from "@/components/Users/UserDialogs/DeleteUserDialog";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Profile = Tables<"profiles">;
type Role = Tables<"roles">;
type UserRole = Tables<"user_roles">;

// Combined user type for UI
type UserRow = {
  profile: Profile;
  role?: Role | null;
  userRole?: UserRole | null;
};

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "admin" | "student" | "sells"
  >("all");

  // fetch data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [
        { data: profilesData },
        { data: rolesData },
        { data: userRolesData },
      ] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("roles").select("*"),
        supabase.from("user_roles").select("*"),
      ]);
      setProfiles((profilesData as Profile[]) || []);
      setRoles((rolesData as Role[]) || []);
      setUserRoles((userRolesData as UserRole[]) || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Build rows by linking profile -> user_role -> role
  const rows: UserRow[] = useMemo(() => {
    return profiles.map((p) => {
      const ur = userRoles.find((r) => r.user_id === p.user_id) ?? null;
      const role = ur ? roles.find((rl) => rl.id === ur.role_id) ?? null : null;
      return { profile: p, role: role ?? null, userRole: ur ?? null };
    });
  }, [profiles, roles, userRoles]);

  // Filter + search
  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const name = r.profile.name ?? "";
      const email = r.profile.email ?? "";
      if (!(name.toLowerCase().includes(q) || email.toLowerCase().includes(q)))
        return false;
    }
    if (roleFilter !== "all") {
      const wanted =
        roleFilter === "admin"
          ? "admin"
          : roleFilter === "student"
          ? "student"
          : "sells";
      // compare with role.name (if available)
      if (!r.role || r.role.name?.toLowerCase() !== wanted.toLowerCase())
        return false;
    }
    return true;
  });

  // update role locally after edit
  const handleLocalRoleUpdate = (user_id: string, newRoleId: number | null) => {
    // update userRoles and optionally roles mapping
    setUserRoles((prev) => {
      const exists = prev.find((u) => u.user_id === user_id);
      if (exists) {
        return prev.map((u) =>
          u.user_id === user_id ? { ...u, role_id: newRoleId } : u
        );
      } else {
        // create a new user_roles row-like object (id is unknown), but for UI we can push a temp
        const temp: UserRole = { id: Date.now(), role_id: newRoleId, user_id };
        return [temp, ...prev];
      }
    });
    // Optionally refresh roles mapping from server, but not necessary for optimistic UI
  };

  // delete local after deletion
  const handleLocalDelete = (user_id: string) => {
    setProfiles((prev) => prev.filter((p) => p.user_id !== user_id));
    setUserRoles((prev) => prev.filter((ur) => ur.user_id !== user_id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-right">إدارة المستخدمين</h1>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface rounded-md px-2 py-1">
            <Search className="w-4 h-4 ml-2 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[220px] text-right"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as "all" | "admin" | "student" | "sells")}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="sells">Sells</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setRoleFilter("all");
            }}
          >
            إعادة تعيين
          </Button>
          <Button
            onClick={async () => {
              // refresh
              setLoading(true);
              const { data: profilesData } = await supabase
                .from("profiles")
                .select("*");
              const { data: rolesData } = await supabase
                .from("roles")
                .select("*");
              const { data: userRolesData } = await supabase
                .from("user_roles")
                .select("*");
              setProfiles((profilesData as Profile[]) || []);
              setRoles((rolesData as Role[]) || []);
              setUserRoles((userRolesData as UserRole[]) || []);
              setLoading(false);
            }}
          >
            تحديث
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">جارٍ التحميل...</div>
      ) : (
        <Card>
        <Table>
          <TableCaption className="p-4">قائمة المستخدمين</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-left">العمليات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map(({ profile, role }) => (
              <TableRow key={profile.id} className="hover:bg-muted/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {profile.avatar_url ? (
                        // Avatar component assumed to accept image
                        <Image
                          width={50}
                          height={50}
                          src={profile.avatar_url}
                          alt={profile.name ?? "avatar"}
                        />
                      ) : (
                        <span className="text-sm">
                          {(profile.name ?? profile.email ?? "—").slice(0, 1)}
                        </span>
                      )}
                    </Avatar>
                    <div className="text-right">
                      <div className="font-medium">{profile.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        #{profile.user_id}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="text-sm">{profile.email ?? "-"}</div>
                </TableCell>

                <TableCell className="text-right">
                  {role ? (
                    <Badge variant="outline">{role.name}</Badge>
                  ) : (
                    <Badge variant="secondary">No role</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    {/* Edit role dialog component */}
                    <EditRoleDialog
                      userId={profile.user_id}
                      currentRole={role}
                      roles={roles}
                      onUpdated={(newRoleId) =>
                        handleLocalRoleUpdate(profile.user_id, newRoleId)
                      }
                    />
                    <DeleteUserDialog
                      userId={profile.user_id}
                      onDeleted={() => handleLocalDelete(profile.user_id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Card>
      )}
    </div>
  );
}
