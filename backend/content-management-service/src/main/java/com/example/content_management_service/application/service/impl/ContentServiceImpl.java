package com.example.content_management_service.application.service.impl;

import com.example.content_management_service.domain.entity.LearningContent;
import com.example.content_management_service.domain.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentServiceImpl {

    private final ContentRepository repository;

    // --- 1. CREATE (Tạo mới) ---
    public LearningContent createContent(LearningContent content) {
        // Hàm save() của JPA: Nếu chưa có ID -> INSERT
        return repository.save(content);
    }

    // --- 2. READ (Đọc dữ liệu) ---
    public List<LearningContent> getAll() {
        // Hàm findAll() của JPA: -> SELECT *
        return repository.findAll();
    }

    public LearningContent getById(Long id) {
        // Hàm findById() -> SELECT * WHERE id = ?
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài học ID: " + id));
    }

    // --- 3. UPDATE (Cập nhật) ---
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu
    public LearningContent updateContent(Long id, LearningContent newInfo) {
        // Bước 1: Tìm bản ghi cũ
        LearningContent current = getById(id);

        // Bước 2: Cập nhật thông tin mới vào object java
        current.setTitle(newInfo.getTitle());
        current.setType(newInfo.getType());
        current.setUrl(newInfo.getUrl());
        current.setTopic(newInfo.getTopic());

        // Bước 3: Lưu lại
        // Hàm save() của JPA: Nếu ĐÃ có ID -> UPDATE
        return repository.save(current);
    }

    // --- 4. DELETE (Xóa) ---
    public void deleteContent(Long id) {
        // Hàm deleteById() -> DELETE FROM ... WHERE id = ?
        repository.deleteById(id);
    }
}