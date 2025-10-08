import React, { useEffect } from "react";
import ProfileSettings from "../components/Settings/ProfileSettings";
import { useAuthContext } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import type { UserProfileSettings } from "../types/workspace";
import toast from "react-hot-toast";
import { appActions } from "../store/appSlice";

const ProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.app.userProfile);
  const updateUserProfile = useSelector(
    (state: RootState) => state.app.updateUserProfile
  );

  useEffect(() => {
    const updateUserProfileFn = async (userProfile: UserProfileSettings) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProfile),
        });

        const data = await res.json();
        if (res.status === 400 || res.status === 403 || res.status === 404) {
          if (data.errors) {
            toast.error(data?.errors[0].message);
          } else {
            toast.error(data.message);
          }
        }
        if (res.status === 200) {
          if (userProfile.email !== user?.email) {
            toast.success("Please login again to verify your identity");
            setTimeout(() => {
              dispatch(appActions.setIsLogout(true));
            }, 3000);
          } else {
            toast.success("User profile updated successfully!");
          }
        }
        dispatch(appActions.setUpdateUserProfile(null));
      } catch (_) {
        toast.error("Failed to update user profile. Please try again.");
      }
    };

    if (updateUserProfile) {
      updateUserProfileFn(updateUserProfile);
    }
  }, [dispatch, updateUserProfile, user?.email]);

  return (
    <div className="px-6 pb-6">
      <ProfileSettings
        initialData={userProfile || null}
        provider={user?.provider || null}
      />
    </div>
  );
};

export default ProfilePage;
