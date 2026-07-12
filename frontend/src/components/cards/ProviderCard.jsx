import Card from "../ui/Card";
import Button from "../ui/Button";

export default function ProviderCard({ provider }) {

    return (

        <Card>

            <div className="flex gap-6 items-center">

                <div className="w-24 h-24 rounded-full bg-slate-300" />

                <div>

                    <h2 className="text-2xl font-bold">

                        {provider.name}

                    </h2>

                    <p className="text-yellow-500">

                        ⭐ {provider.rating}

                    </p>

                    <p className="text-slate-500">

                        {provider.city}

                    </p>

                </div>

            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">

                <div>

                    <p className="text-slate-500">
                        Experience
                    </p>

                    <strong>
                        {provider.experience}
                    </strong>

                </div>

                <div>

                    <p className="text-slate-500">
                        Jobs Completed
                    </p>

                    <strong>
                        {provider.completedJobs}
                    </strong>

                </div>

            </div>

            <p className="mt-8 text-slate-600">

                {provider.bio}

            </p>

            <div className="flex gap-3 flex-wrap mt-8">

                {provider.skills.map(skill => (

                    <span
                        key={skill}
                        className="
                            bg-blue-100
                            text-blue-700
                            px-4
                            py-2
                            rounded-full
                            text-sm
                        "
                    >
                        {skill}
                    </span>

                ))}

            </div>

            <div className="flex gap-4 mt-10">

                <Button className="flex-1">
                    Chat
                </Button>

                <Button
                    variant="outline"
                    className="flex-1"
                >
                    Hire
                </Button>

            </div>

        </Card>

    );

}