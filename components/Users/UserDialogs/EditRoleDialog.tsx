"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Tables } from "@/types/database";
import { supabase } from "@/lib/supabaseClient";

type Role = Tables<"roles">;
type EditRoleDialogProps = {
  userId: string;
  currentRole?: Role | null;
  roles: Role[];
  onUpdated?: (newRoleId: number | null) => void;
};

export default function EditRoleDialog({
  userId,
  currentRole,
  roles,
  onUpdated,
}: EditRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(
    currentRole?.id?.toString() ?? null
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const roleId = selectedRole ? parseInt(selectedRole) : null;

      // delete old role entry if exists, then insert
      await supabase.from("user_roles").delete().eq("user_id", userId);
      if (roleId) {
        await supabase.from("user_roles").insert({ user_id: userId, role_id: roleId });
      }

      onUpdated?.(roleId);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="تعديل الدور">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>تعديل الدور</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedRole ?? ""}
            onValueChange={(val) => setSelectedRole(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
