// Import required packages
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); // in local, run `npm install dotenv` if needed

// Load environment variables from .env file
dotenv.config();

// Create reusable transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // true for 465, false for other ports (587 in this case for STARTTLS)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },

});

function buildCommentReplyEmail({ authorName, articleTitle, articleUrl, commentUrl, recipientEmail }) {
    const text = `${authorName} به کامنت شما در یادداشت زیر پاسخ داده است:\n\n${articleTitle}: ${articleUrl}\n\nلینک کامنت: ${commentUrl}`;

    const html = `
        <div style="margin:0;padding:0;background-color:#f5f5f5;font-family:Tahoma,Arial,sans-serif;color:#1f2937;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;margin:0;padding:32px 0;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

                            <tr>
                                <td style="padding:18px 28px;text-align:right;direction:rtl;line-height:1.9;font-size:16px;color:#111827;">
                                    ${authorName} به کامنت شما در یادداشت زیر پاسخ داده است:
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:0 28px 20px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                                        <tr>
                                            <td style="padding:18px 20px;text-align:right;direction:rtl;">
                                                <a href="${articleUrl}" style="display:inline-block;color:#e37b3e;text-decoration:none;font-weight:bold;font-size:16px;">${articleTitle}</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:0 28px 22px;text-align:right;direction:rtl;">
                                    <div style="font-size:14px;color:#374151;margin-bottom:8px;">لینک کامنت:</div>
                                    <a href="${commentUrl}" style="color:#e37b3e;text-decoration:none;font-weight:bold;">${commentUrl}</a>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:20px 28px 28px;background:#fafafa;border-top:1px solid #e5e7eb;text-align:center;direction:rtl;">
                                    <div style="font-size:12px;color:#6b7280;line-height:1.8;">از اینکه در سایت ifard.ir کامنت گذاشتید ممونم.</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    `;

    return {
        from: `"ifard.ir" <${process.env.MAIL_FROM}>`,
        to: recipientEmail,
        subject: 'پاسخ جدید به کامنت شما',
        text,
        html
    };
}

const payload = {
    authorName: 'حسین فردمحمدی',
    articleTitle: 'نمونه عنوان یادداشت',
    articleUrl: 'https://ifard.ir/example',
    commentUrl: 'https://ifard.ir/example#comment-141',
    recipientEmail: 'example@gmail.com'
};

const mailOptions = buildCommentReplyEmail(payload);

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred: ' + error.message);
    }
    console.log('Email sent: ' + info.response);
});
