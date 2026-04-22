package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.LessonStudent;
import com.codingplatform.backend.model.LessonStudentId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonStudentRepository extends JpaRepository<LessonStudent, LessonStudentId> {
    List<LessonStudent> findByIdLessonId(Long lessonId);
}