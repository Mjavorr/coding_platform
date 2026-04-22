package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByExerciseId(Long exerciseId);
}