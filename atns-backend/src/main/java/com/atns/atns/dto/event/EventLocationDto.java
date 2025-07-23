package com.atns.atns.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventLocationDto {
    @Size(max = 500, message = "Address must be less than 500 characters")
    private String address;

    @URL(message = "Online link must be valid URL")
    @Size(max = 500, message = "Online link must be less than 500 characters")
    private String onlineLink;

    @Size(max = 30, message = "Room number must be less than 30 characters")
    private String roomNumber;

    @AssertTrue(message = "Must provide either address or online link")
    private boolean isLocationValid() {
        return address != null || onlineLink != null;
    }
}
