package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByIsPublishedTrue();
    List<Exercise> findByIsPublishedTrueAndSubjectId(Long subjectId);
}