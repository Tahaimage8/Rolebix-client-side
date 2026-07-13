import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import { getMyProfile } from "@/lib/api/profile";
import ProfileClient from "@/components/profile/ProfileClient";

const ProfilePage = async () => {
  const user = await getUserSession();

  if (!user?.id && !user?._id) {
    redirect("/auth/signin");
  }

  let profile = null;
  let errorMessage = "";

  try {
    const result = await getMyProfile();
    profile = result?.profile || null;
  } catch (error) {
    errorMessage =
      error?.message || "Your profile could not be loaded.";
  }

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ProfileClient
          initialProfile={profile}
          errorMessage={errorMessage}
        />
      </div>
    </main>
  );
};

export default ProfilePage;
