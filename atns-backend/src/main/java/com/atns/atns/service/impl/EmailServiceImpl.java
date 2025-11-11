package com.atns.atns.service.impl;

import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.enums.OtpType;
import com.atns.atns.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Value("${APP_EMAIL_FROM}")
    private String fromEmail;


    @Override
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("HTML Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    @Override
    public void sendOtpEmail(String to, String code, OtpType type) {
        try {
            String subject = getOtpSubject(type);
            String htmlContent = buildOtpEmailHtml(code, type);

            sendHtmlEmail(to, subject, htmlContent);

        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    @Override
    public void sendWelcomeEmail(String to, String userName) {
        String subject = "Welcome to Alumni Network!";
        String htmlContent = buildWelcomeEmailHtml(userName);
        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPasswordResetSuccess(String to, String userName) {
        String subject = "Password Reset Successful - Alumni Network";
        String htmlContent = buildPasswordResetSuccessHtml(userName);
        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendPasswordChangeSuccess(String to, String userName) {
        String subject = "Password Change Successful - Alumni Network";
        String htmlContent = buildPasswordChangeSuccessHtml(userName);
        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendEmailUpdateSuccess(String to, String userName) {
        String subject = "Email Updated Successful - Alumni Network";
        String htmlContent = buildEmailUpdateSuccessHtml(userName);
        sendHtmlEmail(to, subject, htmlContent);
    }

    @Override
    public void sendEventRecommendation(String to, String userName, List<EventResponseDto> events) {

    }

    private String getOtpSubject(OtpType type) {
        return switch (type) {
            case REGISTRATION -> "Verify Your Email - ATNS";
            case EMAIL_UPDATE -> "Confirm Email Update - ATNS";
            case PASSWORD_RESET -> "Reset Your Password - ATNS";
        };
    }

    private String getOtpAction(OtpType type) {
        return switch (type) {
            case REGISTRATION -> "verify your email address and activate your account";
            case EMAIL_UPDATE -> "confirm your email address update";
            case PASSWORD_RESET -> "reset your password";
        };
    }

    private String buildOtpEmailHtml(String code, OtpType type) {
        String action = getOtpAction(type);
        log.info("here we are");
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Alumni Network - Email Verification</h2>
                <p>Use the following verification code to %s:</p>
                <div style="font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; padding: 15px; background: #f8fafc; border: 2px dashed #e2e8f0;">
                    %s
                </div>
                <p><strong>This code will expire in 5 minutes.</strong></p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr>
                <p>Alumni Network Team</p>
            </div>
        </body>
        </html>
        """.formatted(action, code);
//        return """
//                 <!DOCTYPE html>
//                            <html>
//                            <head>
//                                <meta charset="UTF-8">
//                                <style>
//                                    body {\s
//                                        font-family: 'Arial', sans-serif;\s
//                                        line-height: 1.6;\s
//                                        color: #333;\s
//                                        margin: 0;
//                                        padding: 0;
//                                    }
//                                    .container {\s
//                                        max-width: 600px;\s
//                                        margin: 0 auto;\s
//                                        padding: 20px;
//                                        background: #ffffff;
//                                    }
//                                    .header {
//                                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                                        color: white;
//                                        padding: 30px;
//                                        text-align: center;
//                                        border-radius: 10px 10px 0 0;
//                                    }
//                                    .code {\s
//                                        font-size: 42px;\s
//                                        font-weight: bold;\s
//                                        color: #2563eb;\s
//                                        text-align: center;\s
//                                        margin: 30px 0;\s
//                                        padding: 25px;
//                                        background: #f8fafc;\s
//                                        border-radius: 10px;
//                                        border: 2px dashed #e2e8f0;
//                                        letter-spacing: 8px;
//                                    }
//                                    .footer {\s
//                                        margin-top: 30px;\s
//                                        padding-top: 20px;\s
//                                        border-top: 1px solid #e5e7eb;\s
//                                        font-size: 14px;\s
//                                        color: #6b7280;\s
//                                        text-align: center;
//                                    }
//                                </style>
//                            </head>
//                            <body>
//                                <div class="container">
//                                    <div class="header">
//                                        <h1>Alumni Network</h1>
//                                        <p>Connect • Grow • Succeed</p>
//                                    </div>
//                                   \s
//                                    <h2>Email Verification Required</h2>
//                                    <p>Use the following verification code to %s:</p>
//                                   \s
//                                    <div class="code">%s</div>
//                                   \s
//                                    <p><strong>This code will expire in 5 minutes.</strong></p>
//                                    <p>For security reasons, please do not share this code with anyone.</p>
//                                   \s
//                                    <div class="footer">
//                                        <p>If you didn't request this, please ignore this email.</p>
//                                        <p>&copy; 2024 Alumni Network. All rights reserved.</p>
//                                    </div>
//                                </div>
//                            </body>
//                            </html>
//                """.formatted(action, code);
    }

    private String buildWelcomeEmailHtml(String userName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Alumni Network!</h1>
                        </div>
                        <h2>Hi %s,</h2>
                        <p>We're excited to have you join our alumni community! 🎉</p>
                        <p>Get started by:</p>
                        <ul>
                            <li>📝 Completing your profile</li>
                            <li>🔗 Connecting with fellow alumni</li>
                            <li>🎪 Exploring events and opportunities</li>
                            <li>💼 Sharing your professional journey</li>
                        </ul>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <p><strong>Happy networking!</strong></p>
                        <p>The Alumni Network Team</p>
                    </div>
                </body>
                </html>
                """.formatted(userName);
    }

    private String buildPasswordResetSuccessHtml(String userName) {
        return """
                <!DOCTYPE html>
                <html>
                <body>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Password Reset Successful</h2>
                        <p>Hi %s,</p>
                        <p>Your password has been successfully reset.</p>
                        <p>If you did not make this change, please contact our support team immediately.</p>
                        <p><strong>The Alumni Network Team</strong></p>
                    </div>
                </body>
                </html>
                """.formatted(userName);
    }

    private String buildPasswordChangeSuccessHtml(String userName) {
        return """
                <!DOCTYPE html>
                <html>
                <body>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Password Change Successful</h2>
                        <p>Hi %s,</p>
                        <p>Your password has been successfully reset.</p>
                        <p>If you did not make this change, please contact our support team immediately.</p>
                        <p><strong>The Alumni Network Team</strong></p>
                    </div>
                </body>
                </html>
                """.formatted(userName);
    }

    private String buildEmailUpdateSuccessHtml(String userName) {
        return """
                <!DOCTYPE html>
                <html>
                <body>
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Email Updated Successfully</h2>
                        <p>Hi %s,</p>
                        <p>Your email address has been successfully updated.</p>
                        <p>All future communications will be sent to this new email address.</p>
                        <p><strong>The Alumni Network Team</strong></p>
                    </div>
                </body>
                </html>
                """.formatted(userName);
    }
}
