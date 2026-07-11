import { NavLink } from "react-router-dom";
import clsx from "clsx";


const links=[

{
label:"Dashboard",
path:"/dashboard"
},

{
label:"My Services",
path:"/dashboard/services"
},

{
label:"Requests",
path:"/dashboard/requests"
},

{
label:"Messages",
path:"/dashboard/messages"
},

{
label:"Notifications",
path:"/dashboard/notifications"
},

{
label:"Profile",
path:"/profile"
},

{
label:"Settings",
path:"/settings"
}

];


export default function Sidebar(){

return (

<aside
className="
hidden
md:flex
w-64
min-h-screen
border-r
border-slate-200
bg-white
p-5
flex-col
"
>


<h2
className="
text-xl
font-bold
text-blue-600
mb-8
"
>
ServiceHub
</h2>


<nav
className="
space-y-2
"
>

{
links.map(link=>(

<NavLink
key={link.path}
to={link.path}

className={({isActive})=>

clsx(

"block px-4 py-2 rounded-xl text-sm",

isActive

?
"bg-blue-100 text-blue-700"

:

"text-slate-600 hover:bg-slate-100"

)

}

>

{link.label}

</NavLink>

))

}


</nav>


</aside>

)

}