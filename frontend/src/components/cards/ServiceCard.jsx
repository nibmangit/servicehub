import Card from "../ui/Card";
import Button from "../ui/Button";

export default function ServiceCard({ service }) {
    return (
        <Card hover clickable>

            <img
                src={service.image}
                alt={service.title}
                className="h-52 w-full rounded-xl object-cover"
            />

            <h3 className="mt-4 text-xl font-semibold">
                {service.title}
            </h3>

            <p className="mt-2 text-slate-500">
                {service.provider}
            </p>

            <div className="mt-4 flex justify-between">

                <span className="font-semibold">
                    ETB {service.price}
                </span>

                <span>
                    ⭐ {service.rating}
                </span>

            </div>

            <p className="mt-2 text-sm text-slate-500">
                {service.location}
            </p>

            <Button className="mt-5 w-full">
                View Details
            </Button>

        </Card>
    );
}