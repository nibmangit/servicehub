import { NavLink } from "react-router-dom";
import clsx from "clsx";


const menu = [

{
name:"Dashboard",
path:"/dashboard"
},

{
name:"My Services",
path:"/dashboard/services"
},

{
name:"Requests",
path:"/dashboard/requests"
},

{
name:"Messages",
path:"/dashboard/messages"
},

{
name:"Notifications",
path:"/dashboard/notifications"
},

{
name:"Profile",
path:"/profile"
},

{
name:"Settings",
path:"/settings"
}

];


export default function DashboardSidebar(){


return (

<aside
className="
w-64
bg-white
border-r
border-slate-200
min-h-screen
p-5
flex-col
flex
"
>


<div
className="
text-2xl
font-bold
text-blue-600
mb-10
"
>
ServiceHub
</div>



<nav className="space-y-2">


{
menu.map(item=>(

<NavLink

key={item.path}

to={item.path}

className={({isActive})=>

clsx(

"block px-4 py-3 rounded-xl text-sm",

isActive

?
"bg-blue-600 text-white"

:

"text-slate-600 hover:bg-slate-100"

)

}

>

{item.name}

</NavLink>

))

}


</nav>


</aside>

)

}