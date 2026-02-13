"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Sign out from Better Auth
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            console.log("Signed out successfully");
          },
        },
      });

      // Clear all cookies related to authentication
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Force reload to clear any cached state
      window.location.href = "/auth/sign-in";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if there's an error
      window.location.href = "/auth/sign-in";
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="w-full bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100"
    >
      Sign Out
    </Button>
  );
}