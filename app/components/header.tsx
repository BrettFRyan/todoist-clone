import { Link } from "remix";
import { useMediaQuery } from "beautiful-react-hooks";

import { PlusIcon, HomeIcon, BurgerMenuIcon, ProfileIcon, CloseIcon } from ".";

const NavButton: React.FC<NavButtonProps> = ({
  children,
  onClick,
  hoverState = true,
}) => {
  return (
    <button
      className={`flex aspect-square h-7 items-center justify-center rounded text-gray-50 ${
        hoverState && "hover:bg-red-400"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ menuClick, showSidebar }) => {
  return (
    <header className="flex-none bg-red-600 px-3 sm:px-11">
      <div className="flex h-11 flex-row items-center justify-between">
        <div className="flex h-full items-center gap-3">
          <NavButton onClick={menuClick}>
            {showSidebar ? (
              <CloseIcon className="aspect-square h-full md:hidden" />
            ) : (
              <BurgerMenuIcon className="aspect-square h-full md:hidden" />
            )}
            <BurgerMenuIcon className="hidden aspect-square h-full md:block" />
          </NavButton>
          <NavButton>
            <Link
              to="/app"
              className="flex h-full w-full items-center justify-center"
            >
              <HomeIcon className="aspect-square h-4/5" />
            </Link>
          </NavButton>
        </div>

        <div className="flex gap-3">
          <NavButton>
            <PlusIcon className="aspect-square h-4/5" />
          </NavButton>
          <NavButton hoverState={false}>
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-50 text-red-600">
              <ProfileIcon className="aspect-square h-4/5" />
            </div>
          </NavButton>
        </div>
      </div>
    </header>
  );
};

interface NavButtonProps {
  onClick?: () => void;
  hoverState?: boolean;
}

interface HeaderProps {
  menuClick: () => void;
  showSidebar: boolean;
}
