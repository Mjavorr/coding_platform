package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdAndExerciseId(Long userId, Long exerciseId);
    List<Submission> findByUserIdAndExerciseIdOrderBySubmittedAtDesc(Long userId, Long exerciseId);
}