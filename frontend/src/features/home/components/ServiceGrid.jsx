const services = Array.from({ length: 6 });

export default function ServiceGrid() {
    return (
        <section className="bg-gray-50 py-20">

            <div className="mx-auto max-w-7xl px-6">

                <h2 className="mb-10 text-3xl font-bold">
                    Popular Services
                </h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {services.map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-xl"
                        >
                            <div className="h-52 bg-gray-200"></div>

                            <div className="p-6">

                                <h3 className="font-bold">
                                    Professional Cleaning
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Bahir Dar
                                </p>

                                <p className="mt-4 text-indigo-600 font-bold">
                                    ETB 500
                                </p>

                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}