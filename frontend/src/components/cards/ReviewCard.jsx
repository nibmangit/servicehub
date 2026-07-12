import Card from "../ui/Card";

export default function ReviewCard({ review }) {

    return (

        <Card>

            <div className="flex justify-between">

                <h3 className="font-semibold">
                    {review.user}
                </h3>

                <span className="text-yellow-500">
                    {"⭐".repeat(review.rating)}
                </span>

            </div>

            <p className="mt-4 text-slate-600">
                {review.comment}
            </p>

            <p className="mt-4 text-sm text-slate-400">
                {review.date}
            </p>

        </Card>

    );

}