package com.codenexuss.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private com.codenexuss.backend.service.GeminiService geminiService;

    @GetMapping("/response")
    public Map<String, String> getChatResponse(@RequestParam String message) {
        String botResponse = geminiService.getAiResponse(message);

        Map<String, String> response = new HashMap<>();
        response.put("response", botResponse);
        return response;
    }
}
