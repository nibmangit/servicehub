import NotificationList from "../components/notifications/NotificationList";

export default function NotificationsPage() {

    return (

        <div className="max-w-4xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold">
                Notifications
            </h1>

            <p className="text-slate-500 mt-2">
                Stay updated with your account activity.
            </p>

            <div className="mt-8">

                <NotificationList />

            </div>

        </div>

    );

}