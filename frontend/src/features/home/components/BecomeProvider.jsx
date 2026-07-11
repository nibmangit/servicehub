import Button from "../../../components/ui/Button";

export default function BecomeProvider() {

    return (

        <section className="py-24 bg-blue-600">

            <div className="max-w-5xl mx-auto text-center text-white px-6">

                <h2 className="text-4xl font-bold">
                    Turn Your Skills Into Income
                </h2>

                <p className="mt-6 text-lg text-blue-100">
                    Join thousands of Ethiopian professionals providing trusted local services.
                </p>

                <Button
                    className="
                        mt-10
                        bg-white
                        text-blue-600
                        hover:bg-slate-100
                    "
                >
                    Become a Provider
                </Button>

            </div>

        </section>

    );

}