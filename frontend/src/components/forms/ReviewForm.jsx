import { useState } from "react";

import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

export default function ReviewForm() {

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");

    return (

        <div className="space-y-6">

            <div>

                <label className="font-medium">
                    Rating
                </label>

                <select
                    className="mt-2 w-full rounded-xl border p-3"
                    value={rating}
                    onChange={(e)=>setRating(e.target.value)}
                >
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
                </select>

            </div>

            <Textarea
                label="Comment"
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                placeholder="Share your experience..."
            />

            <Button className="w-full">
                Submit Review
            </Button>

        </div>

    );

}