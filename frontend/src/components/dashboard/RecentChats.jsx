import Card from "../ui/Card";

export default function RecentChats() {

    return (

        <Card>

            <h2 className="text-xl font-semibold mb-6">
                Recent Chats
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between">

                    <div>

                        <h3 className="font-medium">
                            Daniel Electric
                        </h3>

                        <p className="text-slate-500 text-sm">
                            Can I come tomorrow?
                        </p>

                    </div>

                    <span className="text-xs text-slate-400">
                        2m ago
                    </span>

                </div>

                <div className="flex justify-between">

                    <div>

                        <h3 className="font-medium">
                            Abebe Cleaning
                        </h3>

                        <p className="text-slate-500 text-sm">
                            Thank you.
                        </p>

                    </div>

                    <span className="text-xs text-slate-400">
                        Yesterday
                    </span>

                </div>

            </div>

        </Card>

    );

}