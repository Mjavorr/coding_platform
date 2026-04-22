package com.codingplatform.backend.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class LessonStudentId implements Serializable {
    private Long lessonId;
    private Long userId;

    public LessonStudentId() {}
    public LessonStudentId(Long lessonId, Long userId) {
        this.lessonId = lessonId;
        this.userId = userId;
    }

    public Long getLessonId() { return lessonId; }
    public Long getUserId() { return userId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LessonStudentId)) return false;
        LessonStudentId that = (LessonStudentId) o;
        return Objects.equals(lessonId, that.lessonId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() { return Objects.hash(lessonId, userId); }
}