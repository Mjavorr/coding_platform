package com.codingplatform.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "subject_id")
    private Long subjectId;
    @Column(name = "teacher_id")
    private Long teacherId;
    @Column(name = "day_of_week")
    private Integer dayOfWeek;
    @Column(name = "start_time")
    private String startTime;
    private String semester;
    private Integer year;

    public Long getId() { return id; }
    public Long getSubjectId() { return subjectId; }
    public Long getTeacherId() { return teacherId; }
    public Integer getDayOfWeek() { return dayOfWeek; }
    public String getStartTime() { return startTime; }
    public String getSemester() { return semester; }
    public Integer getYear() { return year; }
}