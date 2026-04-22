package com.codingplatform.backend.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class LessonExerciseId implements Serializable {
    private Long lessonId;
    private Long exerciseId;

    public LessonExerciseId() {}
    public LessonExerciseId(Long lessonId, Long exerciseId) {
        this.lessonId = lessonId;
        this.exerciseId = exerciseId;
    }

    public Long getLessonId() { return lessonId; }
    public Long getExerciseId() { return exerciseId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LessonExerciseId)) return false;
        LessonExerciseId that = (LessonExerciseId) o;
        return Objects.equals(lessonId, that.lessonId) && Objects.equals(exerciseId, that.exerciseId);
    }

    @Override
    public int hashCode() { return Objects.hash(lessonId, exerciseId); }
}