import { isAuthenticated } from "@/lib/action/auth.action";
import { redirect } from "next/navigation";
import UploadForm from "@/components/UploadForm";

export default async function AnalyserPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/sign-in");

  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <UploadForm />
      </div>
    </main>
  );
}
