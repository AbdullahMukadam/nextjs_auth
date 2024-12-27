"use client"
import { Button } from "@/components/ui/button";
import { SignOutAction } from "./actions/Useractions";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter()
  const handleLogout = async () => {
    try {
      const res = await SignOutAction();
      if (res.success) {
       router.push("/Signin")
      }
    } catch (error) {
      alert("Error in Logout")
    }
  }
  return (
    <div className="w-full min-h-screen p-2 bg-slate-500">
      <h1>Hey</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
