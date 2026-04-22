package com.codingplatform.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "test_cases")
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "exercise_id", insertable = false, updatable = false)
    private Long exerciseId;
    private String input;
    @Column(name = "expected_output")
    private String expectedOutput;
    private Integer points;
    @Column(name = "is_hidden")
    private Boolean isHidden;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    @JsonIgnore
    private Exercise exercise;

    // Getters
    public Long getId() { return id; }
    public Long getExerciseId() { return exerciseId; }
    public String getInput() { return input; }
    public String getExpectedOutput() { return expectedOutput; }
    public Integer getPoints() { return points; }
    public Boolean getIsHidden() { return isHidden; }
}