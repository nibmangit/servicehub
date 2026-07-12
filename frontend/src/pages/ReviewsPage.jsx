import ReviewCard from "../components/cards/ReviewCard";
import ReviewForm from "../components/forms/ReviewForm";

import { reviews } from "../mocks/reviews";

export default function ReviewsPage() {

    return (

        <div className="max-w-5xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold">
                Reviews
            </h1>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-10 mt-10">

                <div className="space-y-6">

                    {reviews.map(review => (

                        <ReviewCard
                            key={review.id}
                            review={review}
                        />

                    ))}

                </div>

                <ReviewForm />

            </div>

        </div>

    );

}