package com.codingplatform.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@IdClass(UserProgressId.class)
public class UserProgress {
    @Id
    @Column(name = "user_id")
    private Long userId;
    @Id
    @Column(name = "exercise_id")
    private Long exerciseId;
    @Column(name = "best_score")
    private Integer bestScore;
    private Integer attempts;
    @Column(name = "last_attempted_at")
    private LocalDateTime lastAttemptedAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public Long getUserId() { return userId; }
    public Long getExerciseId() { return exerciseId; }
    public Integer getBestScore() { return bestScore; }
    public Integer getAttempts() { return attempts; }
    public LocalDateTime getLastAttemptedAt() { return lastAttemptedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
    public void setBestScore(Integer bestScore) { this.bestScore = bestScore; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    public void setLastAttemptedAt(LocalDateTime lastAttemptedAt) { this.lastAttemptedAt = lastAttemptedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
