package com.example.statetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.statetracker")  //  ADD THIS
public class StatetrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(StatetrackerApplication.class, args);
    }
}