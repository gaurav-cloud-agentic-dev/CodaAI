import { currentUser } from "@/modules/authentication/actions";
import UserButton from "@/modules/authentication/components/user-button";
import LogoutButton from "@/components/logout-button";
import SideBar from "@/modules/chat/side-bar";

export default async function Home() {
  const user = await currentUser();
  console.log("=== HOME PAGE ===");
  console.log("User:", user);
  console.log("emailVerified:", user?.emailVerified);
  
  // This should be caught by middleware, but just in case
  if (!user) {
    console.log("No user found on home page!");
  }
  if (user && !user.emailVerified) {
    console.log("⚠️ WARNING: Unverified user reached home page!");
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SideBar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 overflow-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-950 dark:text-amber-100 mb-4">
            Welcome to CodaAI!
          </h1>
          <p className="text-xl text-amber-800 dark:text-amber-200">
            Where intelligence meets conversation
          </p>
        </div>
        
        <div className="bg-white dark:bg-amber-950 rounded-2xl p-8 shadow-xl border border-amber-200 dark:border-amber-800">
          <UserButton user={user} />
          
          <div className="mt-4 text-center">
            {user?.emailVerified ? (
              <span className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                ⚠️ Email Not Verified
              </span>
            )}
          </div>
          
          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}