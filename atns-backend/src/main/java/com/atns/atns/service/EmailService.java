package com.atns.atns.service;

import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.enums.OtpType;

import java.util.List;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String text);
    void sendHtmlEmail(String to, String subject, String htmlContent);
    void sendOtpEmail(String to, String code, OtpType type);
    void sendWelcomeEmail(String to, String userName);
    void sendPasswordResetSuccess(String to, String userName);
    void sendEmailUpdateSuccess(String to, String userName);
    void sendEventRecommendation(String to, String userName, List<EventResponseDto> events);
    void sendPasswordChangeSuccess(String to, String userName);
}
