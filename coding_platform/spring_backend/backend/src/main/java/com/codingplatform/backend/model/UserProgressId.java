package com.codingplatform.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class UserProgressId implements Serializable {
    private Long userId;
    private Long exerciseId;

    public UserProgressId() {}
    public UserProgressId(Long userId, Long exerciseId) {
        this.userId = userId;
        this.exerciseId = exerciseId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserProgressId)) return false;
        UserProgressId that = (UserProgressId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(exerciseId, that.exerciseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, exerciseId);
    }
}