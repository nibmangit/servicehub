import SearchBar from "../components/shared/SearchBar";
import Filters from "../components/shared/Filters";
import ServiceCard from "../components/cards/ServiceCard";

import { services } from "../mocks/services";

export default function ServicesPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="mb-8">

                <h1 className="text-4xl font-bold">
                    Browse Services
                </h1>

                <p className="text-slate-500 mt-2">
                    Discover trusted local professionals across Ethiopia.
                </p>

            </div>

            <SearchBar />

            <div className="mt-6">
                <Filters />
            </div>

            <div className="grid gap-6 mt-10 md:grid-cols-2 xl:grid-cols-3">

                {services.map(service => (

                    <ServiceCard
                        key={service.id}
                        service={service}
                    />

                ))}

            </div>

        </div>
    );
}