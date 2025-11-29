package com.example.content_management_service.application.service;

import com.example.content_management_service.dto.ContentDTO;
import java.util.List;

public interface ContentService {
    ContentDTO createContent(ContentDTO dto);
    List<ContentDTO> getAllContents();
    List<ContentDTO> getContentsByTopic(String topic);
    ContentDTO updateContent(Long id, ContentDTO dto);
    void deleteContent(Long id);
}