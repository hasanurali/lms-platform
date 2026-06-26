const getNotificationLink = (notification) => {
    const { type, metadata } = notification;

    switch (type) {
        case "doubt":
            return `/courses/${metadata.course}/lessons/${metadata.lesson}`;

        case "enrollment":
            return `/courses/${metadata.course}`;

        case "progress":
            return `/courses/${metadata.course}`;

        case "review":
            return `/courses/${metadata.course}`;

        case "course":
            return `/courses/${metadata.course}`;

        case "system":
            return "/dashboard";

        default:
            return "/";
    }
};

export default getNotificationLink;