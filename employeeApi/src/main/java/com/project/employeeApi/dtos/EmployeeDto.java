package com.project.employeeApi.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.employeeApi.entity.EmployeeEntity;

@Data
@NoArgsConstructor
public class EmployeeDto {

    private Long id;

    private String fullName;

    private String email;

    private LocalDate dateOfBirth;

    private EmployeeEntity.Gender gender;

    private String phoneNumber;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
