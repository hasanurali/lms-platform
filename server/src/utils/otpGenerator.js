const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpHtml = (otp) => {
    return `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
    .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    h1 {
        color: #333;
    }   p {
        font-size: 18px;
        color: #555;
    }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p class="otp">Your OTP is: ${otp}</p>
        <p>Please use this OTP to complete your verification process. This OTP is valid for 10 minutes.</p>
    </div>
</body>
</html>`;
};

export { generateOtp, getOtpHtml };