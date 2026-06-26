import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const getNotificationConfig = (type) => {
    switch (type) {
        case "system":
            return {
                icon: <SettingsSuggestIcon />,
                bg: "#EEF2FF",
                color: "#4338CA",
            };

        case "enrollment":
            return {
                icon: <SchoolIcon />,
                bg: "#ECFDF5",
                color: "#059669",
            };

        case "progress":
            return {
                icon: <WorkspacePremiumIcon />,
                bg: "#FEF3C7",
                color: "#D97706",
            };

        case "doubt":
            return {
                icon: <HelpOutlineIcon />,
                bg: "#F3E8FF",
                color: "#9333EA",
            };

        case "review":
            return {
                icon: <RateReviewIcon />,
                bg: "#FCE7F3",
                color: "#DB2777",
            };

        case "course":
            return {
                icon: <MenuBookIcon />,
                bg: "#DBEAFE",
                color: "#2563EB",
            };

        default:
            return {
                icon: <NotificationsNoneIcon />,
                bg: "#F1F5F9",
                color: "#64748B",
            };
    }
};

export default getNotificationConfig;