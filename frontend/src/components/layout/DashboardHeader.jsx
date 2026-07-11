import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";


export default function DashboardHeader({
    onMenuClick
}) {


    return (

        <header
            className="
                h-16
                bg-white
                border-b
                border-slate-200
                flex
                items-center
                justify-between
                px-6
            "
        >


            {/* Mobile Menu */}

            <button
                onClick={onMenuClick}
                className="
                    md:hidden
                    text-2xl
                "
            >
                ☰
            </button>



            <h1
                className="
                    text-xl
                    font-semibold
                    text-slate-800
                "
            >
                Dashboard
            </h1>




            <div
                className="
                    flex
                    items-center
                    gap-5
                "
            >


                {/* Notification */}

                <button
                    className="
                        relative
                        text-xl
                    "
                >

                    🔔


                    <span
                        className="
                            absolute
                            -top-2
                            -right-2
                            bg-red-600
                            text-white
                            text-xs
                            rounded-full
                            h-5
                            w-5
                            flex
                            items-center
                            justify-center
                        "
                    >
                        3
                    </span>

                </button>



                {/* User Menu */}

                <Dropdown
                    trigger={
                        <Avatar
                            name="Nibretu Mengaw"
                            size="sm"
                        />
                    }
                >

                    <div className="space-y-2">


                        <button
                            className="
                                w-full
                                text-left
                                px-3
                                py-2
                                rounded-lg
                                hover:bg-slate-100
                            "
                        >
                            Profile
                        </button>


                        <button
                            className="
                                w-full
                                text-left
                                px-3
                                py-2
                                rounded-lg
                                hover:bg-slate-100
                            "
                        >
                            Settings
                        </button>


                        <button
                            className="
                                w-full
                                text-left
                                px-3
                                py-2
                                rounded-lg
                                hover:bg-slate-100
                            "
                        >
                            Logout
                        </button>


                    </div>


                </Dropdown>


            </div>


        </header>

    )

}