export default function Pagination({
    page,
    totalPages,
    onChange,
}) {

    return (
        <div className="flex items-center gap-2">

            <button
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className="
                    px-3
                    py-2
                    rounded-lg
                    border
                    disabled:opacity-50
                "
            >
                Previous
            </button>


            <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
            </span>


            <button
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
                className="
                    px-3
                    py-2
                    rounded-lg
                    border
                    disabled:opacity-50
                "
            >
                Next
            </button>


        </div>
    );
}