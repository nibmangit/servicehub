import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SearchBar() {
    return (
        <div className="flex flex-col gap-4 md:flex-row">

            <Input
                placeholder="Search services..."
                className="flex-1"
            />

            <Button>
                Search
            </Button>

        </div>
    );
}