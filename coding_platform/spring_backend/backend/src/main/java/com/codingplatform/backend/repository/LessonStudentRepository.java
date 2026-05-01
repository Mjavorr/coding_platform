package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.LessonStudent;
import com.codingplatform.backend.model.LessonStudentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonStudentRepository extends JpaRepository<LessonStudent, LessonStudentId> {
    List<LessonStudent> findByIdLessonId(Long lessonId);
    @Query("SELECT ls FROM LessonStudent ls WHERE ls.id.userId = :userId")
    List<LessonStudent> findByUserId(@Param("userId") Long userId);
}