import { Outlet } from "react-router-dom";
import { useState } from "react";

import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import Drawer from "../components/ui/Drawer";


export default function DashboardLayout(){

    const [mobileMenu,setMobileMenu] = useState(false);


    return (

        <div
            className="
                min-h-screen
                bg-slate-50
            "
        >


            {/* Top Header */}

            <DashboardHeader
                onMenuClick={()=>setMobileMenu(true)}
            />



            <div
                className="
                    flex
                "
            >


                {/* Desktop Sidebar */}

                <DashboardSidebar />



                {/* Mobile Sidebar */}

                <Drawer

                    isOpen={mobileMenu}

                    onClose={()=>setMobileMenu(false)}

                    title="Menu"

                    position="left"

                >

                    <DashboardSidebar />

                </Drawer>




                {/* Page Content */}

                <main

                    className="
                        flex-1
                        p-6
                    "

                >

                    <Outlet /> 
                </main> 
            </div> 
        </div>

    )

}