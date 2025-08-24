package com.project.employeeApi.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.employeeApi.dtos.ApiResponse;
import com.project.employeeApi.dtos.EmployeeDto;
import com.project.employeeApi.dtos.EmployeeRequestDto;
import com.project.employeeApi.dtos.UpdateEmployeeRequestDto;
import com.project.employeeApi.services.EmployeeServices;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated

public class EmployeeController {

    private final EmployeeServices employeeService;

    @PostMapping("/employees")
    public ResponseEntity<ApiResponse<EmployeeDto>> createEmployee(@RequestBody @Valid EmployeeRequestDto req) {
        EmployeeDto createdEmployeeDto = employeeService.createEmployee(req);
        ApiResponse<EmployeeDto> response = ApiResponse.success(createdEmployeeDto, "Employee created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<List<EmployeeDto>>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        ApiResponse<List<EmployeeDto>> response = ApiResponse.success(employees, "Employees retrieved successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<ApiResponse<EmployeeDto>> getEmployeeById(@PathVariable Long id) {
        EmployeeDto foundEmployee = employeeService.getEmployeeById(id);
        ApiResponse<EmployeeDto> response = ApiResponse.success(foundEmployee, "Employee retrieved successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateEmployee(@PathVariable Long id,
            @RequestBody @Valid UpdateEmployeeRequestDto req) {
        EmployeeDto updatedEmployee = employeeService.updateEmployee(id, req);
        ApiResponse<EmployeeDto> response = ApiResponse.success(updatedEmployee, "Employee updated successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        ApiResponse<Void> response = ApiResponse.success(null, "Employee deleted successfully");
        return ResponseEntity.ok(response);
    }

}
