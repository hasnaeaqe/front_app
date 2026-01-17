package com.cabinet.medical.dto;

import com.cabinet.medical.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String titre;
    private String message;
    private String type;
    private Boolean lu;
    private LocalDateTime dateCreation;
    private LocalDateTime dateLecture;

    public static NotificationDTO fromEntity(Notification notification) {
        return new NotificationDTO(
            notification.getId(),
            notification.getTitre(),
            notification.getMessage(),
            notification.getType() != null ? notification.getType().name() : "INFO",
            notification.getLu(),
            notification.getDateCreation(),
            notification.getDateLecture()
        );
    }
}
