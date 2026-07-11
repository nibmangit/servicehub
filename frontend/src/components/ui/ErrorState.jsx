export default function ErrorState({
    title="Something went wrong",
    message,
    retry
}) {

    return (
        <div
            className="
                text-center
                py-10
            "
        >

            <h3 className="
                text-lg
                font-semibold
                text-red-600
            ">
                {title}
            </h3>


            <p className="
                text-slate-500
                mt-2
            ">
                {message}
            </p>


            {retry && (
                <button
                    onClick={retry}
                    className="
                        mt-5
                        px-4
                        py-2
                        rounded-lg
                        bg-red-600
                        text-white
                    "
                >
                    Try Again
                </button>
            )}

        </div>
    );
}