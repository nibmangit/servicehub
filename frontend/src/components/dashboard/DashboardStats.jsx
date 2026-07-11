import SummaryCard from "./SummaryCard";

import { dashboard } from "../../mocks/dashboard";

export default function DashboardStats(){

const data=dashboard.provider;

return(

<div
className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-4
"
>

<SummaryCard

title="Services"

value={data.totalServices}

icon="🛠️"

/>


<SummaryCard

title="Orders"

value={data.totalOrders}

icon="📦"

/>


<SummaryCard

title="Rating"

value={data.averageRating}

icon="⭐"

/>


<SummaryCard

title="Earnings"

value={`ETB ${data.earnings}`}

icon="💰"

/>

</div>

)

}