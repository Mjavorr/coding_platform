package com.codingplatform.backend.repository;

import com.codingplatform.backend.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}