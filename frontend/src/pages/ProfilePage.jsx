import ProviderCard from "../components/cards/ProviderCard";
import { provider } from "../mocks/profile";

export default function ProfilePage() {

    return (

        <div className="max-w-6xl mx-auto px-6 py-10">

            <ProviderCard
                provider={provider}
            />

        </div>

    );

}