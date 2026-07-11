import { useState } from "react";
import { Link } from "react-router-dom";

import MobileMenu from "./MobileMenu";
import Logo from "../shared/Logo";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";


export default function Header(){

    const [mobileOpen,setMobileOpen]=useState(false);

    return (

        <header
            className="
                sticky
                top-0
                z-40
                bg-white
                border-b
                border-slate-200
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    h-16
                    flex
                    items-center
                    justify-between
                "
            >


                {/* Logo */}

                <Link to="/">
                    <Logo/>
                </Link>




                {/* Search */}

                <div
                    className="
                        hidden
                        md:flex
                        flex-1
                        max-w-xl
                        mx-10
                    "
                >

                    <input
                        placeholder="
                        Search services...
                        "
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-4
                            py-2
                            outline-none
                            focus:ring-2
                            focus:ring-blue-200
                        "
                    />

                </div>

                <button
                    onClick={()=>setMobileOpen(true)}
                    className="
                        md:hidden
                        text-2xl
                    "
                >
                    ☰
                </button>


                {/* Actions */}

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >


                    <Link
                        className="
                            hidden
                            md:block
                            text-sm
                            text-slate-600
                        "
                    >
                        Become Provider
                    </Link>



                    <Button
                        variant="outline"
                        size="sm"
                    >
                        Login
                    </Button>




                    <Avatar
                        name="Nibretu Mengaw"
                        size="sm"
                    />


                </div>



            </div>

            <MobileMenu
                open={mobileOpen}
                onClose={()=>setMobileOpen(false)}
            />

        </header>

    )

}