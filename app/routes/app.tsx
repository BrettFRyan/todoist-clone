import { useState } from "react";
import { json, useLoaderData, Outlet } from "remix";

import type { LoaderFunction } from "remix";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getProjectsWithCounts } from "~/models/project.server";
import { getInboxTasks, getTodaysTasks } from "~/models/task.server";

import { Header, Sidebar } from "~/components";

interface ProjectType {
  name: string;
  count: number;
}

interface LoaderData {
  userId: Awaited<ReturnType<any>>;
  projects: Awaited<ReturnType<typeof getProjectsWithCounts>>;
  inboxCount: number;
  todayCount: number;
  upcomingCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  let inboxCount: number,
    todayCount: number,
    upcomingCount: number,
    projects: Awaited<ReturnType<typeof getProjectsWithCounts>>;

  await Promise.all([
    (inboxCount = await (await getInboxTasks({ userId })).length),
    (todayCount = await (await getTodaysTasks({ userId })).length),
    (upcomingCount = await (await getInboxTasks({ userId })).length),
    (projects = await getProjectsWithCounts({ userId })),
  ]);

  return json<LoaderData>({
    userId,
    inboxCount,
    todayCount,
    upcomingCount,
    projects,
  });
};

export default function AppPage() {
  const user = useUser();
  const { inboxCount, todayCount, upcomingCount, projects } =
    useLoaderData() as LoaderData;

  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((showSidebar) => !showSidebar);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header menuClick={toggleSidebar} showSidebar={showSidebar} />

      <div className="relative flex grow">
        <div
          className={` ${
            showSidebar ? "absolute inset-0" : "hidden"
          } h-full w-full bg-black/10 md:hidden`}
          onClick={() => setShowSidebar(false)}
        />
        <Sidebar
          show={showSidebar}
          inboxCount={inboxCount}
          todayCount={todayCount}
          upcomingCount={upcomingCount}
          projects={projects}
        />

        <div
          className={`grow overflow-y-auto duration-200 ease-in-out md:transition-spacing ${
            showSidebar && "md:ml-80"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
