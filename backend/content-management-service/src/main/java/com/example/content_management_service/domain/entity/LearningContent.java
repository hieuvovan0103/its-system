package com.example.content_management_service.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learning_contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private ContentType type;

    private String url;

    private String topic;
}