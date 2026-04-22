package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findBySubmissionId(Long submissionId);
}