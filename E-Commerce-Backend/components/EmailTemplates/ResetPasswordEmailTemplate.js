const ResetPasswordEmailTemplate = (resetUrl) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://your-logo-url.com" alt="Logo" style="max-width: 150px;" />
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #091540; text-align: center; margin-bottom: 20px; font-size: 24px;">Password Reset Request</h1>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px; text-align: center;">
                    We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #091540, #3D518C);
                              color: white; text-decoration: none; border-radius: 5px; font-weight: bold;
                              box-shadow: 0 4px 6px rgba(9, 21, 64, 0.2);">
                        Reset Password
                    </a>
                </div>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px; text-align: center;">
                    This password reset link will expire in 30 minutes for security reasons.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="color: #999; font-size: 14px;">
                        If you're having trouble clicking the button, copy and paste this URL into your browser:
                        <br>
                        <span style="color: #3D518C;">${resetUrl}</span>
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} E-Commerce. All rights reserved.
                </p>
            </div>
        </div>
    `;
};

module.exports = ResetPasswordEmailTemplate;