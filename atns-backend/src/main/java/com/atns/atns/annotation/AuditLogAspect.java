package com.atns.atns.annotation;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class AuditLogAspect {

    @Around("@annotation(auditLog)")
    public Object auditLog(ProceedingJoinPoint joinPoint, AuditLog auditLog) throws Throwable {
        String action = auditLog.action();
        String entityType = auditLog.entityType();

        log.info("Audit: {} - {} initiated", action, entityType);

        try {
            Object result = joinPoint.proceed();
            log.info("Audit: {} - {} completed successfully", action, entityType);
            return result;
        } catch (Exception e) {
            log.error("Audit: {} - {} failed: {}", action, entityType, e.getMessage());
            throw e;
        }
    }
}
