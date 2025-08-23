package com.project.employeeApi.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.employeeApi.entity.EmployeeEntity;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeRequestDto {

    @Size(min = 4, max = 160, message = "Full name must be between 4 and 160 characters")
    private String fullName;

    private LocalDate dateOfBirth;

    private EmployeeEntity.Gender gender;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    private boolean active = true;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
