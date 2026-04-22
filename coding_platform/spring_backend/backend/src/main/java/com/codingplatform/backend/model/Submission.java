package com.codingplatform.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "exercise_id")
    private Long exerciseId;
    private String code;
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    private String status;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getExerciseId() { return exerciseId; }
    public String getCode() { return code; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public String getStatus() { return status; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
    public void setCode(String code) { this.code = code; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setStatus(String status) { this.status = status; }
}
