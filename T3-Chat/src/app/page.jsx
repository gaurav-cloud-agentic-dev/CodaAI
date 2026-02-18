import { currentUser } from "@/modules/authentication/actions";
import SideBar from "@/modules/chat/side-bar";
import MainChatPage from "@/modules/chat/main-chat-page";

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
      
      {/* Main Chat Page */}
      <MainChatPage />
    </div>
  );
}