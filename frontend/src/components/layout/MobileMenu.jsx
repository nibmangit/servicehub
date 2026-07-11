import { Link } from "react-router-dom";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";


export default function MobileMenu({
    open,
    onClose,
}) {


    return (

        <Drawer
            isOpen={open}
            onClose={onClose}
            title="Menu"
            position="left"
        >

            <nav
                className="
                    flex
                    flex-col
                    gap-4
                "
            >

                <Link
                    to="/"
                    onClick={onClose}
                    className="
                        text-slate-700
                        hover:text-blue-600
                    "
                >
                    Home
                </Link>


                <Link
                    to="/services"
                    onClick={onClose}
                    className="
                        text-slate-700
                        hover:text-blue-600
                    "
                >
                    Services
                </Link>


                <Link
                    to="/provider"
                    onClick={onClose}
                    className="
                        text-slate-700
                        hover:text-blue-600
                    "
                >
                    Become Provider
                </Link>


                <Link
                    to="/auth/login"
                    onClick={onClose}
                >
                    <Button className="w-full">
                        Login
                    </Button>
                </Link>


            </nav>


        </Drawer>

    )

}