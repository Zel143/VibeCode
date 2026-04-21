import { NavLink } from 'react-router-dom';
import { Home, Trophy, Gamepad2, User } from 'lucide-react';
import './TabBar.css';

const tabs = [
  { path: '/', icon: Home, label: 'Today' },
  { path: '/leagues', icon: Trophy, label: 'Leagues' },
  { path: '/games', icon: Gamepad2, label: 'Games' },
  { path: '/me', icon: User, label: 'Me' },
];

export default function TabBar() {
  return (
    <nav className="tabbar" id="main-tabbar">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `tabbar-item ${isActive ? 'active' : ''}`}
          id={`tab-${tab.label.toLowerCase()}`}
        >
          {({ isActive }) => (
            <>
              <div className="tabbar-icon-wrap">
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className="tabbar-active-dot" />}
              </div>
              <span className="tabbar-label">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
