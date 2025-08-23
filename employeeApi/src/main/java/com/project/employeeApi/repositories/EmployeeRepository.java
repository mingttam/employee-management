package com.project.employeeApi.repositories;

import org.springframework.stereotype.Repository;

import com.project.employeeApi.entity.EmployeeEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    Optional<EmployeeEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
