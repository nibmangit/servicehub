import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "../components/AppSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import ProfileCompletionModal from "../components/profile/ProfileComplationModal";

export default function DashboardLayout() {
  const {user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    if(user){
      const isIncomplet = !user.full_name || !user.city ;
      setIsModalOpen(isIncomplet)
    }
  }, [user])

  const handleProfileComplete = (updatedProfile) => {
    setUser(updatedProfile);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen">

      <DashboardHeader />

      <div className="mx-auto flex w-full max-w-[1400px]">

        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Page Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={isModalOpen}
        initialData={user}
        onComplete={handleProfileComplete}
      />

    </div>
  );
}