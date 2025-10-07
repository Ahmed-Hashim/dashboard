
import { Button } from "@/components/ui/button";

import { signout } from "@/app/(auth)/login/actions";

export default function SignOutButton() {
  return (
    <Button
      onClick={signout}
      variant="destructive"
      className="w-full mt-2"
    >
      تسجيل الخروج
    </Button>
  );
}
