const categories = [
    "Plumbing",
    "Cleaning",
    "Electrical",
    "Painting",
    "Mechanic",
    "Tutor",
    "Hair Salon",
    "Computer Repair",
];

export default function CategoryGrid() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-20">

            <h2 className="mb-10 text-3xl font-bold">
                Browse Categories
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {categories.map((category) => (
                    <div
                        key={category}
                        className="cursor-pointer rounded-xl border bg-white p-8 text-center shadow-sm transition hover:shadow-lg"
                    >
                        <div className="mb-4 text-5xl">
                            🔧
                        </div>

                        <h3 className="font-semibold">
                            {category}
                        </h3>
                    </div>
                ))}

            </div>

        </section>
    );
}