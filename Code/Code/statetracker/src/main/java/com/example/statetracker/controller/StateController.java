package com.example.statetracker.controller;

import com.example.statetracker.StateVisit;
import com.example.statetracker.User;
import com.example.statetracker.repository.StateVisitRepository;
import com.example.statetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/states")
@CrossOrigin(origins = "http://localhost:8080")
public class StateController {

    @Autowired
    private StateVisitRepository stateVisitRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/visit/{stateCode}")
    public ResponseEntity<?> visitState(@PathVariable String stateCode, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        if (!stateVisitRepository.existsByUserAndStateCode(user, stateCode)) {
            StateVisit visit = new StateVisit();
            visit.setUser(user);
            visit.setStateCode(stateCode);
            stateVisitRepository.save(visit);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("visited", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/visited")
    public ResponseEntity<?> getVisitedStates(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(stateVisitRepository.findByUser(user)
                .stream()
                .map(StateVisit::getStateCode)
                .toList());
    }
}