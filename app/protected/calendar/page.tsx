import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import FullCalendarComponent from "@/components/calendar/FullCalendar"; // a plugin!

export default async function Calendar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
<FullCalendarComponent/>
    </div>
  );
}
