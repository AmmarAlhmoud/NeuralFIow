import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Menu, Pencil, Trash } from "lucide-react";
import type { TeamMember } from "../../types/workspace";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import { type Role } from "../../types/auth";

interface TeamMemberCardProps {
  member: TeamMember;
  currentUserRole: Role;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  currentUserRole,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isMenu, setIsMenu] = useState(false);

  const canSeeMenu = (currentUserRole: Role, targetRole: Role) => {
    if (currentUserRole === "admin") {
      // Admin sees menu for managers, members, and viewers
      return targetRole !== "admin";
    }
    if (currentUserRole === "manager") {
      // Manager sees menu only for member/viewer
      return ["member", "viewer"].includes(targetRole);
    }
    // Member or viewer never see the menu
    return false;
  };

  return (
    <div
      key={member._id}
      className="flex items-center justify-between px-1 py-4 sm:px-4 dark:bg-white/5 bg-black/5 rounded-xl dark:hover:bg-white/10 hover:bg-black/10 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={member.uid!.avatarURL || ""}
            alt={`${member.uid!.name?.split(" ")[0]} avatar`}
            className="hidden sm:block w-12 h-12 bg-gradient-to-r rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          />
          <div
            className={`hidden sm:block absolute -bottom-1 -right-1 w-4 h-4 ${
              member.uid!.isOnline ? "bg-green-500" : "bg-yellow-500"
            } rounded-full border-2 border-gray-900 ${
              member.uid!.isOnline ? "animate-pulse" : ""
            }`}
          ></div>
        </div>
        <div>
          <div className="font-semibold dark:text-white text-black">
            {member.uid!.name}
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-400">
            {member.uid!.position} • {member.uid!.email}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            member.role === "admin"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          }`}
        >
          {member.role.replace(member.role[0], member.role[0].toUpperCase()) ||
            "Member"}
        </span>
        <button className="text-black dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
          <div className="relative">
            {canSeeMenu(currentUserRole as Role, member?.role) && (
              <Menu
                className="w-5 h-5"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenu((prev) => !prev);
                }}
              />
            )}
            {isMenu && (
              <ul className="absolute top-5 right-5 w-36 rounded-lg rounded-tr-none shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-30 overflow-hidden animate-fade-in">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(appActions.setClickTeamMember(member));
                    dispatch(appActions.setInviteMembersModal(true));
                    setIsMenu((prev) => !prev);
                  }}
                  className="flex space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Pencil className="h-4.5 w-4.5 text-yellow-600  cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out" />
                  <span>Edit</span>
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(appActions.setClickTeamMember(member));
                    dispatch(appActions.setConfirmationModal(true));
                    setIsMenu((prev) => !prev);
                  }}
                  className="flex space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-600/30 cursor-pointer transition-colors"
                >
                  <Trash className="h-4.5 w-4.5 text-red-600 cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out" />
                  <span>Remove</span>
                </li>
              </ul>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default TeamMemberCard;
