const steps = [

{
title:"Search",
icon:"🔍",
description:"Find trusted professionals near you."
},

{
title:"Book",
icon:"📅",
description:"Choose a provider and send your request."
},

{
title:"Pay Securely",
icon:"💳",
description:"Complete payment safely after the service."
}

];

export default function HowItWorks(){

    return(

        <section className="py-20">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-3xl font-bold text-center">
                How ServiceHub Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mt-12">

                {steps.map(step=>(

                <div key={step.title} className="text-center bg-white rounded-2xl border p-8 " >

                <div className="text-6xl">
                {step.icon}
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                {step.title}
                </h3>

                <p className="mt-3 text-slate-500">
                {step.description}
                </p>

                </div>

                ))}

                </div>

            </div>

        </section>

    )

}