const steps = [
    "Pending",
    "Accepted",
    "In Progress",
    "Completed",
];

export default function RequestTimeline({ currentStatus }) {

    const currentIndex = steps.indexOf(currentStatus);

    return (

        <div className="space-y-4">

            {steps.map((step, index) => (

                <div
                    key={step}
                    className="flex items-center gap-4"
                >

                    <div
                        className={`
                            w-6
                            h-6
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-white
                            ${
                                index <= currentIndex
                                    ? "bg-blue-600"
                                    : "bg-slate-300"
                            }
                        `}
                    >
                        ✓
                    </div>

                    <span className="font-medium">
                        {step}
                    </span>

                </div>

            ))}

        </div>

    );

}