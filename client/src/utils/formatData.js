const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
};

export default formatDate;