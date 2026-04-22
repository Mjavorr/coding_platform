package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.LessonExercise;
import com.codingplatform.backend.model.LessonExerciseId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonExerciseRepository extends JpaRepository<LessonExercise, LessonExerciseId> {
    List<LessonExercise> findByIdExerciseId(Long exerciseId);
    void deleteByIdLessonIdAndIdExerciseId(Long lessonId, Long exerciseId);
}