import React from "react";
import { NavLink } from "remix";

export const SidebarLink: SidebarLinkProps = ({
  icon,
  to,
  name,
  count = 0,
  editable = false,
}) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "flex h-9 items-center gap-1 rounded pl-2 pr-3 text-sm font-light text-neutral-900 hover:bg-stone-200" +
          (isActive && " bg-stone-200")
        }
      >
        <div className="flex aspect-square h-6 flex-none items-center justify-center text-neutral-600">
          {icon}
        </div>
        <div className="grow overflow-hidden text-ellipsis">
          <span className="align-middle">{name}</span>
        </div>
        <div className="flex w-6 items-center justify-end text-neutral-400">
          {count > 0 ? count : ""}
        </div>
      </NavLink>
    </li>
  );
};

type SidebarLinkProps = React.FC<{
  icon?: React.ReactNode;
  to: string;
  name: string;
  editable?: boolean;
  count?: number;
}>;
