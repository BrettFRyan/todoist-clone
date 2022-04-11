import React from "react";

import { getProjectsWithCounts } from "~/models/project.server";

import { SidebarLink } from "./sidebar-link";
import {
  InboxIcon,
  TodayCalendarIcon,
  CalendarIcon,
  ChevronRightIcon,
  PlusIcon,
  CircleIcon,
} from "../icons";

export const Sidebar: SidebarProps = ({
  show,
  inboxCount = 0,
  todayCount = 0,
  upcomingCount = 0,
  projects,
}) => {
  const shownClass = show ? "translate-x-0" : "-translate-x-full";

  const [showProjects, setShowProjects] = React.useState(false);

  const addProject = () => {
    alert("ADD PROJECT");
  };

  return (
    <div
      className={`${shownClass} fixed h-full w-80 bg-zinc-50 pl-11 pt-7 pr-1 shadow transition-transform duration-200 ease-in-out md:shadow-none`}
    >
      <nav>
        <ul>
          <SidebarLink
            icon={<InboxIcon className="h-full w-full" />}
            name="Inbox"
            to=""
            count={inboxCount}
          />
          <SidebarLink
            icon={<TodayCalendarIcon />}
            name="Today"
            to="today"
            count={todayCount}
          />
          <SidebarLink
            icon={<CalendarIcon className="h-full w-full" />}
            name="Upcoming"
            to="upcoming"
            count={upcomingCount}
          />
        </ul>

        <div>
          <div className="group mt-4 flex h-9 grow items-center gap-1 pl-2 pr-3">
            <button
              className="flex h-full grow items-center gap-1"
              onClick={() => setShowProjects((showProjects) => !showProjects)}
            >
              <span className="flex aspect-square h-6 flex-none items-center justify-start text-neutral-500">
                <ChevronRightIcon
                  className={`h-4/5 w-4/5 transition-transform duration-150 ${
                    showProjects && "rotate-90"
                  }`}
                />
              </span>
              <span className="grow text-left text-sm font-bold text-neutral-900">
                Projects
              </span>
            </button>

            <button
              className="hidden aspect-square w-6 items-center justify-center rounded text-neutral-400 hover:bg-stone-200 group-hover:flex"
              onClick={addProject}
            >
              <PlusIcon className="h-4/5 w-4/5" />
            </button>
          </div>

          <ul
            className={`origin-top overflow-hidden transition-all duration-300 ${
              showProjects ? "scale-y-100" : "scale-y-0 opacity-0"
            }`}
          >
            {projects.map(({ id, name, count }) => (
              <SidebarLink
                key={id}
                icon={
                  <CircleIcon className="aspect-square w-2/5 text-neutral-500" />
                }
                to={`projects/${id}`}
                name={name}
                count={count}
              />
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

type SidebarProps = React.FC<{
  show: boolean;
  projects: Awaited<ReturnType<typeof getProjectsWithCounts>>;
  inboxCount?: number;
  todayCount?: number;
  upcomingCount?: number;
}>;
