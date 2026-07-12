export default function NotificationCard({ notification }) {

    return (

        <div
            className={`
                p-5
                rounded-xl
                border
                ${
                    notification.read
                        ? "bg-white"
                        : "bg-blue-50 border-blue-200"
                }
            `}
        >

            <h3 className="font-semibold">
                {notification.title}
            </h3>

            <p className="mt-2 text-slate-600">
                {notification.message}
            </p>

            <p className="mt-3 text-sm text-slate-400">
                {notification.time}
            </p>

        </div>

    );

}