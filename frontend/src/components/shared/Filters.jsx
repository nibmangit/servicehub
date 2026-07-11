import Select from "../ui/Select";

export default function Filters() {

    return (

        <div
            className="
                flex
                flex-wrap
                gap-4
            "
        >

            <Select
                label="Category"
                options={[
                    { value: "cleaning", label: "Cleaning" },
                    { value: "plumbing", label: "Plumbing" },
                    { value: "electrician", label: "Electrician" },
                ]}
            />

            <Select
                label="Price"
                options={[
                    { value: "low", label: "Lowest Price" },
                    { value: "high", label: "Highest Price" },
                ]}
            />

            <Select
                label="Sort"
                options={[
                    { value: "rating", label: "Highest Rating" },
                    { value: "latest", label: "Newest" },
                ]}
            />

        </div>

    );

}