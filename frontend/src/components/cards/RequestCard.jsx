import Card from "../ui/Card";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function RequestCard({ request }) {

    return (

        <Card>

            <div className="flex justify-between">

                <div>

                    <h2 className="text-xl font-semibold">
                        {request.service}
                    </h2>

                    <p className="text-slate-500">
                        {request.provider}
                    </p>

                </div>

                <span className="font-medium">
                    {request.status}
                </span>

            </div>

            <p className="mt-5">
                {request.description}
            </p>

            <div className="mt-6 flex justify-between items-center">

                <strong>

                    ETB {request.price}

                </strong>

                <Link to={`/requests/${request.id}`}>

                    <Button>

                        View

                    </Button>

                </Link>

            </div>

        </Card>

    );

}