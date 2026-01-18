package com.digitallibrary.digital_library.controllers; 

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")  
public class TestController {

    @GetMapping("/test")   
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "¡Backend funcionando correctamente!");
        response.put("status", "OK");
        response.put("timestamp", new Date().toString());
        response.put("springBootVersion", "3.5.8");
        response.put("database", "MySQL - XAMPP");
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new Date().toString());
        response.put("port", "8080");
        return response;
    }

    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("received", data);
        response.put("message", "Datos recibidos correctamente");
        response.put("success", true);
        response.put("timestamp", new Date().toString());
        return response;
    }
}
