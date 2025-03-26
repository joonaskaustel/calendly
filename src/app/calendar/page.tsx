import {auth} from "~/server/auth";
import {api, HydrateClient} from "~/trpc/server";
import FullCalendarClient from "~/components/FullCalendarClient";

export default async function Page() {
    const hello = await api.post.hello({ text: "from tRPC" });
    const session = await auth();

    if (session?.user) {
        void api.post.getLatest.prefetch();
    }

    return (
        <HydrateClient>

            <div className="flex justify-center items-center h-screen">
                <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
                    <FullCalendarClient />
                </div>
            </div>

        </HydrateClient>
    );
}
