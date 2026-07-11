export default function WhyChooseUs() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-20">

            <h2 className="mb-12 text-center text-3xl font-bold">
                Why Choose ServiceHub?
            </h2>

            <div className="grid gap-8 md:grid-cols-3">

                <div className="rounded-xl border p-8">
                    <h3 className="font-bold">
                        Verified Professionals
                    </h3>

                    <p className="mt-3 text-gray-600">
                        Every provider is verified before joining.
                    </p>
                </div>

                <div className="rounded-xl border p-8">
                    <h3 className="font-bold">
                        Secure Payments
                    </h3>

                    <p className="mt-3 text-gray-600">
                        Pay only after work starts using OTP verification.
                    </p>
                </div>

                <div className="rounded-xl border p-8">
                    <h3 className="font-bold">
                        Trusted Reviews
                    </h3>

                    <p className="mt-3 text-gray-600">
                        Ratings come from completed jobs only.
                    </p>
                </div>

            </div>

        </section>
    );
}