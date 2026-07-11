import { useAuth } from "../contexts/AuthContext";

function HomePage() {

    const auth = useAuth();

    console.log(auth);

    return <h1>Home</h1>;
}

export default HomePage;