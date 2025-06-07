package com.pet_care_management.pet.repository;

import com.pet_care_management.pet.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    // Find by pet owner
    @Query("SELECT a FROM Appointment a WHERE a.pet.owner.id = :ownerId")
    List<Appointment> findByPetOwnerId(@Param("ownerId") Integer ownerId);

    // Find by pet
    List<Appointment> findByPetId(Integer petId);

    // Find by date
    @Query("SELECT a FROM Appointment a WHERE DATE(a.appointmentDate) = DATE(:date)")
    List<Appointment> findByDate(@Param("date") LocalDateTime date);

    // Find by month and year
    @Query("SELECT a FROM Appointment a WHERE YEAR(a.appointmentDate) = :year AND MONTH(a.appointmentDate) = :month")
    List<Appointment> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    // Find by status
    List<Appointment> findByStatus(String status);

    // Find by date range
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate AND a.status IN ('PENDING', 'SCHEDULED')")
    List<Appointment> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Calculate total revenue for completed appointments
    @Query("SELECT SUM(s.price) FROM Appointment a JOIN a.services s WHERE a.status = 'COMPLETED' AND a.appointmentDate BETWEEN :startDate AND :endDate")
    Integer calculateTotalRevenue(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Get completed appointments with revenue details
    @Query("SELECT a FROM Appointment a WHERE a.status = 'COMPLETED' AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findCompletedAppointmentsWithRevenue(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    boolean existsByPetIdAndStatusIn(Integer petId, List<String> statuses);
} 