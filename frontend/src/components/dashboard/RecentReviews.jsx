import Card from "../ui/Card";

export default function RecentReviews() {

    return (

        <Card>

            <h2 className="text-xl font-semibold mb-6">
                Recent Reviews
            </h2>

            <div className="space-y-5">

                <div>

                    <h3 className="font-medium">
                        House Cleaning
                    </h3>

                    <p className="text-yellow-500">
                        ⭐⭐⭐⭐⭐
                    </p>

                    <p className="text-slate-500">
                        Great work. Very professional.
                    </p>

                </div>

                <div>

                    <h3 className="font-medium">
                        Plumbing
                    </h3>

                    <p className="text-yellow-500">
                        ⭐⭐⭐⭐☆
                    </p>

                    <p className="text-slate-500">
                        Arrived on time.
                    </p>

                </div>

            </div>

        </Card>

    );

}