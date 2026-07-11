import DashboardStats from "../components/dashboard/DashboardStats";
import RecentRequests from "../components/dashboard/RecentRequests";
import RecentReviews from "../components/dashboard/RecentReviews";
import RecentChats from "../components/dashboard/RecentChats";

export default function DashboardPage() {

    return (

        <div className="space-y-10">

            <div>

                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-slate-500 mt-2">
                    Welcome back, Nibretu 👋
                </p>

            </div>

            <DashboardStats />

            <div
                className="
                    grid
                    gap-6
                    lg:grid-cols-2
                "
            >

                <RecentRequests />

                <RecentReviews />

            </div>

            <RecentChats />

        </div>

    );

}