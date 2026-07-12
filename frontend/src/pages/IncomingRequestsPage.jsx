import RequestCard from "../components/cards/RequestCard";
import { requests } from "../mocks/requests";

export default function IncomingRequestsPage() {

    const incoming = requests.filter(
        request => request.status === "Pending"
    );

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold">
                Incoming Requests
            </h1>

            <p className="text-slate-500 mt-2">
                New requests waiting for your response.
            </p>

            <div className="grid gap-6 mt-10">

                {incoming.map(request => (

                    <RequestCard
                        key={request.id}
                        request={request}
                    />

                ))}

            </div>

        </div>

    );

}