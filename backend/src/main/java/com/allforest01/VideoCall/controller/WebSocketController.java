package com.allforest01.VideoCall.controller;

import com.allforest01.VideoCall.service.VideoCallService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private VideoCallService videoCallService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/testServer")
    @SendTo("/topic/testServer")
    public String testServer(String Test) {
        System.out.println("Testing Server: " + Test);
        return Test;
    }

    @MessageMapping("/registerCSR")
    public void registerCSR(String csrMessage) {
        JSONObject jsonObject = new JSONObject(csrMessage);
        String csrID = jsonObject.getString("csrID");
        System.out.println("Registering CSR: " + csrID);
        videoCallService.registerCSR(csrID);
        System.out.println("CSR Registered Successfully: " + csrID);
    }

    @MessageMapping("/callCSR")
    public void callCSR(String callMessage) {
        JSONObject jsonObject = new JSONObject(callMessage);
        String customerID = jsonObject.getString("callFrom");
        System.out.println("Call CSR message received from customer: " + customerID);

        String csrID = videoCallService.getNextAvailableCSR();
        if (csrID != null) {
            System.out.println("Connecting customer " + customerID + " to CSR " + csrID);
            simpMessagingTemplate.convertAndSendToUser(csrID, "/topic/call", customerID);
            simpMessagingTemplate.convertAndSendToUser(customerID, "/topic/connectedCSR", csrID);
        } else {
            System.out.println("No available CSRs for customer " + customerID);
            simpMessagingTemplate.convertAndSendToUser(customerID, "/topic/noCSRAvailable", "No CSR available at the moment. Please try again later.");
        }
    }

    @MessageMapping("/offer")
    public void offer(String offerMessage) {
        System.out.println("Offer message received: " + offerMessage);
        JSONObject jsonObject = new JSONObject(offerMessage);
        String toUser = jsonObject.getString("toUser");
        System.out.println("Forwarding offer to user: " + toUser);
        simpMessagingTemplate.convertAndSendToUser(toUser, "/topic/offer", offerMessage);
        System.out.println("Offer Sent to user: " + toUser);
    }

    @MessageMapping("/answer")
    public void answer(String answerMessage) {
        System.out.println("Answer message received: " + answerMessage);
        JSONObject jsonObject = new JSONObject(answerMessage);
        String toUser = jsonObject.getString("toUser");
        System.out.println("Forwarding answer to user: " + toUser);
        simpMessagingTemplate.convertAndSendToUser(toUser, "/topic/answer", answerMessage);
        System.out.println("Answer Sent to user: " + toUser);
    }

    @MessageMapping("/candidate")
    public void candidate(String candidateMessage) {
        System.out.println("Candidate message received: " + candidateMessage);
        JSONObject jsonObject = new JSONObject(candidateMessage);
        String toUser = jsonObject.getString("toUser");
        if (toUser == null || toUser.isEmpty()) {
            System.out.println("Missing toUser in candidate message: " + candidateMessage);
            return; // Skip sending if toUser is missing
        }
        System.out.println("Forwarding candidate to user: " + toUser);
        simpMessagingTemplate.convertAndSendToUser(toUser, "/topic/candidate", candidateMessage);
        System.out.println("Candidate Sent to user: " + toUser);
    }

    @MessageMapping("/endCall")
    public void endCall(String endCallMessage) {
        JSONObject jsonObject = new JSONObject(endCallMessage);
        String toUser = jsonObject.getString("toUser");
        simpMessagingTemplate.convertAndSendToUser(toUser, "/topic/endCall", endCallMessage);
    }
}
