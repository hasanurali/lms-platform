const handleFieldApiErrors = (error, setError) => {
    const apiErrors = error?.response?.data?.errors;

    if (!Array.isArray(apiErrors)) return;

    // Group errors by field, keeping only the first message per field
    const grouped = apiErrors.reduce((acc, { path, msg }) => {

        // Ensure path exists before using it as a key
        if (path && !acc[path]) {
            acc[path] = msg;
        }
        return acc;
    }, {});

    // set errors in the form state
    Object.entries(grouped).forEach(([field, message]) => {
        setError(field, {
            type: "server",
            message: message
        });
    });
};


export default handleFieldApiErrors;