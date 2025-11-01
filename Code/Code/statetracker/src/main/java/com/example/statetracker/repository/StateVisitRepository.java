package com.example.statetracker.repository;

import com.example.statetracker.StateVisit;
import com.example.statetracker.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StateVisitRepository extends JpaRepository<StateVisit, Long> {
    List<StateVisit> findByUser(User user);
    boolean existsByUserAndStateCode(User user, String stateCode);
}