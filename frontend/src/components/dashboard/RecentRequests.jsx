import Card from "../ui/Card";
import Button from "../ui/Button";

import { dashboard } from "../../mocks/dashboard";

export default function RecentRequests() {
    const requests = dashboard.customer.recentRequests;

    return (
        <Card>

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-semibold">
                    Recent Requests
                </h2>

                <Button
                    variant="ghost"
                    size="sm"
                >
                    View All
                </Button>

            </div>

            <div className="space-y-4">

                {requests.map((request) => (

                    <div
                        key={request.id}
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            pb-4
                        "
                    >

                        <div>

                            <h3 className="font-medium">
                                {request.service}
                            </h3>

                            <p className="text-sm text-slate-500">
                                {request.provider}
                            </p>

                        </div>

                        <div className="text-right">

                            <p className="font-medium">
                                {request.status}
                            </p>

                            <p className="text-sm text-slate-500">
                                {request.date}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </Card>
    );
}