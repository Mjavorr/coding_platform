package com.codingplatform.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_exercises")
public class LessonExercise {
    @EmbeddedId
    private LessonExerciseId id;
    @Column(name = "due_date")
    private LocalDateTime dueDate;

    public LessonExerciseId getId() { return id; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setId(LessonExerciseId id) { this.id = id; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}