import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import RequestTimeline from "../components/shared/RequestTimeline";

import { requests } from "../mocks/requests";

export default function RequestDetailPage() {

    const request = requests[0];

    return (

        <div className="max-w-5xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold">

                {request.service}

            </h1>

            <p className="mt-2 text-slate-500">

                {request.status}

            </p>

            <div className="grid gap-8 mt-10 lg:grid-cols-2">

                <Card>

                    <h2 className="text-xl font-semibold">

                        Provider

                    </h2>

                    <div className="mt-5">

                        <p>

                            {request.provider}

                        </p>

                        <p className="text-slate-500">

                            Professional Service Provider

                        </p>

                    </div>

                </Card>

                <Card>

                    <h2 className="text-xl font-semibold">

                        Request Details

                    </h2>

                    <div className="space-y-4 mt-6">

                        <p>

                            <strong>Date:</strong>

                            {" "}

                            {request.date}

                        </p>

                        <p>

                            <strong>Address:</strong>

                            {" "}

                            {request.address}

                        </p>

                        <p>

                            <strong>Description:</strong>

                        </p>

                        <p className="text-slate-500">

                            {request.description}

                        </p>

                    </div>

                </Card>

            </div>

            <Card className="mt-10">

                <h2 className="text-xl font-semibold mb-8">

                    Request Progress

                </h2>

                <RequestTimeline
                    currentStatus={request.status}
                />

            </Card>

            <Card className="mt-10">

                <div className="flex justify-between items-center">

                    <div>

                        <h2 className="text-xl font-semibold">

                            Total Price

                        </h2>

                        <p className="text-3xl font-bold text-blue-600 mt-3">

                            ETB {request.price}

                        </p>

                    </div>

                    <div className="flex gap-4">

                        <Button
                            variant="outline"
                        >
                            Chat
                        </Button>

                        <Button
                            variant="danger"
                        >
                            Cancel
                        </Button>

                    </div>

                </div>

            </Card>

        </div>

    );

}