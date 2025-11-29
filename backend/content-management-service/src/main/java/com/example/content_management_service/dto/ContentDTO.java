package com.example.content_management_service.dto;

import com.example.content_management_service.domain.entity.ContentType;
import lombok.Data;

@Data
public class ContentDTO {
    private Long id;
    private String title;
    private ContentType type;
    private String url;
    private String topic;
    private String description;
}