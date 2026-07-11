import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { services } from "../mocks/services";

export default function ServiceDetailPage() {

    const service = services[0];

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="grid gap-10 lg:grid-cols-2">

                <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-2xl w-full h-[450px] object-cover"
                />

                <div>

                    <h1 className="text-4xl font-bold">
                        {service.title}
                    </h1>

                    <p className="mt-4 text-yellow-500">
                        ⭐ {service.rating}
                    </p>

                    <p className="mt-2 text-slate-500">
                        {service.location}
                    </p>

                    <h2 className="mt-8 text-3xl font-bold text-blue-600">
                        ETB {service.price}
                    </h2>

                    <p className="mt-8 text-slate-600 leading-8">
                        {service.description}
                    </p>

                    <Link to="/requests/new">

                        <Button
                            className="mt-10 w-full"
                        >
                            Request Service
                        </Button>

                    </Link>

                </div>

            </div>

            <Card className="mt-12">

                <h2 className="text-2xl font-semibold mb-6">
                    About Provider
                </h2>

                <div className="flex gap-5 items-center">

                    <div className="w-20 h-20 rounded-full bg-slate-300" />

                    <div>

                        <h3 className="text-xl font-semibold">
                            {service.provider}
                        </h3>

                        <p className="text-slate-500">
                            Professional Service Provider
                        </p>

                    </div>

                </div>

            </Card>

        </div>

    );

}