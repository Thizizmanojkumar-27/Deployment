package com.codenexuss.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAiResponse(String userMessage) {
        try {
            String fullUrl = "https://api.bytez.com/models/v2/openai/gpt-4.1-mini";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Key " + apiKey.trim());

            Map<String, String> msgNode = new HashMap<>();
            msgNode.put("role", "user");
            msgNode.put("content", userMessage);

            Map<String, Object> body = new HashMap<>();
            body.put("input", Collections.singletonList(msgNode));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> bodyData = response.getBody();
                if (bodyData.containsKey("output") && bodyData.get("output") instanceof Map) {
                    Map<String, Object> output = (Map<String, Object>) bodyData.get("output");
                    if (output.containsKey("content")) {
                        return (String) output.get("content");
                    }
                }
            }
            return "Empty response from API.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling API: " + e.getMessage();
        }
    }
}
