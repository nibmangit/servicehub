import Card from "../components/ui/Card";
import RequestForm from "../components/forms/RequestForm";

export default function RequestDetailPage() {
    return (
        <div className="max-w-3xl mx-auto py-10 px-6">

            <Card>

                <h1 className="text-3xl font-bold">
                    Request Service
                </h1>

                <p className="mt-3 text-slate-500">
                    Complete the information below.
                </p>

                <div className="mt-8">
                    <RequestForm />
                </div>

            </Card>

        </div>
    );
}