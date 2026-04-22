package com.codingplatform.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "exercises")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "subject_id")
    private Long subjectId;
    private String title;
    private String description;
    @Column(name = "starter_code")
    private String starterCode;
    @Column(name = "is_published")
    private Boolean isPublished;

    @OneToMany(mappedBy = "exercise", fetch = FetchType.EAGER)
    private List<TestCase> testCases;

    // Getters and setters
    public Long getId() { return id; }
    public Long getSubjectId() { return subjectId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getStarterCode() { return starterCode; }
    public Boolean getIsPublished() { return isPublished; }
    public Integer getTotalPoints() {
        if (testCases == null) return 0;
        return testCases.stream().mapToInt(TestCase::getPoints).sum();
    }
    public List<TestCase> getTestCases() { return testCases; }
}