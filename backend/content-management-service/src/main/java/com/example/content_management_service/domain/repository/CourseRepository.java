package com.example.content_management_service.domain.repository;

import com.example.content_management_service.domain.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // 1. Các hàm mặc định đã có sẵn nhờ JpaRepository:
    // - save(Course course)
    // - findById(Long id)
    // - findAll()
    // - deleteById(Long id)

    // 2. Hàm mở rộng (Optional - Thêm vào để tiện cho chức năng tìm kiếm sau này)

    // Tìm kiếm khóa học theo tên (Ví dụ: tìm chữ "Java" trong "Lập trình Java")
    // IgnoreCase: Không phân biệt hoa thường
    List<Course> findByTitleContainingIgnoreCase(String keyword);

    // Kiểm tra xem khóa học đã tồn tại chưa (tránh trùng tên)
    boolean existsByTitle(String title);
}