import Card from "../../../components/ui/Card";
import { categories } from "../../../mocks/categories";

export default function CategorySection() {
    return (
        <section className="py-20">

            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-10">

                    <h2 className="text-3xl font-bold">
                        Popular Categories
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Find professionals by category.
                    </p>

                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {categories.map((category) => (

                        <Card
                            key={category.id}
                            hover
                            clickable
                            className="text-center"
                        >

                            <div className="text-5xl mb-4">
                                {category.icon}
                            </div>

                            <h3 className="text-xl font-semibold">
                                {category.name}
                            </h3>

                            <p className="mt-2 text-slate-500">
                                {category.description}
                            </p>

                        </Card>

                    ))}

                </div>

            </div>

        </section>
    );
}