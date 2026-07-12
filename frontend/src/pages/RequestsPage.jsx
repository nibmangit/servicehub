import RequestCard from "../components/cards/RequestCard";

import { requests } from "../mocks/requests";

export default function RequestsPage() {

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold">

                My Requests

            </h1>

            <p className="text-slate-500 mt-2">

                Track every service request.

            </p>

            <div className="grid gap-6 mt-10">

                {

                    requests.map(request=>(

                        <RequestCard

                            key={request.id}

                            request={request}

                        />

                    ))

                }

            </div>

        </div>

    );

}