// export default function HomePage() {
//     return <h1>Home</h1>;
// }

import Card from "../components/ui/Card";


export default function HomePage() {
    return (
        <div className="grid gap-4 md:grid-cols-3">

    <Card>
        <h3 className="font-semibold text-lg">
            Cleaning Service
        </h3>

        <p className="text-slate-500 mt-2">
            Professional apartment cleaning.
        </p>
    </Card>


    <Card hover>
        <h3 className="font-semibold text-lg">
            Provider Profile
        </h3>

        <p className="text-slate-500 mt-2">
            Hover me
        </p>
    </Card>


    <Card clickable onClick={() => alert("Clicked")}>
        <h3 className="font-semibold text-lg">
            Request
        </h3>

        <p className="text-slate-500 mt-2">
            Click me
        </p>
    </Card>

</div>
    );
}