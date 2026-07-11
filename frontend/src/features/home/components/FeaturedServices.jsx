import { services } from "../../../mocks/services";
import ServiceCard from "../../../components/cards/ServiceCard";

export default function FeaturedServices() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex items-center justify-between mb-10">

                    <div>
                        <h2 className="text-3xl font-bold">
                            Featured Services
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Trusted professionals recommended for you.
                        </p>
                    </div>

                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {services.map(service => (

                        <ServiceCard
                            key={service.id}
                            service={service}
                        />

                    ))}

                </div>

            </div>
        </section>
    );
}