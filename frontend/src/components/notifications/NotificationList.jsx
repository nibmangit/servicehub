import NotificationCard from "../cards/NotificationCard";
import { notifications } from "../../mocks/notifications";

export default function NotificationList() {

    return (

        <div className="space-y-4">

            {notifications.map(notification => (

                <NotificationCard
                    key={notification.id}
                    notification={notification}
                />

            ))}

        </div>

    );

}