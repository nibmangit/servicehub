export default function EmptyState({
    title,
    description,
    action
}) {

    return (
        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                py-12
            "
        >

            <h3 className="text-lg font-semibold">
                {title}
            </h3>


            <p className="text-slate-500 mt-2">
                {description}
            </p>


            {action && (
                <div className="mt-5">
                    {action}
                </div>
            )}

        </div>
    );
}