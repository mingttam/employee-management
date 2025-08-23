package com.project.employeeApi.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.employeeApi.dtos.EmployeeDto;
import com.project.employeeApi.dtos.EmployeeRequestDto;
import com.project.employeeApi.dtos.UpdateEmployeeRequestDto;
import com.project.employeeApi.entity.EmployeeEntity;
import com.project.employeeApi.exceptions.CustomExceptions.EmailAlreadyExistsException;
import com.project.employeeApi.exceptions.CustomExceptions.EmployeeNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.project.employeeApi.repositories.EmployeeRepository;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmployeeServices {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public EmployeeDto createEmployee(EmployeeRequestDto employeeRequestDto) {

        if (employeeRepository.existsByEmail(employeeRequestDto.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        EmployeeEntity employee = new EmployeeEntity();
        employee.setFullName(employeeRequestDto.getFullName());
        employee.setEmail(employeeRequestDto.getEmail());
        employee.setHashedPassword(passwordEncoder.encode(employeeRequestDto.getPassword()));
        employee.setDateOfBirth(employeeRequestDto.getDateOfBirth());
        employee.setGender(employeeRequestDto.getGender());
        employee.setPhoneNumber(employeeRequestDto.getPhoneNumber());
        employee.setActive(employeeRequestDto.isActive());
        employee.setCreatedAt(java.time.LocalDateTime.now());

        EmployeeEntity savedEmployee = employeeRepository.save(employee);

        return convertToDto(savedEmployee);

    }

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        return convertToDto(employee);
    }

    public EmployeeDto updateEmployee(Long id, UpdateEmployeeRequestDto request) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty())
            employee.setFullName(request.getFullName().trim());

        if (request.getDateOfBirth() != null)
            employee.setDateOfBirth(request.getDateOfBirth());

        if (request.getGender() != null)
            employee.setGender(request.getGender());

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty())
            employee.setPhoneNumber(request.getPhoneNumber().trim());

        employee.setActive(request.isActive());

        employee.setUpdatedAt(java.time.LocalDateTime.now());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            employee.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        }

        EmployeeEntity updatedEmployee = employeeRepository.save(employee);

        return convertToDto(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));

        employeeRepository.delete(employee);
    }

    private EmployeeDto convertToDto(EmployeeEntity employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setFullName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setGender(employee.getGender());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setActive(employee.isActive());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }
}
