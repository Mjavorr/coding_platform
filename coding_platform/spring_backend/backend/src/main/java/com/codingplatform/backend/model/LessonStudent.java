package com.codingplatform.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lesson_students")
public class LessonStudent {
    @EmbeddedId
    private LessonStudentId id;

    public LessonStudentId getId() { return id; }
    public void setId(LessonStudentId id) { this.id = id; }
}