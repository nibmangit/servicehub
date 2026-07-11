export default function Hero() {
    return (
        <section className="bg-gray-50">
            <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">

                <h1 className="max-w-4xl text-5xl font-bold leading-tight">
                    Find Trusted Local Professionals Near You
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-gray-600">
                    Book trusted plumbers, electricians, cleaners,
                    mechanics, tutors, designers and many more in minutes.
                </p>

                <div className="mt-10 flex w-full max-w-2xl rounded-xl border bg-white shadow">

                    <input
                        type="text"
                        placeholder="Search services..."
                        className="flex-1 rounded-l-xl px-5 py-4 outline-none"
                    />

                    <button className="rounded-r-xl bg-indigo-600 px-8 text-white hover:bg-indigo-700">
                        Search
                    </button>

                </div>

            </div>
        </section>
    );
}